from datetime import datetime
import scipy.misc as sm
from collections import OrderedDict
import glob
import numpy as np
import socket
import timeit

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
from dataloaders.helpers import *
from networks.loss import class_cross_entropy_loss
from networks.refinementnetwork import *
from torch.nn.functional import upsample

# Set gpu_id to -1 to run in CPU mode, otherwise set the id of the corresponding gpu
gpu_id = 0
device = torch.device("cuda:" + str(gpu_id) if torch.cuda.is_available() else "cpu")
if torch.cuda.is_available():
    print("Using GPU: {} ".format(gpu_id))

# Setting parameters
resume_epoch = 100  # test epoch
nInputChannels = 5  # Number of input channels (RGB + heatmap of IOG points)
refinement_num_max = 2  # the number of new points:

# Results and model directories (a new directory is generated for every run)
save_dir_root = os.path.join(os.path.dirname(os.path.abspath(__file__)))
exp_name = os.path.dirname(os.path.abspath(__file__)).split("/")[-1]
if resume_epoch == 0:
    runs = sorted(glob.glob(os.path.join(save_dir_root, "run_*")))
    run_id = int(runs[-1].split("_")[-1]) + 1 if runs else 0
else:
    run_id = 0
save_dir = os.path.join(save_dir_root, "run_" + str(run_id))
if not os.path.exists(os.path.join(save_dir, "models")):
    os.makedirs(os.path.join(save_dir, "models"))

# Network definition
modelName = "IOG_pascal_refinement"
net = Network(
    nInputChannels=nInputChannels,
    num_classes=1,
    backbone="resnet101",
    output_stride=16,
    sync_bn=None,
    freeze_bn=False,
)

# load pretrain_dict
pretrain_dict = torch.load(
    os.path.join(
        save_dir, "models", modelName + "_epoch-" + str(resume_epoch - 1) + ".pth"
    )
)
print(
    "Initializing weights from: {}".format(
        os.path.join(
            save_dir, "models", modelName + "_epoch-" + str(resume_epoch - 1) + ".pth"
        )
    )
)
net.load_state_dict(pretrain_dict)
net.to(device)

# Generate result of the validation images
net.eval()
composed_transforms_ts = transforms.Compose(
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
db_test = pascal.VOCSegmentation(
    split="val", transform=composed_transforms_ts, retname=True
)
testloader = DataLoader(db_test, batch_size=1, shuffle=False, num_workers=1)

save_dir_res_list = []
for add_clicks in range(0, refinement_num_max + 1):
    save_dir_res = os.path.join(save_dir, "Results-" + str(add_clicks))
    if not os.path.exists(save_dir_res):
        os.makedirs(save_dir_res)
    save_dir_res_list.append(save_dir_res)

print("Testing Network")
with torch.no_grad():
    # Main Testing Loop
    for ii, sample_batched in enumerate(testloader):
        metas = sample_batched["meta"]
        gts = sample_batched["gt"]
        gts_crop = sample_batched["crop_gt"]
        inputs = sample_batched["concat"]
        void_pixels = sample_batched["crop_void_pixels"]
        IOG_points = sample_batched["IOG_points"]
        inputs.requires_grad_()
        inputs, gts_crop, void_pixels, IOG_points = (
            inputs.to(device),
            gts_crop.to(device),
            void_pixels.to(device),
            IOG_points.to(device),
        )
        out = net.forward(inputs, IOG_points, gts_crop, refinement_num_max + 1)
        for i in range(0, refinement_num_max + 1):
            glo1, glo2, glo3, glo4, refine, iou_i = out[i]
            output_refine = upsample(
                refine, size=(512, 512), mode="bilinear", align_corners=True
            )
            outputs = output_refine.to(torch.device("cpu"))
            pred = np.transpose(outputs.data.numpy()[0, :, :, :], (1, 2, 0))
            pred = 1 / (1 + np.exp(-pred))
            pred = np.squeeze(pred)
            gt = tens2image(gts[0, :, :, :])
            bbox = get_bbox(gt, pad=30, zero_pad=True)
            result = crop2fullmask(
                pred, bbox, gt, zero_pad=True, relax=0, mask_relax=False
            )

            # Save the result, attention to the index
            sm.imsave(
                os.path.join(
                    save_dir_res_list[i],
                    metas["image"][0] + "-" + metas["object"][0] + ".png",
                ),
                result,
            )
