#1/bin/bash

sudo apt update -y
sudo apt upgrade -y
sudo apt install -y build-essential
sudo apt install -y curl
sudo apt install -y ffmpeg
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install -y build-essential

npm install discord.js
npm install discord-player@dev
npm install @discordjs/rest discord-api-types
npm install @discordjs/builders
npm install @discordjs/voice libsodium-wrappers
npm install @discordjs/opus

