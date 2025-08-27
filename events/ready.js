const { Events } = require('discord.js');
const guildConfig = require('../guilds.js');

module.exports = {
	name: Events.ClientReady,
	async execute(client) {
		console.log(`CReady » Bot successfully logged in as ${client.user.tag} [${process.env.PREFIX}] (${client.guilds.cache.size} guilds)`);

		// Start the web server and set bot activity
		require('../www/server.js')(client);
		require('../scripts/setActivity.js')(client.user);

		// Iterate through guild configurations
		for (const [guildId, config] of Object.entries(guildConfig.data[process.env.NODE_ENV] || {})) {
			if (!config.vcOnline) continue;

			const guild = client.guilds.cache.get(guildId);
			if (!guild) {
				console.error(`CReady » Unable to find guild with ID ${guildId}`);
				continue;
			}

			const vcOnlineChannel = guild.channels.cache.get(config.vcOnlineChannel);
			if (!vcOnlineChannel) {
				console.error(`CReady » Channel with ID ${config.vcOnlineChannel} not found in guild "${guild.name}" (ID: ${guildId})`);
				continue;
			}

			const updateOnlineCountChannel = async () => {
				try {
					const onlineCount = (await guild.members.fetch())
						.filter(m => !m.user.bot && ['online', 'dnd', 'idle'].includes(m.presence?.status)).size;

					await vcOnlineChannel.setName(`🌍・Online: ${onlineCount}`);
					if (process.env.NODE_ENV === 'development') {
						console.log(`CReady » Successfully updated online count for guild "${guild.name}" to: ${onlineCount}`);
					}
				} catch (err) {
					console.warn(`CReady » An error occurred while updating online count for guild "${guild.name}": ${err.message}`);
				}
			};

			await updateOnlineCountChannel();
			setInterval(updateOnlineCountChannel, 5 * 60 * 1000); // Update every 5 minutes
		}
	},
};