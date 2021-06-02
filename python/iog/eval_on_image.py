from datetime import datetime
import scipy.misc as sm
from collections import OrderedDict
import glob
import numpy as np
import socket

# PyTorch includes
import torch
import torch.optim as optim
from torchvision import transforms
from torch.utils.data import DataLoader

# Custom includes
from dataloaders.combine_dbs import CombineDBs as combine_dbs
import dataloaders.pascal as pascal
import dataloaders.sbd as sbd
from dataloaders import custom_transforms as tr
from networks.loss import class_cross_entropy_loss
from dataloaders.helpers import *
from networks.mainnetwork import *

import matplotlib.pyplot as plt

from PIL import Image
import cv2
import argparse


def process(image_name):

    # Set gpu_id to -1 to run in CPU mode, otherwise set the id of the corresponding gpu
    gpu_id = 0
    device = torch.device("cuda:" + str(gpu_id) if torch.cuda.is_available() else "cpu")
    if torch.cuda.is_available():
        print("Using GPU: {} ".format(gpu_id))

    # Setting parameters
    resume_epoch = 100  # test epoch
    nInputChannels = 5  # Number of input channels (RGB + heatmap of IOG points)

    # Network definition
    modelName = "IOG_pascal"
    net = Network(
        nInputChannels=nInputChannels,
        num_classes=1,
        backbone="resnet101",
        output_stride=16,
        sync_bn=None,
        freeze_bn=False,
    )

    # load pretrain_dict
    pretrain_dict = torch.load("data/IOG_PASCAL_SBD.pth")

    net.load_state_dict(pretrain_dict)
    # net.to(device)

    # Generate result of the validation images
    net.eval()

    image = np.array(Image.open(image_name).convert("RGB"))
    im_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    roi = cv2.selectROI(im_rgb)
    image = image.astype(np.float32)

    def click_event(event, x, y, flags, params):

        # checking for left mouse clicks
        if event == cv2.EVENT_LBUTTONDOWN:

            # displaying the coordinates
            # on the Shell
            print("(", x, " ", y, ")")

    # cv2.imshow("image", image)
    # cv2.setMouseCallback("image", click_event)

    bbox = np.zeros_like(image[..., 0])
    # bbox[0: 130, 220: 320] = 1 # for ponny
    # bbox[220: 390, 370: 570] = 1
    bbox[int(roi[1]) : int(roi[1] + roi[3]), int(roi[0]) : int(roi[0] + roi[2])] = 1
    void_pixels = 1 - bbox
    sample = {"image": image, "gt": bbox, "void_pixels": void_pixels}

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

    tr_sample = trns(sample)

    inputs = tr_sample["concat"][None]
    # inputs = inputs.to(device)
    outputs = net.forward(inputs)[-1]
    # outputs = fine_out.to(torch.device('cpu'))
    pred = np.transpose(outputs.data.numpy()[0, :, :, :], (1, 2, 0))
    pred = 1 / (1 + np.exp(-pred))
    pred = np.squeeze(pred)
    gt = tens2image(tr_sample["gt"])
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
    cv2.imshow("resulting segmentation", im_rgb)
    # cv2.imshow('resulting segmentation', cv2.cvtColor(blending.astype(np.uint8), cv2.COLOR_RGB2BGR))
    cv2.waitKey(0)
    cv2.destroyAllWindows()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run class agnostic segmentation")
    parser.add_argument(
        "--image_name",
        type=str,
        default="samples/IMG-20201203-WA0023.jpg",
        help="path to target image",
    )

    args = parser.parse_args()

    process(args.image_name)
