FROM ubuntu:focal

# System setup
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs
RUN apt-get install git -y

WORKDIR /home/app
COPY . .
RUN npm install
RUN chmod +x entry.sh
RUN chmod +x script.js

ENTRYPOINT [ "entry.sh" ]