const { EmbedBuilder } = require('discord.js');

const channels = {
	lobby: '1122001039336423435',
	ogloszenia: '1122002213909299302',
	oSerwerze: '1122001351564591104',
	propozycje: '1122002037731774464',
	generaly: '1279200514499805316',
	przedstawSie: '1122002428510863451',
	pokazRyjek: '1122002450807804034',
	animeManga: '1122002402120314970',
	muzyka: '1122003104049668207',
	fimly: '1122006225429725294',
	ksiazki: '1122006384796520559',
	waszeZwierzaki: '1122006125529792636',

	chlopaka: '1290865922336096296',
	dziewczyny: '1290865970579111966',
	przyjaciela: '1290866021820792882',
	przyjaciolki: '1290866068147015834',

	komendy: '1290866261114228823',
	sixObcy: '1290866419176575047',
	memy: '1122002472622379129',
	pokazPulpit: '1122003124387848263',
	cleverBot: '1290867626951839764',
	choroszcz: '1122003307418890302',
	wyroki: '1122003355821162516',
	darkWeb: '1127703301824192694',
	wspolprace: '1122001371915370496',

	weryfikacja: '1122004110753927200',

	formularze: '1122003923864141844',
	automod: '1122003945653547038',
};

const roles = {
	wiezienChoroszczy: '1121995887598641213',
	realizatorPartnerstw: '1127476600598954094',
	pingPapiezowa: '1121997761311678474',
	pingDeadchat: '1121997762578370620',
	randkowicz: '1122000190807752817',
	weryfikacja: '1122000522132598784',
};

module.exports = {
	id: '1052610210189037598',
	dev: false,

	autoModChannel: channels.automod,

	channels,
	roles,

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1122001070877581373',
			name: (count, arrow) => `👥・Osoby: ${count} ${arrow}`,
		},
		online: {
			enabled: true,
			channelId: '1122001107577737286',
			name: count => `🌍・Online: ${count}`,
		},
		recordOnline: {
			enabled: true,
			channelId: '1122001134756831242',
			name: count => `📊・Rekord: ${count}`,
		},
		newest: {
			enabled: true,
			channelId: '1122001176444010568',
			name: user => `👋・Nowy: ${user}`,
		},
	},

	events: {
		welcome: {
			channelId: channels.lobby,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#00D26A')
						.setAuthor({ name: `👋 ${member.user.globalName} dołączył do nas`, iconURL: member.guild.iconURL() })
						.setDescription(`Witaj ${member} na naszym serwerze! Mamy wielką nadzieje, że zostaniesz u nas na dłuższy czas. Miłego pobytu.\nJesteś naszym **${memberCount} gościem**. Dziękujemy Ci za dołączenie!`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.lobby,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF6B6B')
						.setAuthor({ name: `😥 ${member.user.globalName} opuścił serwer`, iconURL: member.guild.iconURL() })
						.setDescription(`Niestety osoba ${member} wyszła z naszego serwera.\nMamy nadzieję, że jeszcze wrócisz do nas. Wierzymy w Ciebie.\nPo stracie tego członka mamy w sumie **${memberCount} osób**.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.lobby,
			content: (client, guild, user, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF4757')
						.setAuthor({ name: `⚠️ ${user.globalName} otrzymał bana`, iconURL: guild.iconURL() })
						.setDescription(`${user} został zbanowany na naszym serwerze przez jednego z administratorów. Cóż, bywa...\nPo stracie tego osobnika mamy w sumie **${memberCount} ludzi**.`)
						.setThumbnail(user.displayAvatarURL()),
				],
			}),
		},
		directMessages: {
			welcome: {
				enabled: true,
				content: (client, member) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#0078FF')
							.setAuthor({ name: `Witamy serdecznie na ${member.guild.name}`, iconURL: member.guild.iconURL() })
							.setDescription(`Dziękujemy za dołączenie! Po zweryfikowaniu zapoznaj się z [regulaminem](https://github.com/sefinek/Milosna_Grota/blob/main/Rules.md) serwera.\nNastępnie zachęcam do przywitania się z nami na kanale <#${channels.generaly}>!`)
							.addFields([
								{
									name: '😍 » Jesteś może graczem Genshin Impact?',
									value: 'Jeśli tak, odwiedź projekt [Genshin Stella Mod](https://stella.sefinek.net).\nW zupełności nie pożałujesz, a nawet zyskasz - lepszą grafikę w grze i nie tylko! Zapoznaj się z dostępnymi informacjami na stronie.',
								},
								{
									name: '🎶 » Lubisz może słuchać muzyki?',
									value: 'Jeśli interesują Cię kanały na których można znaleźć pełno sped upów przeróżnych piosenek, odwiedź: [www.youtube.com/@sefinek](https://www.youtube.com/@sefinek)',
								},
								{
									name: '🤖 » Polecamy godnego zaufania bota Noel. Dodaj go na swój serwer!',
									value: `**Oficjalna strona:** ${process.env.URL_NOEL}\n`,
								},
								{
									name: '👋 » Zakończenie',
									value: `W razie jakichkolwiek pytań, skontaktuj się z <@${process.env.OWNER}>. Jeśli chcesz miło pogadać lub po prostu się przywitać - również pisz!\n\n~ Życzymy Ci miłego pobytu! Pozdrawiamy.`,
								},
							]),
					],
				}),
			},
		},
	},

	reactions: [
		{
			name: 'photo-reactions',
			enabled: true,
			channels: [channels.pokazRyjek],
			emojis: ['😍', '😕', '❤️'],
			thread: {
				enabled: true,
				nameTemplate: author => `${author.globalName}: Komentarze`,
				autoArchiveDuration: 2 * 24 * 60,
				reason: author => `Zdjęcie użytkownika ${author.username} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setDescription('Tutaj możesz skomentować to zdjęcie! 📸✨'),
					],
				},
			},
			validation: {
				onlyImages: { message: 'Na tym kanale możesz publikować tylko zdjęcia! 📸' },
			},
		},
		{
			name: 'intro-reactions',
			enabled: true,
			channels: [channels.przedstawSie],
			emojis: ['❤️'],
			thread: {
				enabled: true,
				nameTemplate: author => `${author.globalName}: Komentarze`,
				autoArchiveDuration: 2 * 24 * 60,
				reason: author => `Przedstawienie się użytkownika ${author.username} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setDescription('Tutaj pozostali użytkownicy mogą skomentować niniejszą wiadomość. Pamiętaj, że każdy członek serwera jest zobowiązany do [przestrzegania wytycznych](https://github.com/sefinek/Milosna_Grota/blob/main/Rules.md).'),
					],
				},
			},
			validation: {
				textLength: { min: 68, message: minLength => `Twoje przedstawienie się jest za krótkie! Napisz co najmniej **${minLength} znaków**, aby inni mogli Cię lepiej poznać. ✍️` },
			},
		},
		{
			name: 'pet-reactions',
			enabled: true,
			channels: [channels.waszeZwierzaki],
			emojis: ['🐾', '❤️', '😍'],
			thread: {
				enabled: true,
				nameTemplate: author => `${author.globalName}: O zwierzaku`,
				autoArchiveDuration: 2 * 24 * 60,
				reason: author => `Zdjęcie zwierzaka użytkownika ${author.username} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setDescription('Jakie słodkie zwierzątko! 🐾 Opowiedz nam o nim więcej!'),
					],
				},
			},
			validation: {
				onlyImages: { message: 'Na tym kanale dzielimy się zdjęciami naszych zwierzątek! 🐾📸' },
			},
		},
		{
			name: 'dating-reactions',
			enabled: true,
			channels: [channels.chlopaka, channels.dziewczyny, channels.przyjaciela, channels.przyjaciolki],
			emojis: ['😻', '🤡', '⛪'],
			thread: {
				enabled: true,
				nameTemplate: author => `${author.username}: Komentarze`,
				autoArchiveDuration: 4 * 24 * 60,
				reason: author => `Prezentacja użytkownika ${author.globalName} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setDescription('Tutaj pozostali użytkownicy mogą skomentować niniejszą wiadomość. Pamiętaj, że każdy członek serwera jest zobowiązany do przestrzegania [wytycznych](https://github.com/sefinek/Milosna_Grota/blob/main/Rules.md).'),
					],
				},
			},
			validation: {
				textLength: { min: 10, message: minLength => `Twoje ogłoszenie jest zbyt krótkie! Napisz co najmniej **${minLength} znaków**, aby inni mogli dowiedzieć się o Tobie czegoś więcej. ✍️` },
			},
		},
		{
			name: 'desktop-reactions',
			enabled: true,
			channels: [channels.pokazPulpit],
			emojis: ['👍', '👎'],
			thread: { enabled: false },
			validation: {
				onlyImages: { message: 'Na tym kanale pokazujemy screenshots naszych pulpitów! 💻📸' },
			},
		},
		{
			name: 'voting-reactions',
			enabled: true,
			channels: [channels.propozycje, channels.memy],
			emojis: ['👍', '👎'],
			thread: { enabled: false },
			validation: {},
		},
		{
			name: 'admin-approval',
			enabled: true,
			channels: ['1002327796468699220', '1002327796468699226'],
			emojis: ['✅'],
			thread: { enabled: false },
			validation: {},
		},
	],

	cron: {
		enabled: true,
		timezone: 'Europe/Warsaw',
		minimumOnlineMembers: 9,
		schedules: {
			day: {
				enabled: true,
				time: '30 6 * * *',
				name: 'Miłosna Grota・😻',
				banners: ['cat-love-you.gif', 'cat_and_fish.jpg', 'cat_purple.jpg', 'falling-into-snow-fox.gif', 'happy-senko.gif', 'senko-hearts.gif'],
				messageChannel: channels.generaly,
				// message: '☀️ » **Tryb nocny został wyłączony**\nDzień dobry moi drodzy! Miłego dnia życzę! 😊',
				rateLimits: {
					[channels.generaly]: 0,
					[channels.przedstawSie]: 1800,
					[channels.pokazRyjek]: 3600,
					[channels.animeManga]: 0,
					[channels.muzyka]: 0,
					[channels.fimly]: 0,
					[channels.ksiazki]: 0,
					[channels.waszeZwierzaki]: 0,
					[channels.komendy]: 0,
					[channels.sixObcy]: 1,
					[channels.pokazPulpit]: 0,
					[channels.cleverBot]: 1,
					[channels.choroszcz]: 0,
					[channels.darkWeb]: 1,
				},
			},
			afternoon: {
				enabled: true,
				time: '30 17 * * *',
				name: 'Miłosna Grota・😽',
				banners: ['cat_and_fish.jpg', 'cat_purple.jpg'],
				messageChannel: null,
				message: null,
				rateLimits: {},
			},
			night: {
				enabled: true,
				time: '30 23 * * *',
				name: 'Miłosna Grota・😴',
				banners: ['cat_boat.jpg', 'cat_cute.jpg', 'girl.gif', 'senko.gif', 'sleepy-fox_1.gif', 'sleepy-fox_2.gif'],
				messageChannel: channels.generaly,
				// message: '🌙 » **Tryb nocny został włączony**\nMiłej nocki moi mili oraz spokojnego pobytu na serwerze! 😴',
				rateLimits: {
					[channels.generaly]: 1,
					[channels.przedstawSie]: 3600,
					[channels.pokazRyjek]: 7200,
					[channels.animeManga]: 1,
					[channels.muzyka]: 1,
					[channels.fimly]: 2,
					[channels.ksiazki]: 2,
					[channels.waszeZwierzaki]: 1,
					[channels.komendy]: 1,
					[channels.sixObcy]: 2,
					[channels.pokazPulpit]: 1,
					[channels.cleverBot]: 2,
					[channels.choroszcz]: 1,
					[channels.darkWeb]: 1,
				},
			},
			papajStart: {
				enabled: true,
				time: '37 21 * * *',
				name: 'Miłosna Grota・✝️',
				banners: ['papiezowa.gif'],
				messageChannel: channels.generaly,
				// message: `🙏 **GODZINA PAPIEŻOWA** 🙏\nWybiła godzina <@&${roles.pingPapiezowa}>!\n\n> https://www.youtube.com/watch?v=2yusdx60_aw`,
				rateLimits: {},
				ignoreOnlineCheck: true,
			},
			papajEnd: {
				enabled: true,
				time: '38 21 * * *',
				name: 'Miłosna Grota・😴',
				banners: ['cat_boat.jpg', 'cat_cute.jpg', 'girl.gif', 'senko.gif', 'sleepy-fox_1.gif', 'sleepy-fox_2.gif'],
				messageChannel: null,
				message: null,
				rateLimits: {},
				ignoreOnlineCheck: true,
			},
		},
	},

	verification: {
		enabled: true,
		unverifiedRoleId: roles.weryfikacja,
		verifiedRoleId: roles.randkowicz,
		timeouts: {
			tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
			tokenCooldown: 5 * 60 * 1000, // 5 minutes cooldown between token requests
			reminderInterval: 6 * 60 * 60 * 1000, // 6 hours between reminders
			kickWarningAfter: 3 * 24 * 60 * 60 * 1000, // 3 days before kick warning
			kickAfter: 4 * 24 * 60 * 60 * 1000, // 4 days before actual kick
		},
		content: (client, guild) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#79E0F2')
					.setAuthor({ name: 'Weryfikacja na serwerze Miłosna Grota', iconURL: guild.iconURL() })
					.setDescription(
						'👋 » Serdecznie dziękujemy za dołączenie na nasz serwer! Jeśli chcesz uzyskać dostęp do wszystkich kanałów, najpierw musisz się zweryfikować.\n\n' +
						'✨ » Kliknij przycisk poniżej, aby tego dokonać. Zajme to tylko chwilkę...\n\n' +
						`⚡ » Masz problem ze zweryfikowaniem się? Skontaktuj się z <@${process.env.OWNER}>!`
					),
			],
		}),
		button: {
			label: 'Zweryfikuj się',
			emoji: '❤️',
			style: 'Primary',
		},
		messages: {
			tokenMessage: {
				content: (guild, verificationUrl) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#5865F2')
							.setAuthor({ name: '🔐 Weryfikacja na serwerze Miłosna Grota', iconURL: guild.iconURL() })
							.setDescription('Aby uzyskać dostęp do wszystkich kanałów, ukończ proces weryfikacji. Nie udostępniaj tego linku.')
							.addFields([
								{ name: '🔗 Link weryfikacyjny', value: `[Kliknij tutaj, aby się zweryfikować](${verificationUrl}) (wygasa za 24h)`, inline: false },
							]),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#ff7746')
							.setAuthor({ name: `⚠️ Wymagana weryfikacja - ${guild.name}`, iconURL: guild.iconURL() })
							.setDescription(`Cześć ${member}. Jesteś na **${guild.name}** od ponad 3 dni bez ukończenia weryfikacji. Masz **24 godziny** na zweryfikowanie swojego konta, w przeciwnym razie zostaniesz wyrzucony z serwera. Cały proces zajmie mniej niż minutę.`)
							.addFields([
								{ name: '🔗 Zweryfikuj się teraz', value: `Kliknij niebieski przycisk na serwerze. Znajdziesz go na kanale ${channels.verification}.`, inline: false },
								{ name: '❓ Potrzebujesz pomocy?', value: 'Skontaktuj się z administratorem serwera, jeśli masz problem z weryfikacją.', inline: false },
							]),
					],
				}),
			},
			kickWarning: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#ff4f3d')
							.setAuthor({ name: `🚨 Ostatnie ostrzeżenie - ${guild.name}`, iconURL: guild.iconURL() })
							.setDescription(`**WAŻNE POWIADOMIENIE**\n\nCześć ${member.user.username},\n\nJesteś na **${guild.name}** już ponad 3 dni bez ukończenia weryfikacji. **Masz 24 godziny na zweryfikowanie konta lub zostaniesz usunięty z serwera.**`)
							.addFields([
								{ name: '🔗 Zweryfikuj się TERAZ', value: 'Natychmiast kliknij przycisk weryfikacji na serwerze, aby otrzymać link weryfikacyjny.', inline: false },
								{ name: '⏰ Pozostały czas', value: 'Mniej niż 24 godziny do automatycznego usunięcia', inline: false },
								{ name: '❓ Potrzebujesz pomocy?', value: 'Skontaktuj się z moderatorami serwera, jeśli masz problem z weryfikacją.', inline: false },
							]),
					],
				}),
			},
			kickMessage: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#ff331a')
							.setAuthor({ name: `👋 Zostałeś wyrzucony z ${guild.name}`, iconURL: guild.iconURL() })
							.setDescription('Zostałeś usunięty z serwera, ponieważ nie ukończyłeś weryfikacji w wymaganym 4-dniowym okresie.')
							.addFields([
								{ name: '🔄 Chcesz dołączyć ponownie?', value: 'Możesz wrócić na serwer w dowolnym momencie, ale musisz ukończyć weryfikację w ciągu 4 dni.', inline: false },
								{ name: '❓ Pytania?', value: 'Skontaktuj się z administratorem serwera, jeśli masz jakiekolwiek pytania.', inline: false },
							]),
					],
				}),
			},
			success: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#00d26a')
							.setAuthor({ name: '✅ Weryfikacja zakończona pomyślnie', iconURL: guild.iconURL() })
							.setDescription(`Witamy na **${guild.name}**! Twoje konto zostało zweryfikowane. Dziękujemy za dołączenie!`),
					],
				}),
			},
		},
	},

	features: {
		isDatingServer: true,
		cleverBot: channels.cleverBot,
		botTrap: null,
	},
};