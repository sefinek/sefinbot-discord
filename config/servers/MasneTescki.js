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
			channelId: channels.generaly,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF69B4')
						.setAuthor({ name: `🎉 ${member.user.tag} dołączył do testów!`, iconURL: member.guild.iconURL() })
						.setDescription(`Witaj na serwerze testowym ${member}! To jest środowisko deweloperskie dla testowania funkcji bota. Jesteś **${memberCount} testerem**! 🚀`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.generaly,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FFA500')
						.setAuthor({ name: `👋 ${member.user.tag} opuścił testy`, iconURL: member.guild.iconURL() })
						.setDescription(`Użytkownik ${member} opuścił serwer deweloperski. Dziękujemy za pomoc w testowaniu! Zostało **${memberCount} testerów**. 🧪`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.generaly,
			content: (client, guild, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#DC143C')
						.setAuthor({ name: `⚠️ ${member.tag} został zbanowany`, iconURL: member.guild.iconURL() })
						.setDescription(`Użytkownik <@${member.id}> został zbanowany na serwerze testowym. Zostało **${memberCount} osób**.`)
						.addFields([{ name: '🔧 Debug Info', value: `User ID: ${member.id}\nGuild: ${guild.name}` }])
						.setThumbnail(member.displayAvatarURL()),
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
							.setDescription('Jesteś na **serwerze deweloperskim** - tutaj testujemy nowe funkcje bota przed wdrożeniem na główne serwery.'),
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
				nameTemplate: author => `${author.globalName || author.username}: Komentarze`,
				autoArchiveDuration: 24 * 60, // 1 day
				reason: author => `Zdjęcie użytkownika ${author.tag} (${author.id}).`,
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
				nameTemplate: author => `${author.globalName || author.username}: Komentarze`,
				autoArchiveDuration: 24 * 60, // 1 day
				reason: author => `Przedstawienie się użytkownika ${author.tag} (${author.id}).`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setDescription('Tutaj możesz skomentować to przedstawienie się! Pamiętaj o przestrzeganiu regulaminu serwera.'),
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
				nameTemplate: author => `${author.globalName || author.username}: Dyskusja`,
				autoArchiveDuration: 3 * 24 * 60, // 3 days
				reason: author => `Propozycja użytkownika ${author.tag} (${author.id}).`,
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
					.setColor('#FF69B4')
					.setAuthor({ name: '🔧 Wymagana weryfikacja serwera', iconURL: client.user.displayAvatarURL() })
					.setDescription(`**Środowisko deweloperskie** 🚀\n\nWitaj na serwerze testowym **${guild.name}**!\n\nTo jest środowisko deweloperskie do testowania funkcji bota. Zweryfikuj swoje konto, aby uzyskać dostęp do wszystkich kanałów testowych i funkcji.`)
					.setThumbnail(guild.iconURL()),
			],
		}),
		button: {
			label: '🔧 Zweryfikuj',
			emoji: '✅',
			style: 'Primary',
		},
		messages: {
			tokenMessage: {
				content: (guild, verificationUrl) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#FF69B4')
							.setAuthor({ name: '🔧 Weryfikacja Discord', iconURL: guild.iconURL() })
							.setDescription(`**Środowisko deweloperskie** 🚀\n\nAby uzyskać dostęp do serwera testowego **${guild.name}**, ukończ proces weryfikacji.\n\n[Kliknij tutaj aby się zweryfikować](${verificationUrl})`),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#FF6B35')
							.setAuthor({ name: '⚠️ Verification Required', iconURL: guild.iconURL() })
							.setDescription(`Hello ${member.user.username}!\n\nYour verification link for the **${guild.name}** test server has expired. You need to verify your account to continue testing features.`)
							.addFields([
								{ name: '🔗 How to verify', value: 'Click the verification button in the server to get a new verification link.', inline: false },
								{ name: '🧪 Testing Environment', value: 'This is a development server where we test verification features.', inline: false },
								{ name: '⏰ Important', value: 'If you don\'t verify within 4 days, you will be removed (testing auto-kick feature).', inline: false },
							]),
					],
				}),
			},
			kickWarning: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#E74C3C')
							.setAuthor({ name: '🚨 Final Warning - Account Removal', iconURL: guild.iconURL() })
							.setDescription(`**DEVELOPMENT TEST NOTICE**\n\nHello ${member.user.username},\n\nYou have been on the **${guild.name}** test server for over 3 days without completing verification. **You have 24 hours to verify or you will be removed (testing auto-kick feature).**`)
							.addFields([
								{ name: '🔗 Verify NOW', value: 'Click the verification button in the test server immediately to get your verification link.', inline: false },
								{ name: '⏰ Time Remaining', value: 'Less than 24 hours before automatic removal (testing feature)', inline: false },
								{ name: '🧪 Development Note', value: 'This is a test of the automated warning system used on production servers.', inline: false },
							]),
					],
				}),
			},
			kickMessage: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#992D22')
							.setAuthor({ name: '👋 Removed from Test Server', iconURL: guild.iconURL() })
							.setDescription(`Hello ${member.user.username},\n\nYou have been removed from the **${guild.name}** test server because you did not complete verification within the 4-day testing period.`)
							.addFields([
								{ name: '🔄 Want to test again?', value: 'You can rejoin the test server anytime, but you\'ll need to complete verification within 4 days.', inline: false },
								{ name: '🧪 Development Test', value: 'This was a test of the automated removal system used on production servers.', inline: false },
								{ name: '❓ Questions?', value: 'Contact the development team if you have questions about testing procedures.', inline: false },
							]),
					],
				}),
			},
			success: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#27ae60')
							.setAuthor({ name: '✅ Weryfikacja ukończona', iconURL: guild.iconURL() })
							.setDescription(`Witamy na serwerze testowym **${guild.name}**! Twoje konto zostało pomyślnie zweryfikowane.`),
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