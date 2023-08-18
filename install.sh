#!/bin/bash

MUSE_INSTALLATION_DIR="/opt/Mu/"
MUSE_CONFIG_JSON="/opt/Mu/config.json"
MUSE_LOG_DIR="/var/log/muse/"
DISCORD_MESSAGES_LOG_SUBDIR="discord_messages/"
DISCORD_TOKEN_PLACEHOLDER="##DiscordToken##"
DISCORD_CLIENT_ID_PLACEHOLDER="##DiscordClientID##"
DISCORD_COMMAND_PREFIX_PLACEHOLDER="##Prefix##"
YOUTUBE_COOKIE_PLACEHOLDER="##YtCookie##"

if [ "$EUID" -ne 0 ]
  then echo "Must be run as root"
  exit
fi

install_dependencies () {
	# TODO move to using a dependency file if dependency list ever changes
	echo "Installing required dependencies..."

	echo "Fetching updates..."
	apt update -y
	echo "Update fetching complete."

	echo "Installing upgrades..."
	apt upgrade -y
	echo "Upgrade installation complete."

	echo "Installing system dependencies..."
	apt install -y build-essential gcc g++ make curl ffmpeg
	echo "System dependencies installed"

	echo "Installing latest NodeJS..."
	curl -fsSL https://deb.nodesource.com/setup_current.x | sudo bash - && apt install -y nodejs
	echo "Latest NodeJS installed."

	echo "Required dependencies installed"
}

install_node_packages () {
	cd "$MUSE_INSTALLATION_DIR" || { echo "Failed to change to installation directory to install node packages..."; exit 1; }
	echo "Installing required node packages..."
	npm install
	echo "Required node packages installed."
	# TODO change dir back to original (do when becomes necessary)
}

copy_files_to_install_dir () {
	echo "Copying program files to installation directory..."
	cp -r ./* "$MUSE_INSTALLATION_DIR"
	cp mu.service /etc/systemd/system/
	echo "Program files copied to installation directory."
}

create_logging_dir() {
	mkdir -p "$MUSE_LOG_DIR$DISCORD_MESSAGES_LOG_SUBDIR"
	chown -R muse "$MUSE_LOG_DIR$DISCORD_MESSAGES_LOG_SUBDIR"
}

setup_service () {
	echo "Setting up Muse Discord Bot service..."

	echo "Adding Muse user..."
	useradd --system muse
	echo "Muse user added."

	mkdir "$MUSE_INSTALLATION_DIR"
	copy_files_to_install_dir

	install_node_packages

	echo "Muse Discord Bot service setup complete."
}

start_service () {
	echo "Enabling Muse service..."
	systemctl enable mu.service

	echo "Starting Muse service..."
	systemctl start mu.service

	echo "Muse service enabled and started."
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

perform_clean_install () {
	echo "performing first time clean installation..."
	install_dependencies
	setup_service
	guided_setup
	start_service
	echo "Muse is now installed"
}

perform_installation_upgrade () {
	echo "performing existing installation upgrade..."
	echo "this is not fully implemented yet... a manual upgrade may be required"

	echo "Stopping Muse service..."
	systemctl stop mu.service

	# TODO proper dealing with config.json if new fields are ever added
	cp "$MUSE_INSTALLATION_DIR/config.json" ./
	copy_files_to_install_dir

	install_node_packages

	echo "Reloading Systemd..."
	systemctl daemon-reload

	echo "Starting Muse service..."
	systemctl start mu.service

	echo "Muse has been upgraded"
}

if [ ! -d "$MUSE_LOG_DIR" ];
	then
		create_logging_dir
fi

if [ ! -d "$MUSE_INSTALLATION_DIR" ];
	then
		perform_clean_install
	else
		perform_installation_upgrade
fi
