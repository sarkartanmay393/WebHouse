#!/bin/bash

export AWS_ACCESS_KEY="$AWS_ACCESS_KEY"
export AWS_SECRET_KEY="$AWS_SECRET_KEY"
export PROJECT_NAME="$PROJECT_NAME"
export GIT_REPOSITORY="$GIT_REPOSITORY"

git clone $GIT_REPOSITORY /home/app/output
exec node script.js