const { EmbedBuilder } = require('discord.js');
const { version } = require('../../../package.json');

module.exports = {
	name: 'sug',
	admin: true,
	execute: async (client, msg) => {
		await msg.channel.bulkDelete(48, true);

		await msg.channel.send({ embeds: [new EmbedBuilder().setColor('#FEFFFF').setImage(`${process.env.URL_CDN}/discord/bydgobot/suggestions.png?version=${version}`)] });
	},
};