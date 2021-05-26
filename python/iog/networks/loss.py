import numpy as np
import torch
  
def class_cross_entropy_loss(output, label, size_average=False, batch_average=True, void_pixels=None):
    assert(output.size() == label.size())
    labels = torch.ge(label, 0.5).float()
    num_labels_pos = torch.sum(labels)
    num_labels_neg = torch.sum(1.0 - labels)
    num_total = num_labels_pos + num_labels_neg
    output_gt_zero = torch.ge(output, 0).float()
    loss_val = torch.mul(output, (labels - output_gt_zero)) - torch.log(
        1 + torch.exp(output - 2 * torch.mul(output, output_gt_zero)))
    if void_pixels is not None:
        w_void = torch.le(void_pixels, 0.5).float()
        final_loss = torch.mul(w_void, loss_val)
    else:
        final_loss=loss_val     
    final_loss = torch.sum(-final_loss)
    if size_average:
        final_loss /= np.prod(label.size())
    elif batch_average:
        final_loss /= label.size()[0]
    return final_loss

