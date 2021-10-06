from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

import uvicorn

from inference_on_image import run_iog

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

    type IogInferenceResult {
        polygons: [[[Float!]]]! 
    }

    input RunIogInput {
        id: ID!
        imageUrl: String, 
        x: Float, 
        y: Float, 
        width: Float, 
        height: Float, 
        pointsInside: [[Float!]],
        pointsOutside: [[Float!]]
        centerPoint:[Float]
    }

    type Query {
        hello: String
    }

    type Mutation {
        runIog(
            data: RunIogInput
        ): IogInferenceResult
    }
"""

datetime_scalar = ScalarType("DateTime")


@datetime_scalar.serializer
def serialize_datetime(value):
    return value.isoformat()


query = QueryType()
mutation = MutationType()
cache = Cache()


@mutation.field("runIog")
def run_iog_function(*_, data):
    return run_iog(data, cache)


@query.field("hello")
def resolve_hello(*_):
    return "Hello world!"


# Create executable schema instance
schema = make_executable_schema(type_defs, query, mutation, datetime_scalar)

app = Starlette(
    debug=True,
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
