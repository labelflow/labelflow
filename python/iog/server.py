from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

import uvicorn
import base64
import numpy as np
import cv2

from inference_on_image import process, refine


from ariadne import (
    QueryType,
    MutationType,
    ScalarType,
    make_executable_schema,
)
from ariadne.asgi import GraphQL
from starlette.applications import Starlette
import uvicorn

# import json
from cache import Cache


################################################################################
# GraphQL section, from the Ariadne docs
# See https://ariadnegraphql.org/docs/starlette-integration

type_defs = """
    scalar DateTime
    scalar Json

    type iogInferenceResult {
        polygons: [[[Float!]]]! 
    }

    input iogInferenceInput {
        id: ID!
        imageUrl: String!, 
        x: Float!, 
        y: Float!, 
        width: Float!, 
        height: Float!, 
        pointsInside: [[Float!]],
        pointsOutside: [[Float!]]
    }

    input IogRefinementInput {
        id: ID!
        pointsInside: [[Float!]]
        pointsOutside: [[Float!]]
    }

    type Query {
        hello: String!
        projects(first: Int): [Project!]!
    }

    type Mutation {
        iogInference(
            data: iogInferenceInput
        ): iogInferenceResult
        iogRefinement(
            data: IogRefinementInput
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
cache = Cache()


@mutation.field("iogInference")
def resolve_iog_inference(*_, data):
    # json.dump(data, open("inputs/inputs_inference.json", "w"))
    id = data["id"]
    imageUrl = data["imageUrl"]
    x = data["x"]
    y = data["y"]
    width = data["width"]
    height = data["height"]

    return {"polygons": process(imageUrl, x, y, width, height, id, cache=cache)}


@mutation.field("iogRefinement")
def resolve_iog_refinement(*_, data):
    # json.dump(data, open("inputs/inputs_refinement.json", "w"))
    # print(data)
    id = data["id"]
    pointsInside = data.get("pointsInside", [])
    pointsOutside = data.get("pointsOutside", [])

    return {"polygons": refine(pointsInside, pointsOutside, id, cache=cache)}


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

    cv2.imwrite("results/test.jpg", image)
    x = inputs["x"]
    y = inputs["y"]
    width = inputs["width"]
    height = inputs["height"]
    roi = [x, image.shape[0] - y - height, width, height]
    print(roi)
    # process(image, roi)
    return JSONResponse({"polygons": process(image, roi)})


routes = [Route("/", model_inference, methods=["POST"])]

app = Starlette(
    debug=True,
    routes=routes,
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_methods=["POST"],
            allow_headers=["*"],
        )
    ],
)

# Add Graphql endpoint
app.mount("/graphql", GraphQL(schema, debug=True))


################################################################################
# Launch uvicorn programmatically, from the uvicorn docs
# http://www.uvicorn.org/#running-programmatically

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=5000, log_level="info")
