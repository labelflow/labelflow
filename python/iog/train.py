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
from networks.mainnetwork import *

# Set gpu_id to -1 to run in CPU mode, otherwise set the id of the corresponding gpu
gpu_id = 0
device = torch.device("cuda:"+str(gpu_id) if torch.cuda.is_available() else "cpu")
if torch.cuda.is_available():
    print('Using GPU: {} '.format(gpu_id))

# Setting parameters
use_sbd = False # train with SBD
nEpochs = 100  # Number of epochs for training
resume_epoch = 0  # Default is 0, change if want to resume
p = OrderedDict()  # Parameters to include in report
p['trainBatch'] = 5  # Training batch size 5
snapshot = 10  # Store a model every snapshot epochs
nInputChannels = 5  # Number of input channels (RGB + heatmap of extreme points)
p['nAveGrad'] = 1  # Average the gradient of several iterations
p['lr'] = 1e-8  # Learning rate
p['wd'] = 0.0005  # Weight decay
p['momentum'] = 0.9  # Momentum

# Results and model directories (a new directory is generated for every run)
save_dir_root = os.path.join(os.path.dirname(os.path.abspath(__file__)))
exp_name = os.path.dirname(os.path.abspath(__file__)).split('/')[-1]
if resume_epoch == 0:
    runs = sorted(glob.glob(os.path.join(save_dir_root, 'run_*')))
    run_id = int(runs[-1].split('_')[-1]) + 1 if runs else 0
else:
    run_id = 0
save_dir = os.path.join(save_dir_root, 'run_' + str(run_id))
if not os.path.exists(os.path.join(save_dir, 'models')):
    os.makedirs(os.path.join(save_dir, 'models'))

# Network definition
modelName = 'IOG_pascal'
net = Network(nInputChannels=nInputChannels,num_classes=1,
                        backbone='resnet101',
                        output_stride=16,
                        sync_bn=None,
                        freeze_bn=False,
                        pretrained=True)
if resume_epoch == 0:
    print("Initializing from pretrained model")
else:
    print("Initializing weights from: {}".format(
        os.path.join(save_dir, 'models', modelName + '_epoch-' + str(resume_epoch - 1) + '.pth')))
    net.load_state_dict(
        torch.load(os.path.join(save_dir, 'models', modelName + '_epoch-' + str(resume_epoch - 1) + '.pth'),
                   map_location=lambda storage, loc: storage))
train_params = [{'params': net.get_1x_lr_params(), 'lr': p['lr']}, 
                {'params': net.get_10x_lr_params(), 'lr': p['lr'] * 10}]
net.to(device)

if resume_epoch != nEpochs:
    # Logging into Tensorboard
    log_dir = os.path.join(save_dir, 'models', datetime.now().strftime('%b%d_%H-%M-%S') + '_' + socket.gethostname())

    # Use the following optimizer
    optimizer = optim.SGD(train_params, lr=p['lr'], momentum=p['momentum'], weight_decay=p['wd'])
    p['optimizer'] = str(optimizer)

    # Preparation of the data loaders
    composed_transforms_tr = transforms.Compose([
        tr.RandomHorizontalFlip(),
        tr.ScaleNRotate(rots=(-20, 20), scales=(.75, 1.25)),
        tr.CropFromMask(crop_elems=('image', 'gt','void_pixels'), relax=30, zero_pad=True),
        tr.FixedResize(resolutions={'crop_image': (512, 512), 'crop_gt': (512, 512), 'crop_void_pixels': (512, 512)},flagvals={'crop_image':cv2.INTER_LINEAR,'crop_gt':cv2.INTER_LINEAR,'crop_void_pixels': cv2.INTER_LINEAR}),
        tr.IOGPoints(sigma=10, elem='crop_gt',pad_pixel=10),
        tr.ToImage(norm_elem='IOG_points'),
        tr.ConcatInputs(elems=('crop_image', 'IOG_points')),
        tr.ToTensor()])

    composed_transforms_ts = transforms.Compose([
        tr.CropFromMask(crop_elems=('image', 'gt','void_pixels'), relax=30, zero_pad=True),
        tr.FixedResize(resolutions={'crop_image': (512, 512), 'crop_gt': (512, 512), 'crop_void_pixels': (512, 512)},flagvals={'crop_image':cv2.INTER_LINEAR,'crop_gt':cv2.INTER_LINEAR,'crop_void_pixels': cv2.INTER_LINEAR}),
        tr.IOGPoints(sigma=10, elem='crop_gt',pad_pixel=10),
        tr.ToImage(norm_elem='IOG_points'),
        tr.ConcatInputs(elems=('crop_image', 'IOG_points')),
        tr.ToTensor()])
                                            
    voc_train = pascal.VOCSegmentation(split='train', transform=composed_transforms_tr)
    voc_val = pascal.VOCSegmentation(split='val', transform=composed_transforms_ts)
    if use_sbd:
        sbd = sbd.SBDSegmentation(split=['train', 'val'], transform=composed_transforms_tr, retname=True)
        db_train = combine_dbs([voc_train, sbd], excluded=[voc_val])
    else:
        db_train = voc_train

    p['dataset_train'] = str(db_train)
    p['transformations_train'] = [str(tran) for tran in composed_transforms_tr.transforms]
    trainloader = DataLoader(db_train, batch_size=p['trainBatch'], shuffle=True, num_workers=2)

    # Train variables
    num_img_tr = len(trainloader)
    running_loss_tr = 0.0
    aveGrad = 0
    print("Training Network")
    for epoch in range(resume_epoch, nEpochs):
        start_time = timeit.default_timer()
        epoch_loss = []
        net.train()
        for ii, sample_batched in enumerate(trainloader):
            gts =  sample_batched['crop_gt']
            inputs = sample_batched['concat']
            void_pixels =  sample_batched['crop_void_pixels']
            inputs.requires_grad_()
            inputs, gts ,void_pixels = inputs.to(device), gts.to(device), void_pixels.to(device)
            coarse_outs1,coarse_outs2,coarse_outs3,coarse_outs4,fine_out = net.forward(inputs)

            # Compute the losses
            loss_coarse_outs1 = class_cross_entropy_loss(coarse_outs1, gts, void_pixels=void_pixels)
            loss_coarse_outs2 = class_cross_entropy_loss(coarse_outs2, gts, void_pixels=void_pixels)
            loss_coarse_outs3 = class_cross_entropy_loss(coarse_outs3, gts, void_pixels=void_pixels)
            loss_coarse_outs4 = class_cross_entropy_loss(coarse_outs4, gts, void_pixels=void_pixels)
            loss_fine_out = class_cross_entropy_loss(fine_out, gts, void_pixels=void_pixels)
            loss = loss_coarse_outs1+loss_coarse_outs2+ loss_coarse_outs3+loss_coarse_outs4+loss_fine_out

            if ii % 10 ==0:
                print('Epoch',epoch,'step',ii,'loss',loss)
            running_loss_tr += loss.item()

            # Print stuff
            if ii % num_img_tr == num_img_tr - 1 -p['trainBatch']:
                running_loss_tr = running_loss_tr / num_img_tr
                print('[Epoch: %d, numImages: %5d]' % (epoch, ii*p['trainBatch']+inputs.data.shape[0]))
                print('Loss: %f' % running_loss_tr)
                running_loss_tr = 0
                stop_time = timeit.default_timer()
                print("Execution time: " + str(stop_time - start_time)+"\n")

            # Backward the averaged gradient
            loss /= p['nAveGrad']
            loss.backward()
            aveGrad += 1

            # Update the weights once in p['nAveGrad'] forward passes
            if aveGrad % p['nAveGrad'] == 0:
                optimizer.step()
                optimizer.zero_grad()
                aveGrad = 0

        # Save the model
        if (epoch % snapshot) == snapshot - 1 and epoch != 0:
            torch.save(net.state_dict(), os.path.join(save_dir, 'models', modelName + '_epoch-' + str(epoch) + '.pth'))
