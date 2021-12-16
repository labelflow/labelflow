import hub
import numpy as np
import os
import argparse


def read_yolo_boxes(fn: str):
    """
    Function reads a label.txt YOLO file and returns a numpy array of yolo_boxes
    for the box geometry and yolo_labels for the corresponding box labels.
    """

    box_f = open(fn)
    lines = box_f.read()
    box_f.close()

    # Split each box into a separate lines
    lines_split = lines.splitlines()

    yolo_boxes = np.zeros((len(lines_split), 4))
    yolo_labels = np.zeros(len(lines_split))

    # Go through each line and parse data
    for l, line in enumerate(lines_split):
        line_split = line.split()
        yolo_boxes[l, :] = np.array(
            (
                float(line_split[1]),
                float(line_split[2]),
                float(line_split[3]),
                float(line_split[4]),
            )
        )
        yolo_labels[l] = int(line_split[0])

    return yolo_boxes, yolo_labels


def export_yolo_dataset_hub(path_to_dataset: str):
    name_dataset = os.path.basename(path_to_dataset)
    # print("name_dataset = {}".format(name_dataset))
    ds = hub.empty(
        "s3://labelflow-hub-1/{}".format(name_dataset), overwrite=True
    )  # Create the dataset on our dedicated s3 bucket

    # List of all images
    with open(os.path.join(path_to_dataset, "train.txt"), "r") as f:
        fn_imgs = map(
            lambda path_outside_dataset: path_to_dataset
            + path_outside_dataset.split(name_dataset)[1],
            f.read().splitlines(),
        )

    # List of all class names
    with open(os.path.join(path_to_dataset, "obj.names"), "r") as f:
        class_names = f.read().splitlines()

    # print("fn_imgs = {}".format(list(fn_imgs)))
    # print("class_names = {}".format(class_names))

    with ds:
        ds.create_tensor("images", htype="image", sample_compression="jpeg")
        ds.create_tensor("labels", htype="class_label", class_names=class_names)
        ds.create_tensor("boxes", htype="bbox")

        for fn_img in fn_imgs:

            img_name = os.path.splitext(os.path.basename(fn_img))[0]
            fn_box = img_name + ".txt"

            # Get the arrays for the bounding boxes and their classes
            yolo_boxes, yolo_labels = read_yolo_boxes(
                os.path.join(path_to_dataset, "obj_train_data", fn_box)
            )
            # print("fn_img = {}".format(fn_img))
            # print("yolo_labels = {}".format(yolo_labels))
            # print("yolo_boxes = {}".format(yolo_boxes))

            # Append data to tensors
            ds.images.append(hub.read(fn_img))
            ds.labels.append(yolo_labels.astype(np.uint32))
            ds.boxes.append(yolo_boxes.astype(np.float32))

        ds.commit("test")
        # ds.flush()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run class agnostic segmentation")
    parser.add_argument(
        "--path",
        type=str,
        help="path to yolo dataset",
    )

    args = parser.parse_args()
    export_yolo_dataset_hub(args.path)
