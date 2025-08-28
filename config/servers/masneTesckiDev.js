const { EmbedBuilder } = require('discord.js');

module.exports = {
	// Server ID: Masne Teściki Botów™ (Development Environment)
	id: '943910440520527873',

	// Environment
	environment: 'development',

	// Main Configuration
	main: {
		botTrapChannelId: null,
		automodChannelId: '1188578816310906890',
	},

	// Voice Channel Statistics
	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1296966242439266377',
			name: '👥・Members: {count}',
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

	// Event Logging
	events: {
		welcome: {
			channelId: '1150787924351254539',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF69B4')
						.setAuthor({ name: `🎉 DEV: ${member.user.tag} dołączył do testów!`, iconURL: member.user.displayAvatarURL() })
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
						.setThumbnail(member.user.displayAvatarURL())
						.setTimestamp(),
				],
			}),
		},
		farewell: {
			channelId: '1150787924351254539',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FFA500')
						.setAuthor({ name: `👋 DEV: ${member.user.tag} opuścił testy`, iconURL: member.user.displayAvatarURL() })
						.setDescription(`Tester ${member} opuścił serwer deweloperski.\nDziękujemy za pomoc w testowaniu! 🧪\nZostało **${memberCount} testerów**.`)
						.setFooter({ text: 'Development Environment' })
						.setThumbnail(member.user.displayAvatarURL())
						.setTimestamp(),
				],
			}),
		},
		ban: {
			channelId: '1150787924351254539',
			content: (user, guild, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#DC143C')
						.setAuthor({ name: `⚠️ DEV: ${user.tag} został zbanowany`, iconURL: user.displayAvatarURL() })
						.setDescription(`Użytkownik <@${user.id}> został zbanowany na serwerze testowym.\nTest funkcji banowania zakończony pomyślnie ✅\nZostało **${memberCount} testerów**.`)
						.addFields([{
							name: '🔧 Debug Info',
							value: `User ID: ${user.id}\nGuild: ${guild.name}`,
						}])
						.setThumbnail(user.displayAvatarURL())
						.setTimestamp(),
				],
			}),
		},
	},

	// Direct Messages
	directMessages: {
		welcome: {
			enabled: true,
			content: (member) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#00FFFF')
						.setAuthor({ name: `🔧 Dev Mode: Witaj na ${member.guild.name}!`, iconURL: member.guild.iconURL() || undefined })
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
						.setFooter({ text: 'Development Environment | Test Server', iconURL: member.guild.iconURL() || undefined })
						.setTimestamp(),
				],
			}),
		},
	},

	// Additional Configuration
	additional: {
		cleverBot: {
			enabled: true,
			channelId: '943910440990294021',
		},
	},

	// Features
	features: {
		isDatingServer: true, // Dating features enabled for testing
		cleverBot: true,
		timeBasedModes: false,
		botTesting: true,
	},
};