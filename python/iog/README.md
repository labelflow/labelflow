# Inside-Outside-Guidance (IOG)
This package is based on:
> [Interactive Object Segmentation with Inside-Outside Guidance](http://openaccess.thecvf.com/content_CVPR_2020/papers/Zhang_Interactive_Object_Segmentation_With_Inside-Outside_Guidance_CVPR_2020_paper.pdf)  
> Shiyin Zhang, Jun Hao Liew, Yunchao Wei, Shikui Wei, Yao Zhao  

It implements on top of that a graphQL server and the logic and processing needed to perform inference and refinement on images.

## Pre-requisites

### Create a virtual env
To create the virtual env, run this at the **root of the repo**

```bash
python3 -m venv .venv
```

Start using the virtual environment at the **root of the repo**

```bash
source '.venv/bin/activate'
```

### Install requirements

Make sure pip is at the latest version, then install the requirements on this fresh virtual environment.

```console
pip install -r requirements.txt
```

### Download weights

Download the following model weights and store them under `./data/IOG_PASCAL_SBD_REFINEMENT.pth`

| Network |Dataset | Backbone |      Download Link        |
|---------|---------|-------------|:-------------------------:|
|IOG-Refinement |PASCAL + SBD  |  ResNet-101 |  [IOG_PASCAL_SBD_REFINEMENT.pth](https://drive.google.com/file/d/1VdOFUZZbtbYt9aIMugKhMKDA6EuqKG30/view?usp=sharing)     |



## Run the server locally

### Regular mode

```console
./dev-server
```
The server listens on 5000 by default.

### Debugging mode

Debug mode will run significantly slower but will write many intermediate outputs in `./outputs`.
```console
DEBUG=true ./dev-server
```

## Build the docker image

Don't forget to set the `DOCKER_REGISTRY` env var in `../../.env.local`.
```console
./build-docker -t YY:MM:DD
```
You can also push the image directly to the registry
```console
./build-docker -t YY:MM:DD -p
```

## Run the docker image locally

```
docker run -p 5000:5000 YOUR_DOCKER_IMAGE_NAME
```