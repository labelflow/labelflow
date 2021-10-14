# Inside-Outside-Guidance (IOG)
This project hosts the code for the IOG algorithms for interactive segmentation.
> [Interactive Object Segmentation with Inside-Outside Guidance](http://openaccess.thecvf.com/content_CVPR_2020/papers/Zhang_Interactive_Object_Segmentation_With_Inside-Outside_Guidance_CVPR_2020_paper.pdf)  
> Shiyin Zhang, Jun Hao Liew, Yunchao Wei, Shikui Wei, Yao Zhao  

**Updates:**
- 2021.4.6 Create the interactive refinement branch for IOG.

![img](https://github.com/shiyinzhang/Inside-Outside-Guidance/blob/master/ims/ims.png "img")

### Abstract
This paper explores how to harvest precise object segmentation masks while minimizing the human interaction cost. To achieve this, we propose an Inside-Outside Guidance (IOG) approach in this work. Concretely, we leverage an inside point that is clicked near the object center and two outside points at the symmetrical corner locations (top-left and bottom-right or top-right and bottom-left) of a tight bounding box that encloses the target object. This results in a total of one foreground click and four background clicks for segmentation. Our IOG not only achieves state-of-the-art performance on several popular benchmarks, but also demonstrates strong generalization capability across different domains such as street scenes, aerial imagery and medical images, without fine-tuning. In addition, we also propose a simple two-stage solution that enables our IOG to produce high quality instance segmentation masks from existing datasets with off-the-shelf bounding boxes such as ImageNet and Open Images, demonstrating the superiority of our IOG as an annotation tool.

### Demo

<table>
    <tr>
        <td width="30%">
	<img src="https://github.com/shiyinzhang/Inside-Outside-Guidance/blob/master/ims/IOG.gif"/>
        </td>   
        <td width="30%">
	<img src="https://github.com/shiyinzhang/Inside-Outside-Guidance/blob/master/ims/refinement.gif"/>
        </td>   
        <td width="30%">
	<img src="https://github.com/shiyinzhang/Inside-Outside-Guidance/blob/master/ims/cross_domain.gif"/>
        </td> 
    </tr>
    <tr>
        <td width="30%" align="center">
	IOG(3 points)
        </td>   
        <td width="30%" align="center">
	IOG(Refinement)
        </td>   
        <td width="30%" align="center">
	IOG(Cross domain)
        </td> 
    </tr>
</table>


### Installation
1. Install requirement  
  - PyTorch = 0.4
  - python >= 3.5
  - torchvision = 0.2
  - pycocotools
2. Usage
You can start training with the following commands:
```
# training step
python train.py
python train_refinement.py

# testing step
python test.py
python test_refinement.py

# train step
python eval.py
python eval_refinement.py
```
We set the paths of PASCAL/SBD dataset and pretrained model in mypath.py.

### Pretrained models
| Network |Dataset | Backbone |      Download Link        |
|---------|---------|-------------|:-------------------------:|
|IOG |PASCAL + SBD  |  ResNet-101 |  [IOG_PASCAL_SBD.pth](https://drive.google.com/file/d/1Lm1hhMhhjjnNwO4Pf7SC6tXLayH2iH0l/view?usp=sharing)     |
|IOG |PASCAL |  ResNet-101   |  [IOG_PASCAL.pth](https://drive.google.com/file/d/1GLZIQlQ-3KUWaGTQ1g_InVcqesGfGcpW/view?usp=sharing)   |
|IOG-Refinement |PASCAL + SBD  |  ResNet-101 |  [IOG_PASCAL_SBD_REFINEMENT.pth](https://drive.google.com/file/d/1VdOFUZZbtbYt9aIMugKhMKDA6EuqKG30/view?usp=sharing)     |

### Dataset
With the annotated bounding boxes (∼0.615M) of ILSVRCLOC, we apply our IOG to collect their pixel-level annotations, named Pixel-ImageNet, which are publicly available at https://github.com/shiyinzhang/Pixel-ImageNet.
### Citations
Please consider citing our papers in your publications if it helps your research. The following is a BibTeX reference.

    @inproceedings{zhang2020interactive,
      title={Interactive Object Segmentation With Inside-Outside Guidance},
      author={Zhang, Shiyin and Liew, Jun Hao and Wei, Yunchao and Wei, Shikui and Zhao, Yao},
      booktitle={Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition},
      pages={12234--12244},
      year={2020}
    }

