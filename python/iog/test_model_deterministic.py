from inference_on_image import process, refine
import json
# import os
# import shutil
from cache import Cache
import time

inputs_inference = json.load(open("inputs/inputs_inference.json", "r"))
inputs_refine = json.load(open("inputs/inputs_refinement.json", "r"))
cache = Cache()


def main():
    for i in range(10):
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
        # Run inference
        time_start = time.time()
        process(imageUrl, x, y, width, height, id, cache=cache)
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
