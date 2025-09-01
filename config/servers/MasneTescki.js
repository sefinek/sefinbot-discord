const { EmbedBuilder } = require('discord.js');

const channels = {
	generaly: '943910440990294021',
	przedstawSie: '943910440990294022',
	pokazRyjek: '943910440990294023',
	waszeZwierzaki: '943910440990294024',
	pokazPulpit: '943910440990294025',
	propozycje: '943910441241944064',
	memy: '943910441241944065',
	cleverBot: '943910441241944066',
};

const roles = {
	verified: '1411972451163963412',
	unverified: '1411972733578903592',
};

module.exports = {
	id: '943910440520527873',
	dev: true,

	automodChannelId: '1188578816310906890',

	channels,
	roles,

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1296966242439266377',
			name: (count, arrow) => `👥・Members: ${count} ${arrow || ''}`,
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
			channelId: channels.generaly,
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF69B4')
						.setAuthor({ name: `🎉 DEV: ${member.user.tag} dołączył do testów!`, iconURL: member.guild.iconURL() })
						.setDescription(`Witaj na serwerze testowym ${member}! 🚀 To jest środowisko deweloperskie dla testowania funkcji bota.\nJesteś **${memberCount} testerem**!`)
						.addFields([
							{
								name: '🔧 Development Mode',
								value: 'Ta wiadomość pojawia się tylko w trybie deweloperskim.',
								inline: true,
							},
							{
								name: '🎯 Test Features',
								value: 'Możesz testować wszystkie funkcje randkowe!',
								inline: true,
							},
						])
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.generaly,
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FFA500')
						.setAuthor({ name: `👋 DEV: ${member.user.tag} opuścił testy`, iconURL: member.guild.iconURL() })
						.setDescription(`Tester ${member} opuścił serwer deweloperski.\nDziękujemy za pomoc w testowaniu! 🧪\nZostało **${memberCount} testerów**.`)
						.setFooter({ text: 'Development Environment' })
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.generaly,
			content: (member, guild, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#DC143C')
						.setAuthor({ name: `⚠️ DEV: ${member.tag} został zbanowany`, iconURL: member.guild.iconURL() })
						.setDescription(`Użytkownik <@${member.id}> został zbanowany na serwerze testowym.\nTest funkcji banowania zakończony pomyślnie ✅\nZostało **${memberCount} testerów**.`)
						.addFields([{ name: '🔧 Debug Info', value: `User ID: ${member.id}\nGuild: ${guild.name}` }])
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
							.setColor('#00FFFF')
							.setAuthor({ name: `🔧 Dev Mode: Witaj na ${member.guild.name}!`, iconURL: member.guild.iconURL() })
							.setDescription(`Hej ${member.user.tag}! 👋\n\nJesteś na **serwerze deweloperskim** - tutaj testujemy nowe funkcje bota przed wdrożeniem na główne serwery.`)
							.addFields([
								{
									name: '🚀 Co możesz tutaj testować?',
									value: '• Komendy randkowe\n• System Choroszczy\n• Dark web\n• Wszystkie funkcje dating serwera',
								},
								{
									name: '⚡ Development Features',
									value: 'Niektóre funkcje mogą być niestabilne - to normalne w środowisku testowym!',
								},
							])
							.setFooter({ text: 'Development Environment | Test Server', iconURL: member.guild.iconURL() }),
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
				message: '☀️ **DEV: Day mode activated** - Testing time-based modes!',
				rateLimits: {},
			},
			night: {
				enabled: true,
				time: '0 22 * * *',
				name: 'Dev Server・🌙',
				banners: ['cat_boat.jpg', 'sleepy-fox_1.gif'],
				messageChannel: channels.generaly,
				message: '🌙 **DEV: Night mode activated** - Testing night features!',
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
				nameTemplate: author => `${author.globalName || author.username}: Komentarze`,
				autoArchiveDuration: 24 * 60, // 1 day
				reason: author => `Zdjęcie użytkownika ${author.tag} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setColor('#FF69B4')
							.setDescription('Tutaj możesz skomentować to zdjęcie! 📸✨')
							.setFooter({ text: 'Komentarze do zdjęcia' })
							.setTimestamp(),
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
				nameTemplate: author => `${author.globalName || author.username}: Komentarze`,
				autoArchiveDuration: 24 * 60, // 1 day
				reason: author => `Przedstawienie się użytkownika ${author.tag} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setColor('#00D26A')
							.setDescription('Tutaj pozostali użytkownicy mogą skomentować niniejszą wiadomość.\nPamiętaj, że każdy członek serwera jest zobowiązany do przestrzegania wytycznych.')
							.setFooter({ text: 'Wątek do komentarzy' })
							.setTimestamp(),
					],
				},
			},
			validation: {
				textLength: { min: 20, message: minLength => `Twoje przedstawienie się jest za krótkie! Napisz co najmniej ${minLength} znaków, aby inni mogli Cię lepiej poznać. ✍️` },
			},
		},
		{
			name: 'pet-reactions',
			enabled: true,
			channels: [channels.waszeZwierzaki],
			emojis: ['🐾', '❤️', '😍'],
			thread: {
				enabled: true,
				nameTemplate: author => `${author.globalName || author.username}: O zwierzaku`,
				autoArchiveDuration: 24 * 60, // 1 day
				reason: author => `Zdjęcie zwierzaka użytkownika ${author.tag} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setColor('#8B4513')
							.setDescription('Jakie słodkie zwierzątko! 🐾 Opowiedz nam o nim więcej!')
							.setFooter({ text: 'O zwierzaku' })
							.setTimestamp(),
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
				nameTemplate: author => `${author.globalName || author.username}: Dyskusja`,
				autoArchiveDuration: 3 * 24 * 60, // 3 days
				reason: author => `Propozycja użytkownika ${author.tag} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setColor('#4A90E2')
							.setDescription('Tutaj możesz przedyskutować tę propozycję!\nPamiętaj o konstruktywnej krytyce i szacunku dla innych opinii.')
							.setFooter({ text: 'Dyskusja propozycji' })
							.setTimestamp(),
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
		content: guild => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#FF69B4')
					.setTitle('🔧 DEV: Wymagana weryfikacja serwera')
					.setDescription(`**Środowisko deweloperskie** 🚀\n\nWitaj na serwerze testowym **${guild.name}**!\n\nTo jest środowisko deweloperskie do testowania funkcji bota. Zweryfikuj swoje konto, aby uzyskać dostęp do wszystkich kanałów testowych i funkcji.`)
					.addFields([
						{ name: '🧪 Serwer testowy', value: 'To jest środowisko deweloperskie, gdzie testujemy nowe funkcje bota przed wydaniem na serwery produkcyjne.', inline: false },
						{ name: '🚀 Szybka weryfikacja deweloperska', value: 'Ukończ weryfikację hCaptcha - ten proces jest taki sam jak na serwerach produkcyjnych!', inline: false },
						{ name: '🔒 Bezpieczne testowanie', value: 'Twoje dane weryfikacyjne są chronione i traktowane tak samo jak dane produkcyjne.', inline: false },
						{ name: '⚡ Co możesz testować', value: '• Funkcje randkowe\n• System weryfikacji\n• Tryby czasowe\n• Integracja CleverBot\n• Wszystkie funkcje premium', inline: false },
					])
					.setFooter({ text: `${guild.name} • Środowisko deweloperskie • Kliknij poniżej aby się zweryfikować`, iconURL: guild.iconURL() })
					.setThumbnail(guild.iconURL())
					.setTimestamp(),
			],
		}),
		button: {
			label: '🔧 Zweryfikuj (Dev)',
			emoji: '✅',
			style: 'Primary',
		},
		messages: {
			tokenMessage: {
				content: (guild, verificationUrl) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#FF69B4')
							.setTitle('🔧 DEV: Weryfikacja Discord')
							.setDescription(`**Środowisko deweloperskie** 🚀\n\nAby uzyskać dostęp do serwera testowego **${guild.name}**, ukończ proces weryfikacji.`)
							.addFields([
								{ name: '🔗 Link weryfikacyjny', value: `[Kliknij tutaj aby się zweryfikować](${verificationUrl})`, inline: false },
								{ name: '⏰ Wygasa za', value: '24 godziny', inline: true },
								{ name: '🧪 Funkcja testowa', value: 'To testuje ten sam system weryfikacji używany na serwerach produkcyjnych', inline: true },
							])
							.setFooter({ text: 'Zachowaj ten link w tajemnicy • Test weryfikacji deweloperskiej', iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#FF6B35')
							.setTitle('⚠️ DEV: Verification Required')
							.setDescription(`Hello ${member.user.username}!\n\nYour verification link for the **${guild.name}** test server has expired. You need to verify your account to continue testing features.`)
							.addFields([
								{ name: '🔗 How to verify', value: 'Click the verification button in the server to get a new verification link.', inline: false },
								{ name: '🧪 Testing Environment', value: 'This is a development server where we test verification features.', inline: false },
								{ name: '⏰ Important', value: 'If you don\'t verify within 4 days, you will be removed (testing auto-kick feature).', inline: false },
							])
							.setFooter({ text: `${guild.name} • Development Environment • Verification Required`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			kickWarning: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#E74C3C')
							.setTitle('🚨 DEV: Final Warning - Account Removal')
							.setDescription(`**DEVELOPMENT TEST NOTICE**\n\nHello ${member.user.username},\n\nYou have been on the **${guild.name}** test server for over 3 days without completing verification. **You have 24 hours to verify or you will be removed (testing auto-kick feature).**`)
							.addFields([
								{ name: '🔗 Verify NOW', value: 'Click the verification button in the test server immediately to get your verification link.', inline: false },
								{ name: '⏰ Time Remaining', value: 'Less than 24 hours before automatic removal (testing feature)', inline: false },
								{ name: '🧪 Development Note', value: 'This is a test of the automated warning system used on production servers.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Development Environment • Final Warning`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			kickMessage: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#992D22')
							.setTitle('👋 DEV: Removed from Test Server')
							.setDescription(`Hello ${member.user.username},\n\nYou have been removed from the **${guild.name}** test server because you did not complete verification within the 4-day testing period.`)
							.addFields([
								{ name: '🔄 Want to test again?', value: 'You can rejoin the test server anytime, but you\'ll need to complete verification within 4 days.', inline: false },
								{ name: '🧪 Development Test', value: 'This was a test of the automated removal system used on production servers.', inline: false },
								{ name: '❓ Questions?', value: 'Contact the development team if you have questions about testing procedures.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Development Environment • Account Removed`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			success: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#27ae60')
							.setTitle('✅ Dev: Weryfikacja ukończona!')
							.setDescription(`Witaj na serwerze testowym **${guild.name}**! Twoje konto zostało pomyślnie zweryfikowane.`)
							.addFields([
								{ name: '🧪 Środowisko testowe', value: 'Masz teraz dostęp do wszystkich kanałów testowych i funkcji deweloperskich!', inline: false },
								{ name: '🚀 Dostępne funkcje', value: '• Testowanie systemu randkowego\n• Integracja CleverBot\n• Tryby czasowe\n• Wszystkie funkcje premium', inline: false },
							])
							.setFooter({ text: `${guild.name} • Środowisko deweloperskie • Witamy!`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
		},
	},

	features: {
		isDatingServer: true,
		timeBasedModes: true,
		cleverBot: channels.cleverBot,
		botTrap: null,
	},
};