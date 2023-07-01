#!/bin/bash

MUSE_CONFIG_JSON="/opt/Mu/config.json"
DISCORD_TOKEN_PLACEHOLDER="##DiscordToken##"
DISCORD_CLIENT_ID_PLACEHOLDER="##DiscordClientID##"
DISCORD_COMMAND_PREFIX_PLACEHOLDER="##Prefix##"
YOUTUBE_COOKIE_PLACEHOLDER="##YtCookie##"

if [ "$EUID" -ne 0 ]
  then echo "Must be run as root"
  exit
fi

install_dependencies () {
	echo "Installing required dependencies..."

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
	apt install -y build-essential gcc g++ make curl ffmpeg
	echo "Installing NodeJS..."
	apt install -y nodejs
	echo "Required dependencies installed"
}

setup_service () {
	echo "Setting up Muse Discord Bot service..."
	useradd --system muse
	cp -r ../Mu/ /opt/
	cp mu.service /etc/systemd/system/

	cd /opt/Mu/ || { echo "Failed to change to installation directory to install node packages..."; exit 1; }
	echo "Installing required node packages..."
	npm install
	echo "Required node packages installed."
}

start_service () {
	systemctl start mu.service
	systemctl enable mu.service
}

guided_setup () {
	echo "Beginning guided setup..."
	echo "Please fill out relevant information to ensure proper function"

	while true
	do
		read -rp 'Please enter the Discord token (required): ' token
		if [ -z "$token" ]
		then
			echo "Discord token is required."
		else
			break
		fi
	done

	read -rp 'Please enter the Discord clientID (optional): ' clientID

	read -rp 'Please enter the command prefix you wish to use (default [!]): ' prefix
	if [ -z "$prefix" ]
	then
		prefix="${prefix:-!}"
	fi

	read -rp 'Please enter the youtube cookie you wish to use (optional): ' ytCookie

	delim=$'\03'
	sed -i "s${delim}$DISCORD_TOKEN_PLACEHOLDER${delim}$token${delim}g" "$MUSE_CONFIG_JSON"
	sed -i "s${delim}$DISCORD_CLIENT_ID_PLACEHOLDER${delim}$clientID${delim}g" "$MUSE_CONFIG_JSON"
	sed -i "s${delim}$DISCORD_COMMAND_PREFIX_PLACEHOLDER${delim}$prefix${delim}g" "$MUSE_CONFIG_JSON"
	sed -i "s${delim}$YOUTUBE_COOKIE_PLACEHOLDER${delim}$ytCookie${delim}g" "$MUSE_CONFIG_JSON"
}

install_dependencies
setup_service
guided_setup
start_service
