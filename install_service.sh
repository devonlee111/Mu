#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Must be run as root"
  exit
fi

# TODO
# Install dependences (move to seperate installation script?)
# Setup Muse user
# Reload Systemd
# Enable service

cp mu.service /etc/systemd/system
