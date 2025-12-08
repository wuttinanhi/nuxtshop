#!/bin/bash

# Stop script on first error
set -e

# --- CONFIGURATION ---
DOCKER_USERNAME="wuttinanhi"
IMAGE_NAME="nuxtshop"
VERSION="latest"
# ---------------------

echo "1. Building image..."
docker build -t $DOCKER_USERNAME/$IMAGE_NAME:$VERSION .

# echo "2. Pushing to Docker Hub..."
# docker push $DOCKER_USERNAME/$IMAGE_NAME:$VERSION

# echo "Done! Image pushed to: $DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
