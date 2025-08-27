const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getServerConfig } = require('../../../guilds.js');

module.exports = {
	name: 'cleverbot',
	execute: async (client, msg) => {
		const serverConfig = getServerConfig(msg.guild.id);
		if (!serverConfig?.isDatingServer) {
			return msg.reply('<a:error:1127481079620718635> Ta komenda jest dostępna tylko na serwerze randkowym.');
		}

		if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return msg.reply('<a:error:1127481079620718635> Nie posiadasz uprawnień **Zarządzanie kanałami**.');

		msg.reply({ embeds: [
			new EmbedBuilder()
				.setColor('#FFA500')
				.setAuthor({ name: 'CleverBot - funkcja tymczasowo niedostępna', iconURL: msg.author.displayAvatarURL() })
				.setDescription('Ta funkcja zostanie dodana w przyszłej aktualizacji.')],
		});
	},
};