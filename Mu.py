import discord
import asyncio
from discord.ext import commands

if not discord.opus.is_loaded():
	discord.opus.load_opus("opus")

client = discord.Client()
player = None
vol = 1.0

@client.event
async def on_message(message):
	global player
	global vol

	if (message.author == client.user):
		return

	if (message.content.startswith("!repeat")):
		output = message.content[7:len(message.content)].strip()
		await client.send_message(message.channel, output)			

	elif (message.content.startswith("!join")):
		channelName = message.content[5:len(message.content)].strip()
		await client.send_message(message.channel, "joining channel " + channelName)
		channelId = None;
		server = message.server

		for channel in server.channels:
			if (channel.name == channelName):
				channelId = channel.id
				break

		if (channelId == None):
			await client.send_message(message.channel, "could not find channel " + channelName)
			return
		else:
			await client.send_message(message.channel, "joining channnel with id " + channelId)
		
		voiceChannel = client.get_channel(channelId)

		if (client.is_voice_connected(server)):
			await client.voice_client_in(server).move_to(voiceChannel)

		else:
			await client.join_voice_channel(voiceChannel)
			#player = voice.create_ffmpeg_player("")
			#player.stop()


	elif (message.content == "!dc"):
		server = message.server
		if (client.is_voice_connected(server)):
			await client.voice_client_in(server).disconnect()

		else:
			await client.send_message(message.channel, "Mμ is not connected to a channel")

	elif (message.content.startswith("!play")):
		server = message.server
		url = message.content[5:len(message.content)].strip()	
		if (client.is_voice_connected(server)):
			if (player != None and player.is_playing()):
				player.stop()

			if ("youtube.com" in url):
				await client.send_message(message.channel, "attempting to play youtube video")	
				voice = client.voice_client_in(server)			
				player = await voice.create_ytdl_player(url)
				player.volume = vol
				player.start()

			else:
				await client.send_message(message.channel, "attempting to play song: " + url + ".mp3")	
				url = "music/" + url + ".mp3"
				voice = client.voice_client_in(server)			
				player = voice.create_ffmpeg_player(url)
				player.volume = vol
				player.start()

		else:
			await client.send_message(message.channel, "Mμ is not connected to a voice channel")

	elif (message.content == "!stop"):
		if (player != None and player.is_playing()):
			player.stop()

		else:
			await client.send_message(message.channel, "Mμ is not currently playing anything")

	elif (message.content.startswith("!vol")):
		server = message.server
		vol = float(message.content[4:len(message.content)].strip())
		vol /= 100

		if (vol > 2.0):
			vol = 2.0

		elif (vol < 0.0):
			vol = 0.0

		if (client.is_voice_connected(server)):
			if (player != None):
				player.volume = vol

		else:
			await client.send_message(message.channel, "Mμ is not connected to a voice channel")

	elif (message.content == "!id"):
		await client.send_message(message.channel, message.channel.id)

	elif (message.content == "!ping"):
		await client.send_message(message.channel, "pong!")

@client.event
async def on_ready():
	global player
	print("Logged in as")
	print(client.user.name)
	print(client.user.id)
	print("------")

client.run("NTQwMzczOTI0Nzg2MjA4Nzg4.DzvO6w.W4v9eusP-uxr3OKaCliUfPM3JB8");
