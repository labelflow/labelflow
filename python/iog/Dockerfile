FROM pytorch/pytorch:1.9.0-cuda10.2-cudnn7-runtime AS iog

RUN apt-get update \
 && apt-get install -y \
      build-essential \
      ffmpeg \
      libsm6 \
      libxext6 \
 && apt-get clean

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt


EXPOSE 5000

CMD ["python", "server.py"]

################################################################################
# Build a local development version (with an embedded reverse-proxy)
#
# Use this target when you want to avoid configuring a single hostname for MinIO
# which is reachable from both the Docker host and its containers.
#
# MinIO upload links are generated from the Docker container (i.e. on NextJS
# server-side) but consumed from the web-browser (i.e. on NextJS client-side).
# In normal situations, this is not a problem since the MinIO would be reachable
# with the same hostname (e.g. a public DNS entry) on both client and server
# sides of the code.
# But, when developing with Docker locally, the client (running in the Docker
# host web-browser) would use the `localhost` hostname and the server (running
# in the container) would use the internal `minio` hostname.
# To avoid tricks such as modifying the `/etc/hosts` file, the solution here is
# to run a reverse-proxy in background of the container so that it is able to
# reach the MinIO URL `http://minio:9000` with `http://localhost:9000`.
# As the reverse-proxy is only needed from inside the container, it is indeed
# not exposed outside of the container.
FROM iog as local-dev

USER root

# Install an nginx reverse-proxy to bind `http://localhost:9000` to
# `http://minio:9000`.
RUN apt-get update && \
    apt-get install nginx -y && \
    apt-get clean
COPY ./docker-compose.dev.nginx /etc/nginx/sites-enabled/

CMD ["bash", "-c", "service nginx start && node_modules/.bin/next start"]

################################################################################
# Re-expose the standard version at the end since Docker takes the latest image
# by default when not specifying the output target
FROM iog as default
