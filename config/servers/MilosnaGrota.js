const { EmbedBuilder } = require('discord.js');
const { version } = require('../../package.json');

const channels = {
	lobby: '1122001039336423435',
	ogloszenia: '1122002213909299302',
	oSerwerze: '1122001351564591104',
	propozycje: '1122002037731774464',
	generaly: '1279200514499805316',
	przedstawSie: '1122002428510863451',
	pokazRyjek: '1122002450807804034',
	animeIManga: '1122002402120314970',
	muzyka: '1122003104049668207',
	fimly: '1122006225429725294',
	ksiazki: '1122006384796520559',
	waszeZwierzaki: '1122006125529792636',
	ogloszeniaRandki: '1122025616947028130',
	kogosLgbt: '1122002573658968076',
	chlopaka: '1122002595687432296',
	dziewczyny: '1122002614712811532',
	przyjaciela: '1122002634514108437',
	przyjaciolki: '1122002656324485200',
	komendy: '1127460762202407023',
	sixObcy: '1134363191489613854',
	memy: '1122002472622379129',
	pokazPulpit: '1122003124387848263',
	cleverBot: '1162955264467669022',
	choroszcz: '1122003307418890302',
	wyroki: '1122003355821162516',
	bydgoszcz: '1127708709154471987',
	darkWeb: '1127703301824192694',
	wspolprace: '1122001371915370496',
	formularze: '1122003923864141844',
	weryfikacja1: '1122004110753927200',
	weryfikacja2: '1122004138209857688',
};

module.exports = {
	id: '1052610210189037598',

	botTrapChannelId: null,
	automodChannelId: '1122003945653547038',

	channels,

	roles: {
		wlasciciel: '1121993700625633300',
		admin: '1121993865705033738',
		moderator: '1121993981107114054',
		pomocnik: '1121994026929881149',
		wiezienChoroszczy: '1121995887598641213',
		realizatorPartnerstw: '1127476600598954094',
		pingPapiezowa: '1121997761311678474',
		pingDeadchat: '1121997762578370620',
		randkowicz: '1290999261802004614',
		weryfikacja: '1290999297726480475',
	},

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1122001070877581373',
			name: '👥・Osoby: {count} {arrow}',
		},
		online: {
			enabled: true,
			channelId: '1122001107577737286',
			name: '🌍・Online: {count}',
		},
		recordOnline: {
			enabled: true,
			channelId: '1122001134756831242',
			name: '📊・Rekord: {count}',
		},
		newest: {
			enabled: true,
			channelId: '1122001176444010568',
			name: '👋・Nowy: {user}',
		},
	},

	events: {
		welcome: {
			channelId: channels.lobby,
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#00D26A')
						.setAuthor({ name: `👋 Użytkownik ${member.user.tag} dołączył do nas`, iconURL: member.guild.iconURL() })
						.setDescription(`Witaj ${member} na naszym serwerze! Mamy wielką nadzieje, że zostaniesz u nas na dłuższy czas. Miłego pobytu.\nJesteś naszym **${memberCount}. gościem**. Dziękujemy Ci za dołączenie!`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.lobby,
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF6B6B')
						.setAuthor({ name: `😥 Użytkownik ${member.user.tag} opuścił serwer`, iconURL: member.guild.iconURL() })
						.setDescription(`Niestety osoba ${member} wyszła z naszego serwera.\nMamy nadzieję, że jeszcze wrócisz do nas. Wierzymy w Ciebie.\nPo stracie tego członka mamy w sumie **${memberCount} osób**.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.lobby,
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF4757')
						.setAuthor({ name: `⚠️ Użytkownik ${member.tag} otrzymał bana`, iconURL: member.guild.iconURL() })
						.setDescription(`Osoba z nickiem <@${member.id}> została zbanowana na naszym serwerze przez jednego z administratorów. Bywa...\nPo stracie tego osobnika mamy w sumie **${memberCount} ludzi**.`)
						.setThumbnail(member.displayAvatarURL()),
				],
			}),
		},
		directMessages: {
			welcome: {
				enabled: true,
				content: member => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#0078FF')
							.setAuthor({ name: `Witamy serdecznie na ${member.guild.name}`, iconURL: member.guild.iconURL() })
							.setDescription(`Dziękujemy za dołączenie! Po zweryfikowaniu zapoznaj się z [regulaminem](https://github.com/sefinek/Milosna_Grota/blob/main/Rules.md) serwera.\nNastępnie zachęcam do przywitania się z nami na kanale <#${process.env.CH_GENERALY}>!`)
							.addFields([
								{
									name: '💗 » Czy naprawdę jest to serwer randkowy?',
									value: 'Cóż, otóż tak! Jest to serwer stworzony z myślą o randkach. Dlaczego akurat taka tematyka? Na tego typu serwerach zwykle jest dużo kontekstu do rozmowy. Macie szansę poznać tu swoją drugą połówkę lub przyjaźń na długie lata.',
								},
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
									value: `> **Oficjalna strona:** ${process.env.URL_NOEL}\n`,
								},
								{
									name: '👋 » Zakończenie',
									value: `W razie jakichkolwiek pytań, skontaktuj się z <@${process.env.BOT_OWNER}>. Jeśli chcesz miło pogadać lub po prostu się przywitać - również pisz!\n\n~ Życzymy Ci miłego pobytu! Pozdrawiamy.`,
								},
							]),
						new EmbedBuilder()
							.setColor('#15070C')
							.setImage(`https://cdn.sefinek.net/discord/sefibot/images/guildMemberAdd.png?version=${version}`)
							.setFooter({ text: 'Copyright 2024-2025 © by Sefinek. All Rights Reserved.', iconURL: member.guild.iconURL() }),
					],
				}),
			},
		},
	},

	reactions: {
		hearts: {
			channels: [
				channels.pokazRyjek,
				channels.przedstawSie,
				channels.waszeZwierzaki,
				channels.pokazPulpit,
			],
			emoji: '❤️',
		},
		likeDislike: {
			channels: [
				channels.propozycje,
				channels.memy,
			],
			emojis: ['👍', '👎'],
		},
		approve: {
			channels: [
				'1002327796468699220',
				'1002327796468699226',
			],
			emoji: '✅',
		},
	},

	cron: {
		enabled: true,
		timezone: 'Europe/Warsaw',
		minimumOnlineMembers: 9,
		banners: {
			day: ['cat-love-you.gif', 'cat_and_fish.jpg', 'cat_purple.jpg', 'falling-into-snow-fox.gif', 'happy-senko.gif', 'senko-hearts.gif'],
			afternoon: ['cat_and_fish.jpg', 'cat_purple.jpg'],
			night: ['cat_boat.jpg', 'cat_cute.jpg', 'girl.gif', 'senko.gif', 'sleepy-fox_1.gif', 'sleepy-fox_2.gif'],
			papaj: 'papiezowa.gif',
		},
		schedules: {
			day: {
				enabled: true,
				time: '30 6 * * *',
				name: 'Miłosna Grota・😻',
				randomBanner: true,
				messageChannel: channels.generaly,
				message: '☀️ » **Tryb nocny został wyłączony**\nDzień dobry moi drodzy! Miłego dnia życzę! 😊',
				rateLimits: {
					[channels.generaly]: 0,
					[channels.przedstawSie]: 1800,
					[channels.pokazRyjek]: 3600,
					[channels.animeIManga]: 0,
					[channels.muzyka]: 0,
					[channels.fimly]: 0,
					[channels.ksiazki]: 0,
					[channels.waszeZwierzaki]: 0,
					[channels.komendy]: 0,
					[channels.sixObcy]: 1,
					[channels.pokazPulpit]: 0,
					[channels.cleverBot]: 1,
					[channels.choroszcz]: 0,
					[channels.bydgoszcz]: 0,
					[channels.darkWeb]: 1,
				},
			},
			afternoon: {
				enabled: true,
				time: '30 17 * * *',
				name: 'Miłosna Grota・😽',
				randomBanner: true,
				messageChannel: null,
				message: null,
				rateLimits: {},
			},
			night: {
				enabled: true,
				time: '30 23 * * *',
				name: 'Miłosna Grota・😴',
				randomBanner: true,
				messageChannel: channels.generaly,
				message: '🌙 » **Tryb nocny został włączony**\nMiłej nocki moi mili oraz spokojnego pobytu na serwerze! 😴',
				rateLimits: {
					[channels.generaly]: 1,
					[channels.przedstawSie]: 3600,
					[channels.pokazRyjek]: 7200,
					[channels.animeIManga]: 1,
					[channels.muzyka]: 1,
					[channels.fimly]: 2,
					[channels.ksiazki]: 2,
					[channels.waszeZwierzaki]: 1,
					[channels.komendy]: 1,
					[channels.sixObcy]: 2,
					[channels.pokazPulpit]: 1,
					[channels.cleverBot]: 2,
					[channels.choroszcz]: 1,
					[channels.bydgoszcz]: 1,
					[channels.darkWeb]: 1,
				},
			},
			papajStart: {
				enabled: true,
				time: '37 21 * * *',
				name: 'Miłosna Grota・🙏',
				randomBanner: false,
				messageChannel: channels.generaly,
				message: '🙏 **GODZINA PAPIEŻOWA** 🙏\nWybiła godzina <@&{role.pingPapiezowa}>!\n\n> https://www.youtube.com/watch?v=1vZ28SAgzKc',
				rateLimits: {},
				ignoreOnlineCheck: true,
			},
			papajEnd: {
				enabled: true,
				time: '38 21 * * *',
				name: 'Miłosna Grota・😴',
				randomBanner: true,
				bannerType: 'night',
				messageChannel: null,
				message: null,
				rateLimits: {},
				ignoreOnlineCheck: true,
			},
		},
	},

	features: {
		isDatingServer: true,
		timeBasedModes: true,
		papajMode: true,
		cleverBot: {
			enabled: true,
			channelId: channels.cleverBot,
		},
	},
};