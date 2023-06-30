#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Must be run as root"
  exit
fi

echo "Fetching updates..."
apt update -y
echo "Update fetching complete."

echo "Installing upgrades..."
apt upgrade -y
echo "Upgrade installation complete."

echo "Setting up PPA for latest nodeJS..."
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo bash -
echo "Finished setting up latest nodeJS PPA."

echo "Installing required dependencies..."
apt install -y build-essential curl ffmpeg nodejs build-essential
echo "Required dependencies installed"

echo "Installing required node packages..."
npm install
echo "Required node packages installed."
