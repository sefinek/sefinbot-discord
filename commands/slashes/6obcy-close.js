const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const ObcySessions = require('../../database/models/obcy.model');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('zakończ-sesje')
		.setDescription('Usuwa wszystkie sesje rozmów z obcymi na bieżącym kanale w bazie.'),
	execute: async (client, inter) => {
		if (!inter.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			return inter.reply({ embeds:[
				new EmbedBuilder()
					.setColor('#8D65C5')
					.setAuthor({ name: '🟣 Brak uprawnień', iconURL: inter.user.displayAvatarURL() })
					.setDescription('Niestety nie posiadasz uprawnień `Zarządzanie kanałami`.')],
			});
		}

		const updatedSession = await ObcySessions.updateMany({ channelId: inter.channel.id, closed: false }, { $set: { closed: true } });
		inter.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('#00D26A')
					.setAuthor({ name: '✔️️ Powodzenie', iconURL: inter.user.displayAvatarURL() })
					.setDescription(`Pomyślnie zaktualizowano \`${updatedSession.modifiedCount}\` wpisów w bazie dotyczących tego kanału, zmieniając wartość pola \`closed\` na \`true\`.`)
					.setFooter({ text: 'Nie używaj tego polecenia, nie mając przy tym żadnej potrzeby.' }),
			],
		});
	},
};