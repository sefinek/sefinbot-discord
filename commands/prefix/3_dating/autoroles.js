const { WebhookClient, EmbedBuilder, PermissionsBitField } = require('discord.js');
const webhook = process.env.AUTO_ROLES ? new WebhookClient({ url: process.env.AUTO_ROLES }) : null;
const off = true;

module.exports = {
	name: 'ar',
	permissions: PermissionsBitField.Flags.ManageChannels,
	execute: async (client, msg) => {
		if (!webhook) {
			return msg.reply('❌ Webhook dla auto-ról nie został skonfigurowany.');
		}

		await msg.channel.bulkDelete(48, true);

		await webhook.send({ embeds: [new EmbedBuilder()
			.setColor('#F9C23C')
			.setAuthor({ name: '✨ Auto-role znajdują się teraz w nowym miejscu!' }),
		] });

		msg.channel.send(`${process.env.URL_CDN}/discord/bydgobot/roles.mp4`);


		if (off) return;

		await webhook.send({ embeds: [new EmbedBuilder()
			.setColor('#F7312F')
			.setAuthor({ name: '🔖 Wybierz swoją płeć' })
			.setDescription(
				'✨ » Chłopak\n' +
				'🎀 » Dziewczyna\n' +
				'💎 » Nie chcę podawać'
			)],
		});

		setTimeout(() => {
			webhook.send({ embeds: [new EmbedBuilder()
				.setColor('#F9C33C')
				.setAuthor({ name: '✨ Wybierz swój wiek' })
				.setDescription(
					'1️⃣ » 13 lat\n' +
					'2️⃣ » 14 lat\n' +
					'3️⃣ » 15 lat\n' +
					'4️⃣ » 16 lat\n' +
					'5️⃣ » 17 lat\n' +
					'6️⃣ » 18 lat\n' +
					'7️⃣ » Więcej niż 18 lat'
				)],
			});
		}, 480000);

		setTimeout(() => {
			webhook.send({ embeds: [new EmbedBuilder()
				.setColor('#F3C07B')
				.setAuthor({ name: '🏡 Wybierz województwo, z którego pochodzisz' })
				.setDescription(
					'🏘️ » Dolnośląskie\n' +
					'🪂 » Kujawsko-Pomorskie\n' +
					'🏰 » Lubelskie\n' +
					'🛣️ » Lubuskie\n' +
					'⛲ » Łódzkie\n' +
					'🚊 » Małopolskie\n' +
					'🌆 » Mazowieckie\n' +
					'🏟️ » Opolskie\n' +
					'🌌 » Podkarpackie\n' +
					'⭐ » Podlaskie\n' +
					'🏝️ » Pomorskie\n' +
					'🌁 » Śląskie\n' +
					'🏢 » Świętokrzyskie\n' +
					'🚤 » Warmińsko-Mazurskie\n' +
					'🌉 » Wielkopolskie\n' +
					'🏖️ » Zachodniopomorskie'
				)],
			});
		}, 960000);

		setTimeout(() => {
			webhook.send({ embeds: [new EmbedBuilder()
				.setColor('#F8312F')
				.setAuthor({ name: '💥 Wybierz kolor nazwy użytkownika' })
				.setDescription(
					'🥶 » <@&1121994466715242567>\n' +
					'💙 » <@&1121994493030318112>\n' +
					'🌌 » <@&1121994516912689295>\n' +
					'🥬 » <@&1121994518246465568>\n' +
					'💚 » <@&1121994519269883976>\n' +
					'🟢 » <@&1121994520129704029>\n' +
					'🌷 » <@&1121994521643864074>\n' +
					'🌸 » <@&1121994523187351552>\n' +
					'🧀 » <@&1121994524139470869>\n' +
					'💜 » <@&1121994524831535115>\n' +
					'🧡 » <@&1121994526182080562>\n' +
					'🍊 » <@&1121994527083872368>\n' +
					'🍅 » <@&1121994528014991370>\n' +
					'🌹 » <@&1121994529030025326>\n' +
					'📿 » <@&1121994530137313360>\n' +
					'◼️ » <@&1121994531248807997>\n'
				)],
			});
		}, 1440000);

		setTimeout(() => {
			webhook.send({ embeds: [new EmbedBuilder()
				.setColor('#F9C33C')
				.setAuthor({ name: '📣 Role do pingów' })
				.setDescription(
					'1️⃣ » Ping ogłoszenia\n' +
					'2️⃣ » Ping godzina papieżowa\n' +
					'3️⃣ » Ping bump\n' +
					'4️⃣ » Ping death chat\n' +
					'5️⃣ » Ping partnerstwa\n'
				)],
			});
		}, 1920000);

		// setTimeout(() => {
		// 	webhook.send({ embeds: [new EmbedBuilder()
		// 		.setColor('#00A6ED')
		// 		.setAuthor({ name: '🤖 Role do pingów dla botów Skiffy / Noel™ / LabyBOT' })
		// 		.setDescription(
		// 			'📄 » Powiadomienia o aktualnościach\n' +
		// 			'📥 » Powiadomienia o nowych aktualizacjach\n' +
		// 			'🌍 » Powiadomienia związane z statusem usług',
		// 		)],
		// 	});
		// }, 2400000);

		setTimeout(() => {
			webhook.send({ embeds: [new EmbedBuilder()
				.setColor('#A56953')
				.setAuthor({ name: '🐂 Choroszcz pozdrafia' })
				.setDescription('🎟️ » Bilet do Choroszczy')
				.setFooter({ text: 'Po kliknięciu reakcji zostaną ujawnione nowe kanały związane z Choroszczą.\nOdblokujesz dostęp m.in do kanału z ekonomią oraz sam w sobie psychiatryk.' })],
			});
		}, 2400000);
	},
};