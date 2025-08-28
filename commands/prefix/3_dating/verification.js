const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'ver',
	permissions: PermissionsBitField.Flags.ManageMessages,
	execute: async (client, msg) => {
		await msg.channel.bulkDelete(48, true);

		await msg.channel.send({ embeds: [new EmbedBuilder().setColor('#FCFFFF').setImage(`${process.env.URL_CDN}/discord/bydgobot/verification/standard.png`)] });

		await msg.channel.send({ embeds: [new EmbedBuilder()
			.setColor('#79E0F2')
			.setAuthor({ name: 'Weryfikacja numer 1 na serwerze Miłosna Grota・😻', iconURL: msg.guild.iconURL(), url: process.env.URL_SEFINEK })
			.setDescription(
				'👋 » Serdecznie dziękujemy za dołączenie na nasz serwer! Jeśli chcesz uzyskać dostęp do wszystkich kanałów, najpierw musisz się zweryfikować.\n\n' +
				'✨ » Napisz słowo `Love` na tym kanale, aby się zweryfikować. Wielkość liter nie ma znaczenia.\n\n' +

				// '🔎 » W niektórych przypadkach może być wymagana dodatkowa weryfikacja realizowana za pośrednictwem bota <@372022813839851520>. Jeśli nie widzisz kanału o nazwie weryfikacja-2, owa akcja Ciebie nie obowiązuje. Natomiast jeśli widzisz, na PW powinieneś otrzymać wiadomość od AltDentifier. Następnie postępuj zgodnie z nadesłanymi przez bota krokami. Życzymy powodzenia!\n\n' +

				`⚡ » Masz problem ze zweryfikowaniem się? Skontaktuj się z <@${process.env.BOT_OWNER}>!`
			)],
		});

		await msg.channel.send('> Wpisz `Love` by się zweryfikować! Krótsza wiadomość, dla tych co nie lubią dużo czytać... Powodzenia!');
	},
};