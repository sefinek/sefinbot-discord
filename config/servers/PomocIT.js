const { EmbedBuilder } = require('discord.js');

const channels = {
	welcome: '1002327796468699218',
	ogloszenia: '1002327796468699220',
	podziekowania: '1002327796468699226',

	verification: '1002367340408733836',

	automod: '1002371687746109490',
};

const roles = {
	verified: '1002329878592499722',
	unverified: '1412492205704220692',
};

module.exports = {
	id: '1002327795344621669',
	dev: false,

	autoModChannel: channels.automod,

	channels,
	roles,

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1328449218528022610',
			name: (count, arrow) => `👥・${count} ludu ${arrow}`,
		},
		online: {
			enabled: true,
			channelId: '1328449298698076222',
			name: count => `🌍・Online: ${count}`,
		},
		newest: {
			enabled: true,
			channelId: '1328452652836716629',
			name: user => `👋・${user}`,
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
						.setDescription(`Witaj ${member} na naszym serwerze! Mamy wielką nadzieje, że zostaniesz u nas na dłuższy czas. Miłego pobytu.\nJesteś naszym **${memberCount}. gościem**. Dziękujemy Ci za dołączenie!`)
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
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#ff4f62')
						.setAuthor({ name: `⚠️ ${member.globalName} otrzymał bana`, iconURL: member.guild.iconURL() })
						.setDescription(`${member} został zbanowany na naszym serwerze przez jednego z administratorów. Cóż, bywa...\nPo stracie tego osobnika mamy w sumie **${memberCount} ludzi**.`)
						.setThumbnail(member.displayAvatarURL()),
				],
			}),
		},
		directMessages: {
			welcome: { enabled: false },
		},
	},

	reactions: [
		{
			name: 'check-mark-button',
			enabled: true,
			channels: [channels.ogloszenia, channels.podziekowania],
			emojis: ['✅'],
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
					.setColor('#00D26A')
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
							.setDescription(`[Kliknij tutaj, aby ukończyć weryfikację](${verificationUrl}) (link wygaśnie za 24h, zachowaj go w tajemnicy)`),
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
		isDatingServer: false,
		cleverBot: false,
		botTrap: null,
	},
};