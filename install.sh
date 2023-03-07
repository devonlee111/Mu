#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Must be run as root"
  exit
fi


apt update -y
apt upgrade -y
apt install -y build-essential
apt install -y curl
apt install -y ffmpeg
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo bash -
apt install -y nodejs
apt install -y build-essential

npm install
