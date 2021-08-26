import torch
import os
from iogLabelflow import Network


def model_fn(model_dir):
    model = Network()
    with open(os.path.join(model_dir, "model.pth"), "rb") as f:
        model.load_state_dict(torch.load(f))
    return model


def input_fn(request_body, request_content_type):
    """An input_fn that loads a pickled tensor"""
    if request_content_type == "application/json":
        model_input = []
        return model_input
        # return torch.load(BytesIO(request_body))
    else:
        print("Unsupported content type received.")
        # Handle other content-types here or raise an Exception
        # if the content type is not supported.
        pass


def predict_fn(input_data, model):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()
    with torch.no_grad():
        return model(input_data.to(device))


def output_fn(prediction, content_type):
    return []
