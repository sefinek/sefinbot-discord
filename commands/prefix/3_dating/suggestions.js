const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { version } = require('../../../package.json');

module.exports = {
	name: 'sug',
	aliases: ['suggestions', 'propozycje'],
	description: 'Display suggestions embed and clear channel',
	permissions: PermissionsBitField.Flags.ManageMessages,
	cooldown: 10000,
	async execute(client, msg) {
		await msg.channel.bulkDelete(48, true);

		await msg.channel.send({ embeds: [new EmbedBuilder().setColor('#FEFFFF').setImage(`${process.env.URL_CDN}/discord/bydgobot/suggestions.png?version=${version}`)] });
	},
};