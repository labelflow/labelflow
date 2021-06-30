from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route
import uvicorn
import base64
import numpy as np
import cv2

from inference_on_image import process

# class ModelInference(HTTPEndpoint):
#     async def get(self, request):
#         return PlainTextResponse(f"Hello, world!")


async def model_inference(request):
    inputs = await request.json()

    # Retrieve image as DataUrl
    dataurl = inputs["imageUrl"]

    # Decode image
    image_b64 = dataurl.split(",")[1]
    binary = base64.b64decode(image_b64)
    image = np.asarray(bytearray(binary), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    cv2.imwrite("test.jpg", image)
    roi = []
    process(image, roi)
    return JSONResponse({"hello": "world"})


routes = [Route("/", model_inference, methods=['POST'])]

app = Starlette(debug=True, routes=routes)

################################################################################
# Launch uvicorn programmatically, from the uvicorn docs
# http://www.uvicorn.org/#running-programmatically

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=5000, log_level="info")

