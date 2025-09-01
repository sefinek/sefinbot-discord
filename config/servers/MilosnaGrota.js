const { EmbedBuilder } = require('discord.js');
const { version } = require('../../package.json');

const channels = {
	lobby: '1122001039336423435',
	automod: '1122003945653547038',
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
	przyjaciela: '1290866021820792882',
	przyjaciolki: '1290866068147015834',
	komendy: '1290866261114228823',
	sixObcy: '1290866419176575047',
	memy: '1122002472622379129',
	pokazPulpit: '1122003124387848263',
	cleverBot: '1290867626951839764',
	choroszcz: '1122003307418890302',
	wyroki: '1122003355821162516',
	bydgoszcz: '1127708709154471987',
	darkWeb: '1127703301824192694',
	wspolprace: '1122001371915370496',
	formularze: '1122003923864141844',
	weryfikacja: '1122004110753927200',
};

const roles = {
	wlasciciel: '1121993700625633300',
	admin: '1121993865705033738',
	moderator: '1121993981107114054',
	pomocnik: '1121994026929881149',
	wiezienChoroszczy: '1121995887598641213',
	realizatorPartnerstw: '1127476600598954094',
	pingPapiezowa: '1121997761311678474',
	pingDeadchat: '1121997762578370620',
	weryfikacja: '1290999297726480475',
	randkowicz: '1290999261802004614',
};

module.exports = {
	id: '1052610210189037598',
	dev: false,

	botTrapChannelId: null,
	automodChannelId: channels.automod,

	channels,
	roles,

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1122001070877581373',
			name: (count, arrow) => `👥・Osoby: ${count} ${arrow || ''}`,
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
		pokazRyjek: {
			channels: [channels.pokazRyjek],
			requiresAttachment: true,
			emojis: ['😍', '😕', '❤️'],
			createThread: true,
			threadConfig: {
				nameTemplate: author => `${author.globalName || author.username}: Komentarze`,
				autoArchiveDuration: 3 * 24 * 60, // 3 days
				reason: author => `Zdjęcie użytkownika ${author.tag} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setColor('#FF69B4')
							.setDescription('Tutaj możesz skomentować to zdjęcie! 📸✨')
							.setFooter({ text: 'Miłosna Grota • Komentarze do zdjęcia' })
							.setTimestamp(),
					],
				},
			},
			errorMessage: 'Na tym kanale możesz publikować tylko zdjęcia! 📸',
		},
		przedstawSie: {
			channels: [channels.przedstawSie],
			minLength: 68,
			emojis: ['❤️'],
			createThread: true,
			threadConfig: {
				nameTemplate: author => `${author.globalName || author.username}: Komentarze`,
				autoArchiveDuration: 3 * 24 * 60, // 3 days
				reason: author => `Przedstawienie się użytkownika ${author.tag} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setColor('#00D26A')
							.setDescription('Tutaj możesz skomentować to przedstawienie się! 💬\n\nPamiętaj o przestrzeganiu regulaminu serwera.')
							.setFooter({ text: 'Bądź miły dla innych członków społeczności!' })
							.setTimestamp(),
					],
				},
			},
			errorMessage: minLength => `Twoje przedstawienie się jest za krótkie! Napisz co najmniej ${minLength} znaków, aby inni mogli Cię lepiej poznać. ✍️`,
		},
		waszeZwierzaki: {
			channels: [channels.waszeZwierzaki],
			requiresAttachment: true,
			emojis: ['🐾', '❤️', '😍'],
			createThread: true,
			threadConfig: {
				nameTemplate: author => `${author.globalName || author.username}: O zwierzaku`,
				autoArchiveDuration: 3 * 24 * 60, // 3 days
				reason: author => `Zdjęcie zwierzaka użytkownika ${author.tag} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setColor('#8B4513')
							.setDescription('Jakie słodkie zwierzątko! 🐾 Opowiedz nam o nim więcej!')
							.setFooter({ text: 'Miłosna Grota • O zwierzaku' })
							.setTimestamp(),
					],
				},
			},
			errorMessage: 'Na tym kanale dzielimy się zdjęciami naszych zwierzątek! 🐾📸',
		},
		pokazPulpit: {
			channels: [channels.pokazPulpit],
			requiresAttachment: true,
			emojis: ['👍', '👎'],
			errorMessage: 'Na tym kanale pokazujemy screenshots naszych pulpitów! 💻📸',
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
			emojis: ['✅'],
		},
	},

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
				banners: ['papiezowa.gif'],
				messageChannel: channels.generaly,
				message: `🙏 **GODZINA PAPIEŻOWA** 🙏\nWybiła godzina <@&${roles.pingPapiezowa}>!\n\n> https://www.youtube.com/watch?v=1vZ28SAgzKc`,
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
		unverifiedRoleId: roles.randkowicz, // randkowicz role (unverified users)
		verifiedRoleId: roles.weryfikacja, // weryfikacja role (verified users)
		timeouts: {
			tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
			tokenCooldown: 5 * 60 * 1000, // 5 minutes cooldown between token requests
			reminderInterval: 6 * 60 * 60 * 1000, // 6 hours between reminders
			kickWarningAfter: 3 * 24 * 60 * 60 * 1000, // 3 days before kick warning
			kickAfter: 4 * 24 * 60 * 60 * 1000, // 4 days before actual kick
		},
		content: guild => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#00D26A')
					.setTitle('🔐 Weryfikacja na Miłosnej Grocie')
					.setDescription(`Witaj na **${guild.name}**! ❤️\n\nAby uzyskać dostęp do wszystkich kanałów randkowych i funkcji, ukończ proces weryfikacji klikając przycisk poniżej.`)
					.addFields([
						{ name: '🛡️ Dlaczego weryfikacja?', value: 'Weryfikacja pomaga utrzymać naszą społeczność randkową bezpieczną przed botami i trollami.', inline: false },
						{ name: '⚡ Szybki proces', value: 'Ukończ weryfikację hCaptcha w przeglądarce - zajmie to tylko kilka sekund!', inline: false },
						{ name: '🔒 Bezpieczne i prywatne', value: 'Twoje dane są chronione, a proces jest całkowicie bezpieczny.', inline: false },
						{ name: '💕 Randki i znajomości', value: 'Po weryfikacji uzyskasz dostęp do kanałów randkowych i możliwość poznawania nowych osób!', inline: false },
					])
					.setFooter({ text: `${guild.name} • Kliknij przycisk poniżej aby się zweryfikować`, iconURL: guild.iconURL() })
					.setThumbnail(guild.iconURL())
					.setTimestamp(),
			],
		}),
		button: {
			label: 'Zweryfikuj się ❤️',
			emoji: '✅',
			style: 'Primary',
		},
		messages: {
			tokenMessage: {
				content: (guild, verificationUrl) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#00D26A')
							.setTitle('🔐 Weryfikacja Discord - Miłosna Grota')
							.setDescription(`Aby uzyskać dostęp do **${guild.name}**, ukończ proces weryfikacji.`)
							.addFields([
								{ name: '🔗 Link weryfikacyjny', value: `[Kliknij tutaj aby się zweryfikować](${verificationUrl})`, inline: false },
								{ name: '⏰ Wygasa za', value: '24 godziny', inline: true },
								{ name: '🛡️ Bezpieczeństwo', value: 'Ukończ wyzwanie hCaptcha', inline: true },
							])
							.setFooter({ text: 'Zachowaj ten link w tajemnicy • Weryfikacja randkowa', iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#FF6B35')
							.setTitle('⚠️ Wymagana weryfikacja - Miłosna Grota')
							.setDescription(`Cześć ${member.user.username}! ❤️\n\nTwój link weryfikacyjny dla **${guild.name}** wygasł. Musisz zweryfikować swoje konto, aby dalej korzystać z serwera randkowego.`)
							.addFields([
								{ name: '🔗 Jak się zweryfikować', value: 'Kliknij przycisk weryfikacji na serwerze, aby otrzymać nowy link weryfikacyjny.', inline: false },
								{ name: '⏰ Ważne', value: 'Jeśli nie zweryfikujesz się w ciągu 4 dni od dołączenia, zostaniesz usunięty z serwera.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Wymagana weryfikacja`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			kickWarning: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#E74C3C')
							.setTitle('🚨 Ostatnie ostrzeżenie - Usunięcie konta')
							.setDescription(`**WAŻNE POWIADOMIENIE**\n\nCześć ${member.user.username},\n\nJesteś na **${guild.name}** już ponad 3 dni bez ukończenia weryfikacji. **Masz 24 godziny na zweryfikowanie konta lub zostaniesz usunięty z serwera.**`)
							.addFields([
								{ name: '🔗 Zweryfikuj się TERAZ', value: 'Natychmiast kliknij przycisk weryfikacji na serwerze, aby otrzymać link weryfikacyjny.', inline: false },
								{ name: '⏰ Pozostały czas', value: 'Mniej niż 24 godziny do automatycznego usunięcia', inline: false },
								{ name: '❓ Potrzebujesz pomocy?', value: 'Skontaktuj się z moderatorami serwera, jeśli masz problem z weryfikacją.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Ostatnie ostrzeżenie`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			kickMessage: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#992D22')
							.setTitle('👋 Usunięto z Miłosnej Groty')
							.setDescription(`Cześć ${member.user.username},\n\nZostałeś usunięty z **${guild.name}**, ponieważ nie ukończyłeś weryfikacji w wymaganym 4-dniowym okresie.`)
							.addFields([
								{ name: '🔄 Chcesz wrócić?', value: 'Możesz dołączyć ponownie do serwera randkowego w każdej chwili, ale będziesz musiał ukończyć weryfikację w ciągu 4 dni.', inline: false },
								{ name: '❓ Pytania?', value: 'Skontaktuj się z moderatorami serwera, jeśli masz pytania dotyczące tej polityki.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Konto usunięte`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			success: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#27ae60')
							.setTitle('✅ Weryfikacja ukończona! ❤️')
							.setDescription(`Witaj na **${guild.name}**! Twoje konto zostało pomyślnie zweryfikowane.`)
							.addFields([
								{ name: '🎉 Dostęp przyznany', value: 'Masz teraz pełny dostęp do wszystkich kanałów randkowych i funkcji serwera!', inline: false },
								{ name: '💕 Znajdź swoją miłość', value: 'Możesz teraz korzystać z kanałów randkowych i poznawać nowe osoby.', inline: false },
								{ name: '📝 Zasady serwera', value: 'Upewnij się, że przeczytałeś [regulamin](https://github.com/sefinek/Milosna_Grota/blob/main/Rules.md) serwera.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Witamy w naszej społeczności!`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
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