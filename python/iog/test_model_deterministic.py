from inference_on_image import inference, refine
import json

# import os
# import shutil
from cache import Cache
import time
import shutil

inputs_inference = json.load(open("inputs/inputs_inference.json", "r"))
inputs_refine = json.load(open("inputs/inputs_refinement.json", "r"))
cache = Cache()


def main():
    # shutil.rmtree("outputs")
    # shutil.rmtree("results")
    for i in range(1):
        print(f"experiment {i}")
        cache.clear()
        # shutil.rmtree("results")
        # os.mkdir("results")
        # shutil.rmtree("outputs")
        # os.mkdir("outputs")
        id = inputs_inference["id"]
        imageUrl = inputs_inference["imageUrl"]
        x = inputs_inference["x"]
        y = inputs_inference["y"]
        width = inputs_inference["width"]
        height = inputs_inference["height"]
        center_point = [x + int(width * 0.5), y + int(height * 0.5)]
        # Run inference
        time_start = time.time()
        inference(imageUrl, x, y, width, height, center_point, id, cache=cache)
        time_end = time.time()
        print(f"Inference took {time_end-time_start} s")
        # Run refinement
        pointsInside = inputs_refine.get("pointsInside", [])
        pointsOutside = inputs_refine.get("pointsOutside", [])
        time_start = time.time()
        refine(pointsInside, pointsOutside, id, cache=cache)
        time_end = time.time()
        print(f"Refinement took {time_end-time_start} s")


if __name__ == "__main__":
    main()
