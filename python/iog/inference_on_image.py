import os
from datetime import datetime
import base64
import numpy as np
import cv2
import torch
from torchvision import transforms
from shapely.geometry import Polygon

from dataloaders import custom_transforms as tr
from dataloaders.helpers import tens2image, get_bbox, crop2fullmask

from networks.refinementnetwork import Network

# from networks.mainnetwork import Network
from cache import Cache

# Constants for experiments
PADDING_PIXEL = 10
RELAX_PIXEL = 30
SIGMA_IOG_POINT_PIXEL = 10
SHAPE_IMAGE_MODEL = (512, 512)
MAX_PIXEL_INTENSITY = 255
THRESHOLD_PIXEL_INTENSITY = 127


def convert_openlayers_point_to_numpy_image_point(
    point: tuple, image_height: int
) -> tuple:
    return (int(point[0]), int(image_height - point[1]))


def convert_openlayers_roi_to_numpy_image_roi(roi: list, image_height: int) -> list:
    """In both openlayers and numpy, the same roi format applies

    Args:
        roi (list): roi in format [x, y, width, height]
        image_height (int): height of the original image from which the roi is cropped

    Returns:
        list: [description]
    """
    [x, y, width, height] = roi
    return [x, image_height - y - height, width, height]


def transform_contour_to_geojson_polygon(
    contour: list, imageHeight: int, roiHeight: int
) -> list:
    polygon = list(
        map(lambda item: transform_contour_item(item, imageHeight, roiHeight), contour)
    )
    return [*polygon, polygon[0]]


def transform_contour_item(item: list, imageHeight: int, roiHeight: int) -> list:
    [x, y] = item[0].tolist()
    return [x, imageHeight - y]


def simplify_geojson_coordinates(coordinates):
    polygon = Polygon(coordinates)
    simplified_polygon = polygon.simplify(2)
    return simplified_polygon.exterior.coords


def transform_contours_to_geojson_polygons(
    contours: list, imageHeight: int, roiHeight: int
) -> list:
    return list(
        map(
            lambda contour: simplify_geojson_coordinates(
                transform_contour_to_geojson_polygon(contour, imageHeight, roiHeight)
            ),
            filter(lambda contour: len(contour) > 2, contours),
        )
    )


def convert_data_url_to_image(data_url):
    # Decode image
    image_b64 = data_url.split(",")[1]
    binary = base64.b64decode(image_b64)
    image = np.asarray(bytearray(binary), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image


def convert_net_output_to_geojson_polygon(fine_net_output, gt_input, image, roi):
    pred = np.transpose(fine_net_output.to("cpu").data.numpy()[0, :, :, :], (1, 2, 0))
    pred = 1 / (1 + np.exp(-pred))
    pred = np.squeeze(pred)
    gt = tens2image(gt_input)
    bbox = get_bbox(
        gt, pad=RELAX_PIXEL, zero_pad=True
    )  # TODO: try to use bbox = roi directly?
    # print(
    #     f"""
    # gt.shape = {gt.shape}
    # bbox = {bbox}
    # roi = {[roi[0] - RELAX_PIXEL, roi[1] - RELAX_PIXEL, roi[0] + roi[2] + RELAX_PIXEL, roi[1] + roi[3] + RELAX_PIXEL]}
    # """
    # )
    result = crop2fullmask(
        pred, bbox, gt, zero_pad=True, relax=0, mask_relax=False, scikit=True
    )

    # find contours
    im_mask = (result * MAX_PIXEL_INTENSITY).astype(np.uint8)
    _, thresh = cv2.threshold(
        im_mask, THRESHOLD_PIXEL_INTENSITY, MAX_PIXEL_INTENSITY, 0
    )
    # kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (1, 1))
    # opening = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=1)
    # contours, _ = cv2.findContours(opening, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    if os.environ.get("DEBUG", False):
        light = np.zeros_like(image)
        light[:, :, 2] = float(MAX_PIXEL_INTENSITY)
        alpha = 0.5
        blending = (alpha * light + (1 - alpha) * image) * result[..., None] + (
            1 - result[..., None]
        ) * image
        blending[blending > float(MAX_PIXEL_INTENSITY)] = MAX_PIXEL_INTENSITY
        # im_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        # cv2.drawContours(im_rgb, contours, -1, (0, MAX_PIXEL_INTENSITY, 0), 3)
        now = datetime.now()
        os.makedirs("results", exist_ok=True)
        cv2.imwrite(f"results/result-{now}.jpg", blending)
        cv2.imwrite(f"results/mask-{now}.jpg", im_mask)
        cv2.imwrite(f"results/pred-{now}.jpg", pred * MAX_PIXEL_INTENSITY)
        # print(transform_contours_to_geojson_polygons(contours))

    return transform_contours_to_geojson_polygons(
        contours, imageHeight=image.shape[0], roiHeight=roi[3]
    )


# Network definition
net = Network(
    nInputChannels=5,
    num_classes=1,
    backbone="resnet101",
    output_stride=16,
    sync_bn=None,
    freeze_bn=False,
    pretrained=False,
)

# load pretrain_dict
pretrain_dict = torch.load("data/IOG_PASCAL_SBD_REFINEMENT.pth")
# pretrain_dict = torch.load("data/IOG_PASCAL_SBD.pth")
net.load_state_dict(pretrain_dict)
net.eval()

# Set gpu_id to -1 to run in CPU mode, otherwise set the id of the corresponding gpu
gpu_id = 0
device = torch.device(
    "cuda:" + str(gpu_id)
    if torch.cuda.is_available() and not os.environ.get("RUN_ON_CPU", False)
    else "cpu"
)
if torch.cuda.is_available():
    if os.environ.get("RUN_ON_CPU", False):
        print("GPU available but will use CPU")
    else:
        print("GPU available, will use it")
else:
    print("GPU unavailable, will use CPU")
net.to(device)

trns = transforms.Compose(
    [
        tr.CropFromMask(
            crop_elems=("image", "gt", "void_pixels"), relax=RELAX_PIXEL, zero_pad=True
        ),
        tr.FixedResize(
            resolutions={
                "gt": None,
                "roi": None,
                "point_center": None,
                "points_foreground_refinement": None,
                "points_background_refinement": None,
                "crop_image": SHAPE_IMAGE_MODEL,
                "crop_gt": SHAPE_IMAGE_MODEL,
                "crop_void_pixels": SHAPE_IMAGE_MODEL,
            },
            flagvals={
                "gt": None,
                "roi": None,
                "point_center": None,
                "points_foreground_refinement": None,
                "points_background_refinement": None,
                "crop_image": cv2.INTER_LINEAR,
                "crop_gt": cv2.INTER_LINEAR,
                "crop_void_pixels": cv2.INTER_LINEAR,
            },
        ),
        tr.IOGPointsInference(
            sigma=SIGMA_IOG_POINT_PIXEL,
            pad_pixel=PADDING_PIXEL,
            relax_pixel=RELAX_PIXEL,
            resolution=SHAPE_IMAGE_MODEL,
            zero_pad=True,
        ),
        tr.ToImage(norm_elem="IOG_points"),
        tr.ConcatInputs(elems=("crop_image", "IOG_points")),
        tr.ToTensor(),
    ]
)


def hydrate_cache(data_url, x, y, width, height, center_point, id, *, cache: Cache):
    image = convert_data_url_to_image(data_url)
    roi = convert_openlayers_roi_to_numpy_image_roi(
        [x, y, width, height], image.shape[0]
    )
    image = image.astype(np.float32)
    cached_data = {
        "roi": roi,
        "image": image,
        "center_point": center_point,
    }
    cache.write(
        cached_data,
        id,
    )
    return cached_data


def inference(image, roi, center_point):
    image = image.astype(np.float32)
    bbox = np.zeros_like(image[..., 0])
    bbox[int(roi[1]) : int(roi[1] + roi[3]), int(roi[0]) : int(roi[0] + roi[2])] = 1
    void_pixels = 1 - bbox
    sample = {
        "image": image,
        "gt": bbox,
        "void_pixels": void_pixels,
        "roi": roi,
        "point_center": convert_openlayers_point_to_numpy_image_point(
            center_point, image.shape[0]
        ),
    }

    tr_sample = trns(sample)

    inputs = tr_sample["concat"][None]
    IOG_points = tr_sample["IOG_points"].unsqueeze(0)
    if os.environ.get("DEBUG", False):
        now = datetime.now()
        points_fg = IOG_points[0, 0:1, :, :]
        points_bg = IOG_points[0, 1:2, :, :]
        os.makedirs("outputs", exist_ok=True)
        cv2.imwrite(
            f"outputs/points_fg_inference-{now}.png",
            np.transpose((points_fg * 1).numpy().astype(np.uint8), (1, 2, 0)),
        )
        cv2.imwrite(
            f"outputs/points_bg_inference-{now}.png",
            np.transpose((points_bg * 1).numpy().astype(np.uint8), (1, 2, 0)),
        )
    res = net.inference(inputs.to(device), IOG_points.to(device))
    backbone_features = res[0]

    return (
        convert_net_output_to_geojson_polygon(res[-1], tr_sample["gt"], image, roi),
        backbone_features,
    )


def refine(
    image,
    roi,
    center_point,
    backbone_features,
    pointsInside,
    pointsOutside,
):
    bbox = np.zeros_like(image[..., 0])
    bbox[int(roi[1]) : int(roi[1] + roi[3]), int(roi[0]) : int(roi[0] + roi[2])] = 1
    void_pixels = 1 - bbox
    sample = {
        "image": image,
        "gt": bbox,
        "void_pixels": void_pixels,
        "roi": roi,
        "point_center": convert_openlayers_point_to_numpy_image_point(
            center_point, image.shape[0]
        ),
        "points_foreground_refinement": list(
            map(
                lambda point: convert_openlayers_point_to_numpy_image_point(
                    point, image.shape[0]
                ),
                pointsInside,
            )
        ),
        "points_background_refinement": list(
            map(
                lambda point: convert_openlayers_point_to_numpy_image_point(
                    point, image.shape[0]
                ),
                pointsOutside,
            )
        ),
    }

    tr_sample = trns(sample)
    IOG_points = tr_sample["IOG_points"].unsqueeze(0)
    if os.environ.get("DEBUG", False):
        now = datetime.now()
        points_fg = IOG_points[0, 0:1, :, :]
        points_bg = IOG_points[0, 1:2, :, :]
        os.makedirs("outputs", exist_ok=True)
        cv2.imwrite(
            f"outputs/points_fg-{now}.png",
            np.transpose((points_fg * 1).numpy().astype(np.uint8), (1, 2, 0)),
        )
        cv2.imwrite(
            f"outputs/points_bg-{now}.png",
            np.transpose((points_bg * 1).numpy().astype(np.uint8), (1, 2, 0)),
        )

    fine_net_output = net.refine(backbone_features, IOG_points.to(device))
    return convert_net_output_to_geojson_polygon(
        fine_net_output.to("cpu"), tr_sample["gt"], image, roi
    )


def run_iog(data, cache: Cache):

    id = data.get("id")

    if not type(cache.read(id).get("image")) == np.ndarray:  # First call
        if not data.get("imageUrl"):
            raise Exception(
                "Couldn't load image from either cache or imageUrl argument."
            )
        image_url = data.get("imageUrl")
        x = data.get("x")
        y = data.get("y")
        width = data.get("width")
        height = data.get("height")
        center_point = data.get("centerPoint")
        hydrate_cache(image_url, x, y, width, height, center_point, id, cache=cache)

    cached_data = cache.read(id)
    image = cached_data.get("image")
    roi = cached_data.get("roi")
    cached_center_point = tuple(cached_data.get("center_point"))
    backbone_features = cached_data.get("backbone_features")
    points_inside = data.get("pointsInside", [])
    points_outside = data.get("pointsOutside", [])
    center_point = tuple(data.get("centerPoint", cached_center_point))

    should_perform_refinement = points_inside or points_outside

    if should_perform_refinement:
        polygons = refine(
            image,
            roi,
            center_point,
            backbone_features,
            points_inside,
            points_outside,
        )
    else:  # Perform inference
        polygons, backbone_features = inference(
            image,
            roi,
            center_point,
        )
        cache.write(
            {
                **cached_data,
                "center_point": center_point,
                "backbone_features": backbone_features,
            },
            id,
        )
    return {"polygons": polygons}
