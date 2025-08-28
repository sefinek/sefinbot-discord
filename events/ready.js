const { Events } = require('discord.js');
const guilds = require('../config/guilds.js');

module.exports = {
	name: Events.ClientReady,
	async execute(client) {
		console.log(`Client » Bot successfully logged in as ${client.user.tag} [${process.env.PREFIX}] (${client.guilds.cache.size} guilds)`);

		require('../www/server.js')(client);
		require('../scripts/setActivity.js')(client.user);
		require('../cron/manager.js')(client);

		for (const guild of client.guilds.cache.values()) {
			const serverConfig = guilds.getServerConfig(guild.id);
			if (!serverConfig) continue;

			if (serverConfig.vcMembers && serverConfig.vcMembersChannel) {
				const vcMembersChannel = guild.channels.cache.get(serverConfig.vcMembersChannel);
				if (vcMembersChannel) {
					try {
						const memberCount = guild.members.cache.filter(m => !m.user.bot).size;
						const channelName = serverConfig.vcMembersName
							.replace('{count}', memberCount)
							.replace('{arrow}', '');
						await vcMembersChannel.setName(channelName);
						if (process.env.NODE_ENV === 'development') {
							console.log(`Client » Initialized member count for "${guild.name}": ${memberCount}`);
						}
					} catch (err) {
						console.warn(`Client » Failed to initialize member count for "${guild.name}": ${err.message}`);
					}
				}
			}

			if (serverConfig.vcOnline && serverConfig.vcOnlineChannel) {
				const vcOnlineChannel = guild.channels.cache.get(serverConfig.vcOnlineChannel);
				if (!vcOnlineChannel) {
					if (process.env.NODE_ENV === 'development') console.warn(`Client » Online count channel ${serverConfig.vcOnlineChannel} not found in guild "${guild.name}" (${guild.id})`);
					continue;
				}

				const updateOnlineCountChannel = async () => {
					try {
						const onlineCount = (await guild.members.fetch())
							.filter(m => !m.user.bot && ['online', 'dnd', 'idle'].includes(m.presence?.status)).size;

						const channelName = serverConfig.vcOnlineName.replace('{count}', onlineCount);
						await vcOnlineChannel.setName(channelName);

						if (process.env.NODE_ENV === 'development') console.log(`Client » Updated online count for "${guild.name}": ${onlineCount}`);
					} catch (err) {
						console.warn(`Client » Failed to update online count for "${guild.name}": ${err.message}`);
					}
				};

				await updateOnlineCountChannel();
				setInterval(updateOnlineCountChannel, 5 * 60 * 1000); // Update every 5 minutes
			}
		}

		console.log(`Client » Online count tracking initialized for ${client.guilds.cache.size} guilds`);
	},
};