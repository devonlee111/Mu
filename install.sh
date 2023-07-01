#!/bin/bash

MUSE_CONFIG_JSON="config.json"
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
	apt install -y build-essential curl ffmpeg nodejs build-essential
	echo "Required dependencies installed"

	echo "Installing required node packages..."
	npm install
	echo "Required node packages installed."
}

setup_service () {
	echo "Setting up Muse Discord Bot service..."
	useradd --system muse
	cp -r ../Mu/ /opt/
	cp mu.service /etc/systemd/system/
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

	while true
	do
		read -rp 'Please enter the Discord clientID (required): ' clientID
		if [ -z "$clientID" ]
		then
			echo "Discord client ID is required."
			continue
		else
			break
		fi
	done

	read -rp 'Please enter the command prefix you wish to use (default [!]): ' prefix
	if [ -z "$prefix" ]
	then
		prefix="${prefix:-!}"
	fi

	read -rp 'Please enter the youtube cookie you wish to use (optional): ' ytCookie

	#TODO
	# Fill out the config file with token, clientID, prefix, and ytCookie
	sed -i "s/$DISCORD_TOKEN_PLACEHOLDER/$token" $MUSE_CONFIG_JSON
	sed -i "s/$DISCORD_CLIENT_ID_PLACEHOLDER/$clientID" $MUSE_CONFIG_JSON
	sed -i "s/$DISCORD_COMMAND_PREFIX_PLACEHOLDER/$prefix" $MUSE_CONFIG_JSON
	sed -i "s/$YOUTUBE_COOKIE_PLACEHOLDER/$ytCookie" $MUSE_CONFIG_JSON
}

guided_setup
install_dependencies
setup_service
