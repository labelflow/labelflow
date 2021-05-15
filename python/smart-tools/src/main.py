# import cv2
import numpy as np
import skimage
import cv2

print(skimage.__version__)

from skimage import util, filters, color


from skimage.segmentation import watershed

# #  Importing NumPy,which is the fundamental package for scientific computing with Python
img = cv2.imread("c.jpg")

edges = filters.sobel(img)

cv2.imwrite("1.jpg", edges * 255)  # Write the image

grid = util.regular_grid(img.shape, n_points=40)

seeds = np.zeros(img.shape, dtype=int)
seeds[grid] = np.arange(seeds[grid].size).reshape(seeds[grid].shape) + 1

cv2.imwrite("3.jpg", seeds)  # Write the image

w1 = watershed(edges, seeds, compactness=0.001)
w1 = w1[:, :, 0]
# w1 = color.rgb2gray(w1)

cv2.imwrite("2.jpg", w1 * 0.4)  # Write the image

labelled = color.label2rgb(w1, img, bg_label=-1)

print("w1")
print(w1.shape)
print(w1.dtype)
print("img")
print(img.shape)
print(img.dtype)
print("labelled")
print(labelled.shape)
print(labelled.dtype)


# # From https://scikit-image.org/docs/stable/auto_examples/segmentation/plot_compact_watershed.html


cv2.imwrite("4.jpg", labelled * 255)

print("Ok")
