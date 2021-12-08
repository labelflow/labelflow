#!/usr/bin/env bash

set -eo pipefail
source ../../.env.local

usage() { echo "Usage: $0 [-h help]  [-t (TAG SUFFIX)<string>] [-p (push)]" 1>&2; exit 1; }

IMAGE=iog
PUSH=false

while getopts ':t:ph' arg
do
    case $arg in
        t)TAG=$OPTARG ;;
        p)PUSH=true ;;
        h)usage ;;
    esac
done

echo "Building image $IMAGE of version $TAG under $DOCKER_REGISTRY/$IMAGE:$TAG"

docker build . --tag $DOCKER_REGISTRY/$IMAGE:$TAG
if [ $PUSH = true ]; then
    docker push $DOCKER_REGISTRY/$IMAGE:$TAG
fi
