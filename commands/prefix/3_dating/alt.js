const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { version } = require('../../../package.json');

module.exports = {
	name: 'alt',
	permissions: PermissionsBitField.Flags.ManageChannels,
	execute: async (client, msg) => {
		await msg.channel.bulkDelete(48, true);

		await msg.channel.send({ embeds: [new EmbedBuilder().setColor('#FFFFFF').setImage(`${process.env.URL_CDN}/discord/bydgobot/verification/altdentifier.png?version=${version}`)] });

		msg.channel.send({ embeds: [new EmbedBuilder()
			.setColor('#CCD9E2')
			.setAuthor({ name: 'Weryfikacja numer 2 na serwerze Miłosna Grota・😻', iconURL: msg.guild.iconURL() })
			.setDescription(
				'O nie! Mamy pewne podejrzenia, że Twoje konto jest tak zwanym altem. Powiem Ci teraz krok po kroku, co dalej.\n\n' +
				'» Aby się zweryfikować w tym kroku, musisz kliknąć nadesłany link przez bota <@372022813839851520>, w prywatnych wiadomościach.\n' +
				'» Masz **45 minut** na zrealizowanie wszystkich akcji. W przeciwnym razie zostaniesz wywalony z tego serwera.\n\n' +
				`> Jeśli masz jakieś pytania, skontaktuj się z administratorem <@${process.env.OWNER}>.`
			)],
		});
	},
};