import skimage
from skimage.segmentation import watershed, mark_boundaries
from skimage.io import imread, imsave
from skimage.color import label2rgb, rgb2gray
from skimage.morphology import dilation, disk

from ..segmentation_watershed import process


def test_answer():

    input = {
        "image": {"url": "b.jpg"},
        "input": {
            "boundingBox": [[20, 20], [150, 150]],
            "interiorPoints": [[70, 100], [80, 80]],
            "exteriorPoints": [
                [25, 25],
                [35, 65],
                [100, 105],
                [20, 20],
                [149, 149],
                [20, 149],
                [149, 20],
                [30, 100],
                [60, 120],
            ],
        },
        "parameters": {
            "equalize": [70, 98],
            "openingSize": 0,
            "closingSize": 20,
            "edgeDetection": True,
            "compactness": 0.000001,
            "seedRadius": 5,
        },
    }
    (
        labels,
        img_original,
        img_cropped,
        img_equalized,
        img_opened,
        img_closed,
        img_edges,
        seeds,
    ) = process(input)

    url = input["image"]["url"]
    imsave(f"{url}.results/img_contours.png", mark_boundaries(img_cropped, labels))
    imsave(
        f"{url}.results/img_labelled.png",
        label2rgb(labels, rgb2gray(img_cropped), bg_label=0),
    )
    imsave(f"{url}.results/labels.png", labels)
    imsave(f"{url}.results/img_original.png", img_original)
    imsave(f"{url}.results/img_cropped.png", img_cropped)
    imsave(f"{url}.results/img_equalized.png", img_equalized)
    imsave(f"{url}.results/img_opened.png", img_opened)
    imsave(f"{url}.results/img_closed.png", img_closed)
    imsave(f"{url}.results/img_edges.png", img_edges)
    print("seeds.shape", seeds.shape)
    print("img_cropped.shape", img_cropped.shape)
    imsave(
        f"{url}.results/seeds.png",
        label2rgb(seeds, img_cropped, bg_label=0),
    )

    assert 1 == 1
