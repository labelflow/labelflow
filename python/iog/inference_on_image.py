from datetime import datetime
import scipy.misc as sm
from collections import OrderedDict
import glob
import numpy as np
import socket
import base64


# PyTorch includes
import torch
import torch.optim as optim
from torchvision import transforms
from torch.utils.data import DataLoader

# Custom includes
from dataloaders.combine_dbs import CombineDBs as combine_dbs
from dataloaders import pascal as pascal
from dataloaders import sbd as sbd
from dataloaders import custom_transforms as tr
from networks.loss import class_cross_entropy_loss
from dataloaders.helpers import *

# from networks.mainnetwork import *
from networks.refinementnetwork import *

import matplotlib.pyplot as plt

from PIL import Image
import cv2
import argparse


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

    roi = [x, image.shape[0] - y - height, width, height]


def transform_contours_to_geojson_polygons(
    contours: list, imageHeight: int, roiHeight: int
) -> list:
    return list(
        map(
            lambda contour: transform_contour_to_geojson_polygon(
                contour, imageHeight, roiHeight
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
    im_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    outputs = fine_net_output  # fine net output
    # outputs = fine_out.to(torch.device('cpu'))

    # Save result without refinements

    # pred = np.transpose(outputs.data.numpy()[0, :, :, :], (1, 2, 0))
    # pred = 1 / (1 + np.exp(-pred))
    # pred = np.squeeze(pred)
    # gt = tens2image(gt_input)
    # bbox = get_bbox(gt, pad=30, zero_pad=True)
    # result = crop2fullmask(pred, bbox, gt, zero_pad=True, relax=0, mask_relax=False)

    # light = np.zeros_like(image)
    # light[:, :, 2] = 255.0

    # alpha = 0.5

    # blending = (alpha * light + (1 - alpha) * image) * result[..., None] + (
    #     1 - result[..., None]
    # ) * image

    # blending[blending > 255.0] = 255

    # # find contours
    # # im_mask = cv2.cvtColor(result.astype(np.uint8), cv2.COLOR_BGR2GRAY)
    # im_mask = (result * 255).astype(np.uint8)
    # ret, thresh = cv2.threshold(im_mask, 127, 255, 0)
    # # kernel = np.ones((5, 5), np.uint8)
    # kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (1, 1))
    # opening = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=1)
    # contours, hierarchy = cv2.findContours(
    #     opening, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
    # )
    pred = np.transpose(outputs.data.numpy()[0, :, :, :], (1, 2, 0))
    pred = 1 / (1 + np.exp(-pred))
    pred = np.squeeze(pred)
    gt = tens2image(gt_input)
    bbox = get_bbox(gt, pad=30, zero_pad=True)
    result = crop2fullmask(pred, bbox, gt, zero_pad=True, relax=0, mask_relax=False)

    light = np.zeros_like(image)
    light[:, :, 2] = 255.0

    alpha = 0.5

    blending = (alpha * light + (1 - alpha) * image) * result[..., None] + (
        1 - result[..., None]
    ) * image

    blending[blending > 255.0] = 255

    # find contours
    # im_mask = cv2.cvtColor(result.astype(np.uint8), cv2.COLOR_BGR2GRAY)
    im_mask = (result * 255).astype(np.uint8)
    ret, thresh = cv2.threshold(im_mask, 127, 255, 0)
    # kernel = np.ones((5, 5), np.uint8)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (1, 1))
    opening = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=1)
    contours, hierarchy = cv2.findContours(
        opening, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
    )
    cv2.drawContours(im_rgb, contours, -1, (0, 255, 0), 3)
    # cv2.rectangle(im_rgb, (roi[0], roi[1]), (roi[0]+ roi[2], roi[1]+roi[3]))

    now = datetime.now()
    cv2.imwrite(f"results/result-{now}.jpg", im_rgb)
    cv2.imwrite(f"results/mask-{now}.jpg", im_mask)
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
)

# load pretrain_dict
pretrain_dict = torch.load("data/IOG_PASCAL_SBD_REFINEMENT.pth")

net.load_state_dict(pretrain_dict)
# net.to(device)

# Generate result of the validation images
net.eval()


trns = transforms.Compose(
    [
        tr.CropFromMask(
            crop_elems=("image", "gt", "void_pixels"), relax=30, zero_pad=True
        ),
        tr.FixedResize(
            resolutions={
                "gt": None,
                "crop_image": (512, 512),
                "crop_gt": (512, 512),
                "crop_void_pixels": (512, 512),
            },
            flagvals={
                "gt": cv2.INTER_LINEAR,
                "crop_image": cv2.INTER_LINEAR,
                "crop_gt": cv2.INTER_LINEAR,
                "crop_void_pixels": cv2.INTER_LINEAR,
            },
        ),
        tr.IOGPoints(sigma=10, elem="crop_gt", pad_pixel=10),
        tr.ToImage(norm_elem="IOG_points"),
        tr.ConcatInputs(elems=("crop_image", "IOG_points")),
        tr.ToTensor(),
    ]
)


trns_refinement = transforms.Compose(
    [
        tr.CropFromMask(crop_elems=("point_refinement_mask",), relax=30, zero_pad=True),
        tr.FixedResize(
            resolutions={
                "crop_point_refinement_mask": (512, 512),
            },
            flagvals={
                "crop_point_refinement_mask": cv2.INTER_LINEAR,
            },
        ),
        tr.IOGPointRefinement(
            sigma=10, elem="crop_point_refinement_mask", pad_pixel=10
        ),
        tr.ToImage(norm_elem="IOG_points"),
        tr.ToTensor(),
    ]
)

cache = {}


def process(data_url, x, y, width, height, id):
    image = convert_data_url_to_image(data_url)
    roi = [x, image.shape[0] - y - height, width, height]

    # Set gpu_id to -1 to run in CPU mode, otherwise set the id of the corresponding gpu
    gpu_id = 0
    device = torch.device("cuda:" + str(gpu_id) if torch.cuda.is_available() else "cpu")
    if torch.cuda.is_available():
        print("Using GPU: {} ".format(gpu_id))

    # Setting parameters
    resume_epoch = 100  # test epoch

    # roi = (39, 289, 193, 79)
    # print("ROI selected = ", roi)

    image = image.astype(np.float32)

    bbox = np.zeros_like(image[..., 0])
    bbox[int(roi[1]) : int(roi[1] + roi[3]), int(roi[0]) : int(roi[0] + roi[2])] = 1
    void_pixels = 1 - bbox
    sample = {"image": image, "gt": bbox, "void_pixels": void_pixels}

    tr_sample = trns(sample)

    inputs = tr_sample["concat"][None]
    IOG_points = tr_sample["IOG_points"].unsqueeze(0)
    # inputs = inputs.to(device)
    res = net.inference(inputs, IOG_points)

    backbone_features = res[0]
    cache[id] = {"backbone_features": backbone_features, "roi": roi, "image": image}

    return convert_net_output_to_geojson_polygon(res[-1], tr_sample["gt"], image, roi)

    # Generate results with refinement
    # trns_refinement = transforms.Compose(
    #     [
    #         tr.CropFromMask(
    #             crop_elems=("point_refinement_mask",), relax=30, zero_pad=True
    #         ),
    #         tr.FixedResize(
    #             resolutions={
    #                 "crop_point_refinement_mask": (512, 512),
    #             },
    #             flagvals={
    #                 "crop_point_refinement_mask": cv2.INTER_LINEAR,
    #             },
    #         ),
    #         tr.IOGPointRefinement(
    #             sigma=10, elem="crop_point_refinement_mask", pad_pixel=10
    #         ),
    #         tr.ToImage(norm_elem="IOG_points"),
    #         tr.ToTensor(),
    #     ]
    # )
    # while True:
    #     mask_img = create_mask(outputs, tr_sample["gt"], image)

    #     def record_mouse_position(event, x, y, flags, param):
    #         global mouseX, mouseY, foreground
    #         if event == cv2.EVENT_LBUTTONDOWN and not (flags & cv2.EVENT_FLAG_CTRLKEY):
    #             cv2.circle(mask_img, (x, y), 100, (255, 0, 0), -1)
    #             print("FOREGROUND click at (", x, " ,", y, ")")
    #             mouseX, mouseY, foreground = x, y, True
    #         if event == cv2.EVENT_LBUTTONDOWN and (flags & cv2.EVENT_FLAG_CTRLKEY):
    #             cv2.circle(mask_img, (x, y), 100, (0, 255, 0), -1)
    #             print("BACKGROUND click at (", x, " ,", y, ")")
    #             mouseX, mouseY, foreground = x, y, False

    #     cv2.setMouseCallback("TEST", record_mouse_position)
    #     cv2.imshow("TEST", mask_img)
    #     k = cv2.waitKey(0) & 0xFF
    #     if k == 27:
    #         break
    #     # foreground = False
    #     # mouseX, mouseY = (87, 347)
    #     refinement_point_mask = np.zeros_like(image)
    #     if foreground:
    #         refinement_point_mask[mouseY, mouseX, 0] = 1
    #     else:
    #         refinement_point_mask[mouseY, mouseX, 1] = 1
    #     sample = {"point_refinement_mask": refinement_point_mask, "gt": bbox}
    #     IOG_points = torch.maximum(
    #         trns_refinement(sample)["IOG_points"].unsqueeze(0), IOG_points
    #     )
    #     index += 1
    #     # one result
    #     points_fg = IOG_points[0, 0:1, :, :]
    #     points_bg = IOG_points[0, 1:2, :, :]
    #     cv2.imwrite(
    #         f"outputs/points_fg{index}.png",
    #         np.transpose((points_fg * 1).numpy().astype(np.uint8), (1, 2, 0)),
    #     ),
    #     cv2.imwrite(
    #         f"outputs/points_bg{index}.png",
    #         np.transpose((points_bg * 1).numpy().astype(np.uint8), (1, 2, 0)),
    #     ),
    #     # points_bg = torch.zeros((IOG_points.shape[2], IOG_points.shape[3]))
    #     IOG_points[0, 0:1, :, :] = points_fg
    #     IOG_points[0, 1:2, :, :] = points_bg
    #     outputs = net.refine(backbone_features, IOG_points)
    #     # Save result without refinements
    #     print_mask(
    #         outputs, f"outputs/result_with_refinement_{index}", tr_sample["gt"], image
    #     )
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()


def refine(pointsInside, pointsOutside, id):
    backbone_features = cache[id]["backbone_features"]
    roi = cache[id]["roi"]
    image = cache[id]["image"]

    bbox = np.zeros_like(image[..., 0])
    bbox[int(roi[1]) : int(roi[1] + roi[3]), int(roi[0]) : int(roi[0] + roi[2])] = 1
    void_pixels = 1 - bbox
    sample = {"image": image, "gt": bbox, "void_pixels": void_pixels}

    tr_sample = trns(sample)
    IOG_points = tr_sample["IOG_points"].unsqueeze(0)

    for point in pointsInside:
        print(point, image.shape[0])
        refinement_point_mask = np.zeros_like(image)
        refinement_point_mask[int(image.shape[0] - point[1]), int(point[0]), 0] = 1
        sample = {"point_refinement_mask": refinement_point_mask, "gt": bbox}
        IOG_points = torch.maximum(
            trns_refinement(sample)["IOG_points"].unsqueeze(0), IOG_points
        )

    for point in pointsOutside:
        refinement_point_mask = np.zeros_like(image)
        refinement_point_mask[int(image.shape[0] - point[1]), int(point[0]), 1] = 1
        sample = {"point_refinement_mask": refinement_point_mask, "gt": bbox}
        IOG_points = torch.maximum(
            trns_refinement(sample)["IOG_points"].unsqueeze(0), IOG_points
        )

    # one result
    points_fg = IOG_points[0, 0:1, :, :]
    points_bg = IOG_points[0, 1:2, :, :]
    cv2.imwrite(
        f"outputs/points_fg.png",
        np.transpose((points_fg * 1).numpy().astype(np.uint8), (1, 2, 0)),
    )
    cv2.imwrite(
        f"outputs/points_bg.png",
        np.transpose((points_bg * 1).numpy().astype(np.uint8), (1, 2, 0)),
    )

    fine_net_output = net.refine(backbone_features, IOG_points)
    print(fine_net_output)
    return convert_net_output_to_geojson_polygon(
        fine_net_output, tr_sample["gt"], image, roi
    )
