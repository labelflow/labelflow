import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from mypath import Path
from networks.backbone import build_backbone
from networks.CoarseNet import CoarseNet
from networks.FineNet import FineNet

affine_par = True
class PSPModule(nn.Module):
    """
    Pyramid Scene Parsing module
    """
    def __init__(self, in_features=2048, out_features=512, sizes=(1, 2, 3, 6), n_classes=1):
        super(PSPModule, self).__init__()
        self.stages = []
        self.stages = nn.ModuleList([self._make_stage_1(in_features, size) for size in sizes])
        self.bottleneck = self._make_stage_2(in_features * (len(sizes)//4 + 1), out_features)
        self.relu = nn.ReLU()

    def _make_stage_1(self, in_features, size):
        prior = nn.AdaptiveAvgPool2d(output_size=(size, size))
        conv = nn.Conv2d(in_features, in_features//4, kernel_size=1, bias=False)
        bn = nn.BatchNorm2d(in_features//4, affine=affine_par)
        relu = nn.ReLU(inplace=True)
        return nn.Sequential(prior, conv, bn, relu)

    def _make_stage_2(self, in_features, out_features):
        conv = nn.Conv2d(in_features, out_features, kernel_size=1, bias=False)
        bn = nn.BatchNorm2d(out_features, affine=affine_par)
        relu = nn.ReLU(inplace=True)

        return nn.Sequential(conv, bn, relu)

    def forward(self, feats):
        h, w = feats.size(2), feats.size(3)
        priors = [F.upsample(input=stage(feats), size=(h, w), mode='bilinear', align_corners=True) for stage in self.stages]
        priors.append(feats)
        bottle = self.relu(self.bottleneck(torch.cat(priors, 1)))
        return bottle

class SegmentationNetwork(nn.Module):
    def __init__(self, backbone='resnet', output_stride=16, num_classes=21,nInputChannels=3,
                 sync_bn=True, freeze_bn=False):
        super(SegmentationNetwork, self).__init__()
        output_shape = 128
        channel_settings = [512, 1024, 512, 256]      
        self.Coarse_net = CoarseNet(channel_settings, output_shape, num_classes)
        self.Fine_net = FineNet(channel_settings[-1], output_shape, num_classes) 
        BatchNorm =  nn.BatchNorm2d      
        self.backbone = build_backbone(backbone, output_stride, BatchNorm,nInputChannels,pretrained=False)
        self.psp4 = PSPModule(in_features=2048, out_features=512, sizes=(1, 2, 3, 6), n_classes=256)
        self.upsample = nn.Upsample(size=(512, 512), mode='bilinear', align_corners=True)
        if freeze_bn:
            self.freeze_bn()

    def forward(self, input):
        low_level_feat_4, low_level_feat_3,low_level_feat_2,low_level_feat_1 = self.backbone(input)
        low_level_feat_4 = self.psp4(low_level_feat_4)   
        res_out = [low_level_feat_4, low_level_feat_3,low_level_feat_2,low_level_feat_1]   
        coarse_fms, coarse_outs = self.Coarse_net(res_out)
        fine_out = self.Fine_net(coarse_fms)
        coarse_outs[0] = self.upsample(coarse_outs[0])
        coarse_outs[1] = self.upsample(coarse_outs[1])
        coarse_outs[2] = self.upsample(coarse_outs[2])
        coarse_outs[3] = self.upsample(coarse_outs[3])
        fine_out = self.upsample(fine_out)       
        return coarse_outs[0],coarse_outs[1],coarse_outs[2],coarse_outs[3],fine_out

    def freeze_bn(self):
        for m in self.modules():
            if isinstance(m, nn.BatchNorm2d):
                m.eval()

    def get_1x_lr_params(self):
        modules = [self.backbone]
        for i in range(len(modules)):
            for m in modules[i].named_modules():              
                if isinstance(m[1], nn.Conv2d) or isinstance(m[1], nn.BatchNorm2d):
                    for p in m[1].parameters():
                        if p.requires_grad:
                            yield p

    def get_10x_lr_params(self):
        modules = [self.Coarse_net,self.Fine_net,self.psp4,self.upsample]
        for i in range(len(modules)):
            for m in modules[i].named_modules():              
                if isinstance(m[1], nn.Conv2d) or isinstance(m[1], nn.BatchNorm2d):                       
                    for p in m[1].parameters():
                        if p.requires_grad:
                            yield p
                              
def Network(nInputChannels=5,num_classes=1,backbone='resnet101',output_stride=16,
                        sync_bn=None,freeze_bn=False,pretrained=False):
    model = SegmentationNetwork(nInputChannels=nInputChannels,num_classes=num_classes,backbone=backbone,
                output_stride=output_stride,sync_bn=sync_bn,freeze_bn=freeze_bn)
    if pretrained:       
        load_pth_name= Path.models_dir()
        pretrain_dict = torch.load( load_pth_name,map_location=lambda storage, loc: storage)
        conv1_weight_new=np.zeros( (64,5,7,7) )
        conv1_weight_new[:,:3,:,:]=pretrain_dict['conv1.weight'].cpu().data
        pretrain_dict['conv1.weight']=torch.from_numpy(conv1_weight_new  )
        state_dict = model.state_dict()
        model_dict = state_dict
        for k, v in pretrain_dict.items():
            kk='backbone.'+k
            if kk in state_dict:
                model_dict[kk] = v
        state_dict.update(model_dict)
        model.load_state_dict(state_dict)
    return model
