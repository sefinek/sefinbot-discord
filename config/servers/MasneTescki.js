const { EmbedBuilder } = require('discord.js');

module.exports = {
	id: '943910440520527873',
	environment: 'development',

	main: {
		botTrapChannelId: null,
		automodChannelId: '1188578816310906890',
	},

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
				time: '0 6 * * *',
				enabled: true,
				name: 'Dev Server・🌅',
				randomBanner: true,
				messageChannel: '1150787924351254539',
				message: '☀️ **DEV: Day mode activated** - Testing time-based modes!',
				rateLimits: {},
			},
			night: {
				time: '0 22 * * *',
				enabled: true,
				name: 'Dev Server・🌙',
				randomBanner: true,
				messageChannel: '1150787924351254539',
				message: '🌙 **DEV: Night mode activated** - Testing night features!',
				rateLimits: {},
			},
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