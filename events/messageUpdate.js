const { Events } = require('discord.js');
const guilds = require('../config/guilds.js');
const checkMessage = require('../services/checkMessage.js');

module.exports = {
	name: Events.MessageUpdate,
	async execute(_, newMsg, client) {
		if (!newMsg.guild || newMsg.author.bot) return;

		// Retrieve the server configuration
		const serverCfg = guilds.getServerConfig(newMsg.guild.id);
		if (!serverCfg) {
			if (guilds.shouldIgnoreGuild(newMsg.guild.id)) return;
			return console.warn(`EventU » Unable to find server configuration for guild ID ${newMsg.guild.id}`);
		}

		// Validate and process the updated message
		try {
			await checkMessage(client, newMsg, 'update', serverCfg);
		} catch (err) {
			console.warn(`EventU » An error occurred while processing the updated message in guild ID ${newMsg.guild.id}:`, err.message);
		}
	},
};