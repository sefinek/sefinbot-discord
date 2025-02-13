const { Events } = require('discord.js');
const CleverBot = require('@sefinek/cleverbot-free');
const guilds = require('../guilds.js');

const context = [];

module.exports = {
	name: Events.MessageCreate,
	async execute(msg) {
		if (!msg.guild || msg.author.bot || msg.content?.length <= 1) return;

		const serverCfg = guilds.getServerConfig(msg.guild.id);
		if (!serverCfg) return console.warn(`EventC » Server config for ${msg.guild.id} was not found`);

		if (!serverCfg.cleverBot || msg.channel.id !== serverCfg.cleverBotChannelId) return;

		await msg.channel.sendTyping();

		try {
			const res = await CleverBot.interact(msg.content, context, 'pl');

			context.push(msg.content, res);

			msg.reply(res);
		} catch (err) {
			msg.reply(`❌ **This is not the bot's fault, but www.cleverbot.com**\n> ${err.message}`);
			console.error('EventC »', err);
		}
	},
};