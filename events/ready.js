const { Events } = require('discord.js');
const guilds = require('../config/guilds.js');

const activeIntervals = new Map();

module.exports = {
	name: Events.ClientReady,
	async execute(client) {
		console.log(`Client » Bot successfully logged in as ${client.user.username} [${process.env.PREFIX}] (${client.guilds.cache.size} guilds)`);

		require('../www/server.js')(client);
		require('../scripts/setActivity.js')(client.user);
		require('../cron/manager.js')(client);

		for (const guild of client.guilds.cache.values()) {
			const serverConfig = guilds.getServerConfig(guild.id);
			if (!serverConfig) continue;

			if (serverConfig.voiceChannels?.members?.enabled && serverConfig.voiceChannels?.members?.channelId) {
				const vcMembersChannel = guild.channels.cache.get(serverConfig.voiceChannels.members.channelId);
				if (vcMembersChannel) {
					try {
						const memberCount = guild.members.cache.filter(m => !m.user.bot).size;
						const channelName = typeof serverConfig.voiceChannels.members.name === 'function'
							? serverConfig.voiceChannels.members.name(memberCount, '')
							: serverConfig.voiceChannels.members.name;
						await vcMembersChannel.setName(channelName);
					} catch (err) {
						console.warn(`Client » Failed to initialize member count for "${guild.name}": ${err.message}`);
					}
				}
			}

			if (serverConfig.voiceChannels?.online?.enabled && serverConfig.voiceChannels?.online?.channelId) {
				const vcOnlineChannel = guild.channels.cache.get(serverConfig.voiceChannels.online.channelId);
				if (!vcOnlineChannel) {
					if (process.env.NODE_ENV === 'development') console.warn(`Client » Online count channel ${serverConfig.voiceChannels.online.channelId} not found in guild "${guild.name}" (${guild.id})`);
					continue;
				}

				const updateOnlineCountChannel = async () => {
					try {
						const onlineCount = (await guild.members.fetch())
							.filter(m => !m.user.bot && ['online', 'dnd', 'idle'].includes(m.presence?.status)).size;

						const channelName = typeof serverConfig.voiceChannels.online.name === 'function'
							? serverConfig.voiceChannels.online.name(onlineCount)
							: serverConfig.voiceChannels.online.name;
						await vcOnlineChannel.setName(channelName);
					} catch (err) {
						console.warn(`Client » Failed to update online count for "${guild.name}": ${err.message}`);
					}
				};

				// Clear existing interval if any
				const existingInterval = activeIntervals.get(guild.id);
				if (existingInterval) clearInterval(existingInterval);

				await updateOnlineCountChannel();
				const intervalId = setInterval(updateOnlineCountChannel, 5 * 60 * 1000);
				activeIntervals.set(guild.id, intervalId);
			}
		}

		console.log(`Client » Online count tracking initialized for ${client.guilds.cache.size} guilds`);
	},
};