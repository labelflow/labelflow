from inference_on_image import process, refine, clear_cache
import json
import os
import shutil

inputs_inference = json.load(open("inputs/inputs_inference.json", "r"))
inputs_refine = json.load(open("inputs/inputs_refinement.json", "r"))


def main():
    clear_cache()
    shutil.rmtree("results")
    os.mkdir("results")
    shutil.rmtree("outputs")
    os.mkdir("outputs")
    id = inputs_inference["id"]
    imageUrl = inputs_inference["imageUrl"]
    x = inputs_inference["x"]
    y = inputs_inference["y"]
    width = inputs_inference["width"]
    height = inputs_inference["height"]
    # Run inference
    process(imageUrl, x, y, width, height, id)
    # Run refinement
    pointsInside = inputs_refine.get("pointsInside", [])
    pointsOutside = inputs_refine.get("pointsOutside", [])
    refine(pointsInside, pointsOutside, id)


if __name__ == "__main__":
    main()
