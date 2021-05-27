import numpy as np
import numbers
import skimage
from skimage.filters.thresholding import (
    threshold_local,
    threshold_minimum,
    threshold_mean,
    threshold_otsu,
)
from skimage.segmentation import watershed, mark_boundaries
from skimage.io import imread, imsave
from skimage.util import regular_grid, crop
from skimage.filters import sobel, rank, gaussian
from skimage.morphology import opening, closing, disk, dilation, erosion
from skimage.exposure import equalize_adapthist, rescale_intensity, equalize_hist
from skimage.color import rgb2gray, gray2rgb
from addict import Dict
from collections import Sequence

print(skimage.__version__)


def process(input):
    input = Dict(input)

    # Read image
    url = input.image.url
    img_original = imread(url)

    # Bounding box cropping (Optional)
    if input.input.boundingBox is not None:
        bounding_box = input.input.boundingBox
        img_cropped = crop(
            img_original,
            (
                (bounding_box[0][0], img_original.shape[0] - bounding_box[1][0]),
                (bounding_box[0][1], img_original.shape[1] - bounding_box[1][1]),
                (0, 0),
            ),
            copy=np.true_divide,
            order="K",
        )
    else:
        bounding_box = [[0, 0], [img_original.shape[0], img_original.shape[2]]]
        img_cropped = img_original

    # Adaptive equalization (Optional, default True: equalize_hist)
    equalize = True if input.parameters.equalize is None else input.parameters.equalize
    if equalize == True or equalize == "hist":
        img_equalized = equalize_hist(img_cropped)
    elif equalize == "adaptive":
        img_equalized = equalize_adapthist(img_cropped, clip_limit=0.03)
    elif isinstance(equalize, Sequence):
        percentile_low, percentile_high = np.percentile(
            img_cropped, (equalize[0], equalize[1])
        )
        img_equalized = rescale_intensity(
            img_cropped, in_range=(percentile_low, percentile_high)
        )
    else:
        img_equalized = img_cropped

    img_gray = rgb2gray(img_equalized)

    # Thresholding (Optional, default True: threshold_mean)
    threshold = (
        True if input.parameters.threshold is None else input.parameters.threshold
    )
    if threshold == True or threshold == "mean":
        thresh = threshold_mean(img_gray)
        img_thresholded = img_gray > thresh
    elif threshold == "minimum":
        thresh = threshold_minimum(img_gray)
        img_thresholded = img_gray > thresh
    elif threshold == "otsu":
        thresh = threshold_otsu(img_gray)
        img_thresholded = img_gray > thresh
    elif threshold == "local":
        local_size = input.parameters.thresholdLocalSize or 35
        thresh = threshold_local(img_gray, local_size, offset=-0.2)
        img_thresholded = img_gray > thresh
    elif threshold == "localOtsu":
        local_size = input.parameters.thresholdLocalSize or 35
        selem = disk(local_size)
        thresh = rank.otsu(img_gray, selem)
        img_thresholded = img_gray > thresh
    elif isinstance(threshold, numbers.Number) and not threshold == False:
        thresh = threshold
        img_thresholded = img_gray > thresh
    else:
        img_thresholded = img_gray

    # Morphological opening (Optional)
    opening_size = input.parameters.openingSize or 0
    if opening_size > 0:
        selem = disk(opening_size)
        img_opened = opening(img_thresholded, selem)
    else:
        img_opened = img_thresholded

    # Morphological closing (Optional)
    closing_size = input.parameters.closingSize or 0
    if closing_size > 0:
        selem = disk(closing_size)
        img_closed = closing(img_opened, selem)
    else:
        img_closed = img_opened

    # Edge detection (Optional, default True)
    edge_detection = (
        True
        if input.parameters.edgeDetection is None
        else input.parameters.edgeDetection
    )
    if edge_detection:
        img_edges = sobel(img_closed)
    else:
        img_edges = img_closed

    # Blur the edge to get smoother watershed
    img_edges = gaussian(img_edges, sigma=2)

    # Initialize seed array
    seeds = np.zeros(img_edges.shape, dtype=int)

    # Generate superpixel exterior points in seed
    if len(input.input.exteriorPoints) > 0:
        for point in input.input.exteriorPoints:
            seeds[point[0] - bounding_box[0][0], point[1] - bounding_box[0][1]] = 1
    else:
        # 4 corners of crop are considered exterior
        seeds[0, 0] = 1
        seeds[0, img_edges.shape[1] - 1] = 1
        seeds[img_edges.shape[0] - 1, 0] = 1
        seeds[img_edges.shape[0] - 1, img_edges.shape[1] - 1] = 1

    # Generate superpixel interior points in seed
    if len(input.input.interiorPoints) > 0:
        for point in input.input.interiorPoints:
            seeds[point[0] - bounding_box[0][0], point[1] - bounding_box[0][1]] = 2
    else:
        # Middle of crop is considered interior
        seeds[img_edges.shape[0] / 2, img_edges.shape[1] / 2] = 2

    # Expand the seeds with a "pencil radius" (Optional)
    if input.parameters.seedRadius > 0:
        seeds = dilation(seeds[:, :], disk(input.parameters.seedRadius))

    # Run watershed algorithm
    compactness = input.parameters.compactness
    labels = watershed(img_edges, seeds, compactness=compactness)
    labels = labels[:, :]

    print("ok")
    print(labels.shape)
    print(labels)
    return (
        labels,
        img_original,
        img_cropped,
        img_equalized,
        img_thresholded,
        img_opened,
        img_closed,
        img_edges,
        seeds,
    )
