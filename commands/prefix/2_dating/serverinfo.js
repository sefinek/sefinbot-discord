const { WebhookClient, EmbedBuilder } = require('discord.js');
const { version } = require('../../../package.json');
const webhook = process.env.SERVER_INFO ? new WebhookClient({ url: process.env.SERVER_INFO }) : null;

module.exports = {
	name: 'si',
	admin: true,
	execute: async (client, msg) => {
		if (!webhook) {
			return msg.reply('❌ Webhook dla server info nie został skonfigurowany.');
		}

		await msg.channel.bulkDelete(48, true);

		await webhook.send({ embeds: [new EmbedBuilder().setColor('#F50507').setImage(`${process.env.URL_CDN}/discord/bydgobot/server-info/rules.png?version=${version}`)] });
		await webhook.send({ embeds: [new EmbedBuilder()
			.setColor('#FF3032')
			.setDescription('Znajdziesz go w naszym repozytorium na GitHub. Umieściliśmy go tam, ponieważ łatwiej się go edytuje w przyszłości. Zapoznaj się z wytycznymi, aby uniknąć niespodzianek. Życzymy miłego czytania. W razie pytań, służymy pomocą.\n\n> [**GitHub:** Milosna_Grota/blob/main/Rules.md](https://github.com/sefinek/Milosna_Grota/blob/main/Rules.md)')
			.setThumbnail(msg.guild.iconURL())],
		});

		await webhook.send({ embeds: [new EmbedBuilder().setColor('#F50507').setImage(`${process.env.URL_CDN}/discord/bydgobot/server-info/roles.png?version=${version}`)] });
		await webhook.send({ embeds: [new EmbedBuilder()
			.setColor('#FF3032')
			.setDescription(
				'<@&1127462608883171478> » Rola umożliwiająca przenoszenie użytkowników do Choroszczy, jeżeli takowa osoba złamałaby regulamin. Aktualnie można ją nabyć pisząc z nami na serwerze i wzbudzając zaufanie, potem możesz się o nią upomnieć. Jeśli uznamy ze się nadajesz się, to otrzymasz ją. Za nadużywanie owej roli, zostaniesz ukarany.\n' +
				'<@&1127475996849877022> » Dzięki niej taki osobnik może zarządzać dark webem. Modyfikować go na różne sposoby i sprzedawać osoby, a potem zyskiwać za nie kremówki, czyli serwerową walutę.\n' +
				'<@&1121994541973647381> » Za pomocą tej roli, możesz łatwo sprzedać własnego podwładnego który Ci się nie spodobał, bądź nie słuchał. Koszt takiego niewolnika możesz samodzielnie ustawić. Niewłaściwe używanie przez ciebie uprawnień tej rangi może Ci grozić zabraniem jej, oraz w gratisie pobytem w Choroszczy.'
			)],
		});

		await webhook.send({ embeds: [new EmbedBuilder().setColor('#F50507').setImage(`${process.env.URL_CDN}/discord/bydgobot/server-info/admins.png?version=${version}`)] });
		await webhook.send({ embeds: [new EmbedBuilder()
			.setColor('#FF3032')
			.setDescription('Wpisz polecenie `/admini`, aby dowiedzieć się, kto jest w zarządzie serwera. Możesz również użyć komendy `/serwer`, aby uzyskać liczbę osób zajmujących stanowisko <@&1127462608883171478>, <@&1127475996849877022> oraz pozycję <@&1121994541973647381>.')],
		});

		await webhook.send({ embeds: [new EmbedBuilder().setColor('#F50507').setImage(`${process.env.URL_CDN}/discord/bydgobot/server-info/server.png?version=${version}`)] });
		await webhook.send({ embeds: [new EmbedBuilder()
			.setColor('#FF3032')
			.addFields([
				{
					name: '⭐ » Ogólne informacje',
					value:
						`• **Założyciel serwera:** <@${process.env.BOT_OWNER}>\n` +
						'• **Rekrutacja:** Otwarta\n' +
						'• **Powstania serwera:** 14.12.2022 r.\n' +
						'• **Pierwszy sezon:** 20:00, 15.07.2023 roku\n',
				},
				{
					name: '📃 » Wstępne informacje',
					value: `**1.** Jest to serwer stworzony z myślą o randkach.\n**2.** Masz problem lub pytanie odnośnie do <@1078395610375409856> lub [LabyBOT](${process.env.URL_SEFINEK}/skiffy/labybot)?\nDołącz na [ten osobny](${process.env.URL_SKIFFY_SUPPORT}) serwer. Powodzenia!`,
				},
				{
					name: '🌍 » Nasze strony Internetowe',
					value: `• ${process.env.URL_SEFINEK}\n• ${process.env.URL_API}\n• ${process.env.URL_NOEL}`,
				},
				{
					name: '💻 » Komenda informacyjna ',
					value: `\`/pomoc\` » Spis poleceń w naszym serwerowym bocie <@${process.env.CLIENT_ID}>.`,
				},
				{
					name: '🤝 » Partnerstwa',
					value: `Chcesz nawiązać współpracę (partnerstwo) z naszym serwerem? Skontaktuj się z osobami z rolą <@&${process.env.RO_REALIZATOR_PARTNERSTW}>! Wymagania są podane [tu](https://github.com/sefinek/Milosna_Grota/tree/main/Partnerships#%EF%B8%8F-%E3%80%A2-wymagania-partnerskie).`,
				},
				{
					name: '✍️ » Realizator partnerstw',
					value: 'Rekrutacja na realizatorów jest otwarta! Wpisz polecenie `/realizator-partnerstw formularz` by złożyć podanie. Za określoną liczbę nawiązanych partnerstw, użytkownicy są wynagradzani! Sprawdź dostępne nagrody [tutaj](https://github.com/sefinek/Milosna_Grota/tree/main/Partnerships#-%E3%80%A2-nagrody-dla-realizator%C3%B3w)!',
				},
			])],
		});
	},
};