const { EmbedBuilder } = require('discord.js');

module.exports = {
	// Server ID: Sefinek
	id: '1305001399494377533',

	// Main Configuration
	main: {
		botTrapChannelId: null,
		automodChannelId: '1328500595908280421',
	},

	// Voice Channel Statistics
	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1328500744361480192',
			name: '👥・Members: {count} {arrow}',
		},
		online: {
			enabled: true,
			channelId: '1328500785176252439',
			name: '🌍・Online: {count}',
		},
		newest: {
			enabled: true,
			channelId: '1328500800086999080',
			name: '👋・New: {user}',
		},
	},

	// Event Logging
	events: {
		welcome: {
			channelId: '1328500677944803358',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#2ECC71')
						.setAuthor({
							name: `👋 Member ${member.user.tag} has joined the server`,
							iconURL: member.user.displayAvatarURL(),
						})
						.setDescription(`Welcome, ${member}, to our server!`)
						.setThumbnail(member.user.displayAvatarURL())
						.setTimestamp(),
				],
			}),
		},
		farewell: {
			channelId: '1328500677944803358',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#E74C3C')
						.setAuthor({
							name: `😥 Member ${member.user.tag} has left the server`,
							iconURL: member.user.displayAvatarURL(),
						})
						.setDescription(`Unfortunately, the user with the name ${member} has left our server. We hope that you will come back to us soon.`)
						.setThumbnail(member.user.displayAvatarURL())
						.setTimestamp(),
				],
			}),
		},
		ban: {
			channelId: '1328500677944803358',
			content: (user, guild, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#992D22')
						.setAuthor({
							name: `⚠️ User ${user.tag} has been banned from the server`,
							iconURL: user.displayAvatarURL(),
						})
						.setDescription(`The user with the name <@${user.id}> has been permanently banned from our server due to violations of our rules. We hope that the community remains safe and welcoming for all. Goodbye.`)
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
						.setColor('#3498DB')
						.setAuthor({
							name: `Welcome ${member.user.tag} on ${member.guild.name}!`,
							iconURL: member.guild.iconURL() || undefined,
						})
						.setDescription('Welcome to our server! We\'re glad to have you here.')
						.setThumbnail(member.user.displayAvatarURL())
						.setTimestamp(),
				],
			}),
		},
	},

	// Reaction System
	reactions: {
		approve: {
			channels: [
				'1305011381959004282',
				'1305011521855819847',
			],
			emoji: '✅',
		},
	},

	// Features
	features: {
		isDatingServer: false,
		cleverBot: false,
		timeBasedModes: false,
	},
};