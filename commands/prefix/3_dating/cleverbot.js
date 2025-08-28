const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'cleverbot',
	permissions: PermissionsBitField.Flags.ManageChannels,
	execute: async (client, msg) => {

		msg.reply({ embeds: [
			new EmbedBuilder()
				.setColor('#FFA500')
				.setAuthor({ name: 'CleverBot - funkcja tymczasowo niedostępna', iconURL: msg.author.displayAvatarURL() })
				.setDescription('Ta funkcja zostanie dodana w przyszłej aktualizacji.')],
		});
	},
};