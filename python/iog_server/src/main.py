from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route
import uvicorn


# class ModelInference(HTTPEndpoint):
#     async def get(self, request):
#         return PlainTextResponse(f"Hello, world!")


async def model_inference(request):
    print(request)
    return JSONResponse({"hello": "world"})


routes = [Route("/", model_inference)]

app = Starlette(debug=True, routes=routes)

################################################################################
# Launch uvicorn programmatically, from the uvicorn docs
# http://www.uvicorn.org/#running-programmatically

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, log_level="info")
