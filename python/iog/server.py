from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route
import uvicorn
import base64
import numpy as np
import cv2

from inference_on_image import process


from ariadne import (
    QueryType,
    MutationType,
    ScalarType,
    make_executable_schema,
)
from ariadne.asgi import GraphQL
from starlette.applications import Starlette
import uvicorn


################################################################################
# GraphQL section, from the Ariadne docs
# See https://ariadnegraphql.org/docs/starlette-integration

type_defs = """
    scalar DateTime
    scalar Json

    type iogInferenceResult {
        polygons: [[[Float!]]]! 
    }

    type Query {
        hello: String!
        projects(first: Int): [Project!]!
    }

    type Mutation {
        iogInference(
            imageUrl: String!, 
            x: Float!, 
            y: Float!, 
            width: Float!, 
            height: Float!, 
            pointsInside: [[Float!]],
            pointsOutside: [[Float!]]
        ): iogInferenceResult
    }

   type Project {
        id:        Int
        createdAt: DateTime
        updatedAt: DateTime
        name:      String
    }
"""

datetime_scalar = ScalarType("DateTime")


@datetime_scalar.serializer
def serialize_datetime(value):
    return value.isoformat()


query = QueryType()


@query.field("hello")
def resolve_hello(*_):
    return "Hello world!"


mutation = MutationType()


@mutation.field("iogInference")
def resolve_iog_inference(
    *_, imageUrl, x, y, width, height, pointsInside=[], pointsOutside=[]
):
    # Decode image
    image_b64 = imageUrl.split(",")[1]
    binary = base64.b64decode(image_b64)
    image = np.asarray(bytearray(binary), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    cv2.imwrite("test.jpg", image)

    roi = [x, image.shape[0] - y - height, width, height]
    return {"polygons": process(image, roi)}


# Create executable schema instance
schema = make_executable_schema(type_defs, query, mutation, datetime_scalar)


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
    x = inputs["x"]
    y = inputs["y"]
    width = inputs["width"]
    height = inputs["height"]
    roi = [x, image.shape[0] - y - height, width, height]
    print(roi)
    # process(image, roi)
    return JSONResponse({"polygons": process(image, roi)})


routes = [Route("/", model_inference, methods=["POST"])]

app = Starlette(debug=True, routes=routes)

# Add Graphql endpoint
app.mount("/graphql", GraphQL(schema, debug=True))


################################################################################
# Launch uvicorn programmatically, from the uvicorn docs
# http://www.uvicorn.org/#running-programmatically

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=5000, log_level="info")
