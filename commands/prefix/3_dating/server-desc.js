const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { version } = require('../../../package.json');

module.exports = {
	name: 'desc',
	permissions: PermissionsBitField.Flags.ManageMessages,
	execute: async (client, msg) => {
		await msg.channel.bulkDelete(48, true);

		await msg.channel.send({ embeds: [new EmbedBuilder().setColor('#FCFFFF').setImage(`${process.env.URL_CDN}/discord/bydgobot/server-desc.png?version=${version}`)] });
	},
};