const { EmbedBuilder } = require('discord.js');

const channels = {
	welcome: '943910440990294021',
	generaly: '943910440990294021',
	przedstawSie: '943910440990294022',
	pokazRyjek: '943910440990294023',
	waszeZwierzaki: '943910440990294024',
	pokazPulpit: '943910440990294025',
	propozycje: '943910441241944064',
	memy: '943910441241944065',
	cleverBot: '943910441241944066',
	dating: '990080362073952296',

	verification: '964724152898560070',
};

const roles = {
	verified: '1411308185889017896',
	unverified: '1411308251143733290',
};

module.exports = {
	id: '943910440520527873',
	dev: true,

	autoModChannel: '1188578816310906890',

	channels,
	roles,

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1296966242439266377',
			name: (count, arrow) => `👥・Members: ${count} ${arrow}`,
		},
		online: {
			enabled: true,
			channelId: '1305027263997415485',
			name: count => `🌍・Online: ${count}`,
		},
		newest: {
			enabled: true,
			channelId: '1305020387104395365',
			name: user => `🆕・New: ${user}`,
		},
	},

	events: {
		welcome: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#05ff81')
						.setAuthor({ name: `👋 ${member.user.globalName} dołączył do nas`, iconURL: member.guild.iconURL() })
						.setDescription(`Witaj ${member} na naszym serwerze! Mamy wielką nadzieje, że zostaniesz u nas na dłuższy czas. Miłego pobytu.\nJesteś naszym **${memberCount} gościem**. Dziękujemy Ci za dołączenie!`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#61d2ff')
						.setAuthor({ name: `😥 ${member.user.globalName} opuścił serwer`, iconURL: member.guild.iconURL() })
						.setDescription(`Niestety osoba ${member} wyszła z naszego serwera.\nMamy nadzieję, że jeszcze wrócisz do nas. Wierzymy w Ciebie.\nPo stracie tego członka mamy w sumie **${memberCount} osób**.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.welcome,
			content: (client, guild, user, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#ff4f62')
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
							.setColor('#00FFFF')
							.setAuthor({ name: `🔧 Witaj na ${member.guild.name}`, iconURL: member.guild.iconURL() })
							.setDescription('To jest serwer testowy. Niektóre funkcje mogą nie działać poprawnie lub być niedostępne. Jeśli masz pytania, skontaktuj się z administratorem serwera.'),
					],
				}),
			},
		},
	},

	cron: {
		enabled: true,
		timezone: 'Europe/Warsaw',
		minimumOnlineMembers: 0,
		schedules: {
			day: {
				enabled: true,
				time: '0 6 * * *',
				name: 'Dev Server・🌅',
				banners: ['cat-love-you.gif', 'happy-senko.gif'],
				messageChannel: channels.generaly,
				message: '☀️ **Day mode activated** - Testing time-based modes!',
				rateLimits: {},
			},
			night: {
				enabled: true,
				time: '0 22 * * *',
				name: 'Dev Server・🌙',
				banners: ['cat_boat.jpg', 'sleepy-fox_1.gif'],
				messageChannel: channels.generaly,
				message: '🌙 **Night mode activated** - Testing night features!',
				rateLimits: {},
			},
		},
	},

	reactions: [
		{
			name: 'photo-reactions',
			enabled: true,
			channels: [channels.pokazRyjek],
			emojis: ['😍', '😐', '🤢'],
			thread: {
				enabled: true,
				nameTemplate: author => `${author.username}: Komentarze`,
				autoArchiveDuration: 2 * 24 * 60,
				reason: author => `Zdjęcie użytkownika ${author.globalName} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setDescription('Tutaj możesz skomentować to zdjęcie! 📸✨'),
					],
				},
			},
			validation: {
				onlyImages: { message: 'Na tym kanale możesz udostępniać tylko zdjęcia! 📸' },
			},
		},
		{
			name: 'intro-reactions',
			enabled: true,
			channels: [channels.przedstawSie],
			emojis: ['❤️'],
			thread: {
				enabled: true,
				nameTemplate: author => `${author.username}: Komentarze`,
				autoArchiveDuration: 2 * 24 * 60,
				reason: author => `Przedstawienie się użytkownika ${author.globalName} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setDescription('Tutaj możesz skomentować to przedstawienie się! Pamiętaj o przestrzeganiu regulaminu serwera.'),
					],
				},
			},
			validation: {
				textLength: { min: 20, message: minLength => `Twoje przedstawienie się jest za krótkie! Napisz co najmniej **${minLength} znaków**, aby inni mogli Cię lepiej poznać. ✍️` },
			},
		},
		{
			name: 'pet-reactions',
			enabled: true,
			channels: [channels.waszeZwierzaki],
			emojis: ['🐾', '❤️', '😍'],
			thread: {
				enabled: true,
				nameTemplate: author => `${author.username}: O zwierzaku`,
				autoArchiveDuration: 2 * 24 * 60,
				reason: author => `Zdjęcie zwierzaka użytkownika ${author.globalName} (${author.id}).`,
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
			name: 'desktop-reactions',
			enabled: true,
			channels: [channels.pokazPulpit],
			emojis: ['👍', '👎'],
			thread: { enabled: false },
			validation: {
				onlyImages: { message: 'Na tym kanale pokazujemy screenshoty naszych pulpitów! 💻📸' },
			},
		},
		{
			name: 'suggestion-reactions',
			enabled: true,
			channels: [channels.propozycje],
			emojis: ['👍', '💭', '👎'],
			thread: {
				enabled: true,
				nameTemplate: author => `${author.username}: Dyskusja`,
				autoArchiveDuration: 3 * 24 * 60,
				reason: author => `Propozycja użytkownika ${author.globalName} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setDescription('Tutaj możesz przedyskutować tę propozycję!\nPamiętaj o konstruktywnej krytyce i szacunku dla innych opinii.'),
					],
				},
			},
			validation: {},
		},
		{
			name: 'dating-reactions',
			enabled: true,
			channels: [channels.dating],
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
			validation: {},
		},
		{
			name: 'meme-reactions',
			enabled: true,
			channels: [channels.memy],
			emojis: ['👍', '👎'],
			thread: { enabled: false },
			validation: {},
		},
	],

	verification: {
		enabled: true,
		unverifiedRoleId: roles.unverified,
		verifiedRoleId: roles.verified,
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
					.setColor('#1ABC9C')
					.setAuthor({ name: '🔐 Wymagana weryfikacja na serwerze', iconURL: client.user.displayAvatarURL() })
					.setDescription(`Witamy na **${guild.name}**!\n\nAby uzyskać dostęp do wszystkich kanałów na tym serwerze, pomyślnie ukończ proces weryfikacji, klikając przycisk poniżej.`)
					.addFields([
						{ name: '🛡️ Dlaczego warto się zweryfikować?', value: 'Weryfikacja pomaga chronić nasz serwer przed botami oraz innymi szkodliwymi użytkownikami.', inline: false },
						{ name: '⚡ Szybki proces', value: 'Ukończ weryfikację hCaptcha w swojej przeglądarce oraz potwierdź swój wiek. To zajmie tylko kilka sekund!', inline: false },
						{ name: '🔒 Bezpiecznie i prywatnie', value: 'Uwierzytelnienie za pomocą konta Discord nie będzie wymagane. Twoje dane są chronione, a proces jest całkowicie bezpieczny.', inline: false },
					])
					.setThumbnail(guild.iconURL()),
			],
		}),
		button: {
			label: 'Zweryfikuj mnie',
			emoji: '🔎',
			style: 'Primary',
		},
		messages: {
			tokenMessage: {
				content: (guild, verificationUrl) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#1ABC9C')
							.setAuthor({ name: `🔐 Weryfikacja na ${guild.name}`, iconURL: guild.iconURL() })
							.setDescription(`[Kliknij tutaj, aby ukończyć weryfikację](${verificationUrl})\nLink wygaśnie za 24h, zachowaj go w tajemnicy.`),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#ff7746')
							.setAuthor({ name: `⚠️ Wymagana weryfikacja - ${guild.name}`, iconURL: guild.iconURL() })
							.setDescription(`Cześć ${member}! Twój link weryfikacyjny wygasł. Musisz zweryfikować swoje konto, aby uzyskać dostęp do wszystkich kanałów. W przeciwnym razie zostaniesz wyrzucony.`)
							.addFields([
								{ name: '🔗 Jak się zweryfikować?', value: 'Kliknij niebieski przycisk na serwerze, aby wygenerować nowy link weryfikacyjny.', inline: false },
								{ name: '⏰ Ważne', value: 'Jeśli nie zweryfikujesz się w ciągu około 4 dni od dołączenia, zostaniesz wyrzucony z serwera.', inline: false },
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
							.setDescription(`Cześć ${member}. Jesteś na **${guild.name}** od ponad 3 dni bez ukończenia weryfikacji. Masz **24 godziny** na zweryfikowanie swojego konta, w przeciwnym razie zostaniesz wyrzucony z serwera. Cały proces zajmie mniej niż minutę.`)
							.addFields([
								{ name: '🔗 Zweryfikuj się teraz', value: `Kliknij niebieski przycisk na serwerze. Znajdziesz go na kanale ${channels.verification}.`, inline: false },
								{ name: '❓ Potrzebujesz pomocy?', value: 'Skontaktuj się z administratorem serwera, jeśli masz problem z weryfikacją.', inline: false },
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