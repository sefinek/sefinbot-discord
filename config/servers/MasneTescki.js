const { EmbedBuilder } = require('discord.js');

module.exports = {
	id: '943910440520527873',
	environment: 'development',

	botTrapChannelId: null,
	automodChannelId: '1188578816310906890',

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1296966242439266377',
			name: '👥・Members: {count} {arrow}',
		},
		online: {
			enabled: true,
			channelId: '1305027263997415485',
			name: '🌍・Online: ${count}',
		},
		newest: {
			enabled: true,
			channelId: '1305020387104395365',
			name: '🆕・New: {user}',
		},
	},

	events: {
		welcome: {
			channelId: '1150787924351254539',
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
			channelId: '1150787924351254539',
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
			channelId: '1150787924351254539',
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
			verificationSuccess: {
				enabled: true,
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#27ae60')
							.setTitle('✅ Dev: Verification Complete!')
							.setDescription(`Welcome to **${guild.name}** test server! Your account has been successfully verified.`)
							.addFields([
								{ name: '🧪 Test Environment', value: 'You now have access to all testing channels and development features!', inline: false },
								{ name: '🚀 Available Features', value: '• Dating system testing\n• CleverBot integration\n• Time-based modes\n• All premium features', inline: false },
							])
							.setFooter({ text: `${guild.name} • Development Environment • Welcome!`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
		},
	},

	cron: {
		enabled: true,
		timezone: 'Europe/Warsaw',
		minimumOnlineMembers: 0,
		banners: {
			day: ['cat-love-you.gif', 'happy-senko.gif'],
			afternoon: ['cat_and_fish.jpg'],
			night: ['cat_boat.jpg', 'sleepy-fox_1.gif'],
			papaj: 'papiezowa.gif',
		},
		schedules: {
			day: {
				enabled: true,
				time: '0 6 * * *',
				name: 'Dev Server・🌅',
				randomBanner: true,
				messageChannel: '1150787924351254539',
				message: '☀️ **DEV: Day mode activated** - Testing time-based modes!',
				rateLimits: {},
			},
			night: {
				enabled: true,
				time: '0 22 * * *',
				name: 'Dev Server・🌙',
				randomBanner: true,
				messageChannel: '1150787924351254539',
				message: '🌙 **DEV: Night mode activated** - Testing night features!',
				rateLimits: {},
			},
		},
	},

	verification: {
		enabled: true,
		unverifiedRoleId: '1411308251143733290',
		verifiedRoleId: '1411308185889017896',
		content: guild => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#FF69B4')
					.setTitle('🔧 DEV: Server Verification Required')
					.setDescription(`**Development Environment** 🚀\n\nWelcome to the **${guild.name}** test server!\n\nThis is a development environment for testing bot features. Please verify your account to access all testing channels and features.`)
					.addFields([
						{ name: '🧪 Testing Server', value: 'This is a development environment where we test new bot features before releasing them to production servers.', inline: false },
						{ name: '🚀 Quick Dev Verification', value: 'Complete hCaptcha verification - this process is the same as on production servers!', inline: false },
						{ name: '🔒 Secure Testing', value: 'Your verification data is protected and treated the same as production data.', inline: false },
						{ name: '⚡ What you can test', value: '• Dating features\n• Verification system\n• Time-based modes\n• CleverBot integration\n• All premium features', inline: false },
					])
					.setFooter({ text: `${guild.name} • Development Environment • Click below to verify`, iconURL: guild.iconURL() })
					.setThumbnail(guild.iconURL())
					.setTimestamp(),
			],
		}),
		button: {
			label: '🔧 Verify (Dev)',
			emoji: '✅',
			style: 'Primary',
		},
	},

	features: {
		isDatingServer: true,
		timeBasedModes: true,
		cleverBot: {
			enabled: true,
			channelId: '943910440990294021',
		},
	},
};