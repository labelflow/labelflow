import numpy as np
import skimage
from skimage import util, filters, color
from skimage.segmentation import watershed, mark_boundaries
from skimage.io import imread, imsave

print(skimage.__version__)

# #  Importing NumPy,which is the fundamental package for scientific computing with Python
img = imread("b.jpg")

imsave("0.jpg", img)  # Write the image

edges = filters.sobel(img) * 10

imsave("1.jpg", edges)  # Write the image

grid = util.regular_grid(img.shape, n_points=img.shape[0] * img.shape[1] / (30 * 30))

seeds = np.zeros(img.shape, dtype=int)
seeds[grid] = np.arange(seeds[grid].size).reshape(seeds[grid].shape) + 1

imsave("2.jpg", seeds)  # Write the image

w1 = watershed(edges, seeds, compactness=0.01)
w1 = w1[:, :, 0]
# w1 = color.rgb2gray(w1)

imsave("3.jpg", w1)  # Write the image

# labelled = color.label2rgb(w1, img, bg_label=-1)

labelled = mark_boundaries(img, w1)

# print("w1")
# print(w1.shape)
# print(w1.dtype)
# print("img")
# print(img.shape)
# print(img.dtype)
# print("labelled")
# print(labelled.shape)
# print(labelled.dtype)

# # From https://scikit-image.org/docs/stable/auto_examples/segmentation/plot_compact_watershed.html

imsave("4.jpg", labelled * 255)

print("Ok")
