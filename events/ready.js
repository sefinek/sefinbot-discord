const { Events } = require('discord.js');
const guilds = require('../config/guilds.js');

module.exports = {
	name: Events.ClientReady,
	async execute(client) {
		console.log(`CReady » Bot successfully logged in as ${client.user.tag} [${process.env.PREFIX}] (${client.guilds.cache.size} guilds)`);

		// Start the web server and set bot activity
		require('../www/server.js')(client);
		require('../scripts/setActivity.js')(client.user);

		// Initialize online count updates for all guilds
		for (const guild of client.guilds.cache.values()) {
			const serverConfig = guilds.getServerConfig(guild.id);
			if (!serverConfig || !serverConfig.vcOnline) continue;

			const vcOnlineChannel = guild.channels.cache.get(serverConfig.vcOnlineChannel);
			if (!vcOnlineChannel) {
				console.warn(`CReady » Online count channel ${serverConfig.vcOnlineChannel} not found in guild "${guild.name}" (${guild.id})`);
				continue;
			}

			const updateOnlineCountChannel = async () => {
				try {
					const onlineCount = (await guild.members.fetch())
						.filter(m => !m.user.bot && ['online', 'dnd', 'idle'].includes(m.presence?.status)).size;

					const channelName = serverConfig.vcOnlineName.replace('{count}', onlineCount);
					await vcOnlineChannel.setName(channelName);

					if (process.env.NODE_ENV === 'development') {
						console.log(`CReady » Updated online count for "${guild.name}": ${onlineCount}`);
					}
				} catch (err) {
					console.warn(`CReady » Failed to update online count for "${guild.name}": ${err.message}`);
				}
			};

			// Initial update and set interval
			await updateOnlineCountChannel();
			setInterval(updateOnlineCountChannel, 5 * 60 * 1000); // Update every 5 minutes
		}

		console.log(`CReady » Online count tracking initialized for ${client.guilds.cache.size} guilds`);
	},
};