const { Events } = require('discord.js');
const CleverBot = require('@sefinek/cleverbot-free');
const guilds = require('../config/guilds.js');

const contextMap = new Map();

module.exports = {
	name: Events.MessageCreate,
	async execute(msg) {
		if (!msg.guild || msg.author.bot || msg.content?.length <= 1) return;

		const serverCfg = guilds.getServerConfig(msg.guild.id);
		if (!serverCfg) {
			if (guilds.shouldIgnoreGuild(msg.guild.id)) return;
			return console.warn(`EventC » Server config for ${msg.guild.id} was not found`);
		}

		if (!serverCfg.features?.cleverBot || msg.channel.id !== serverCfg.features.cleverBot) return;

		await msg.channel.sendTyping();

		try {
			const channelKey = `${msg.guild.id}-${msg.channel.id}`;
			let context = contextMap.get(channelKey) || [];
			
			const res = await CleverBot.interact(msg.content, context, 'pl');

			context.push(msg.content, res);
			
			// Limit context size to prevent memory leak
			if (context.length > 20) {
				context = context.slice(-20);
			}
			
			contextMap.set(channelKey, context);
			msg.reply(res);
		} catch (err) {
			msg.reply(`❌ **This is not the bot's fault, but www.cleverbot.com**\n> ${err.message}`);
			console.error('EventC »', err);
		}
	},
};