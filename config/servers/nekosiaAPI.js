const { EmbedBuilder } = require('discord.js');

module.exports = {
	// Server ID: Nekosia API
	id: '1242596950428094536',

	// Main Configuration
	main: {
		botTrapChannelId: null,
		automodChannelId: '1328507486101045340',
	},

	// Voice Channel Statistics (all disabled)
	voiceChannels: {
		members: {
			enabled: false,
		},
		online: {
			enabled: false,
		},
		newest: {
			enabled: false,
		},
	},

	// Event Logging
	events: {
		welcome: {
			channelId: '1328507335328661605',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#1ABC9C')
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
			channelId: '1328507335328661605',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#F39C12')
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
			channelId: '1328507335328661605',
			content: (user, guild, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#E74C3C')
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

	// Direct Messages (disabled)
	directMessages: {
		welcome: {
			enabled: false,
		},
	},

	// Reaction System
	reactions: {
		approve: {
			channels: [
				'1276628914697015337',
				'1276628998914576404',
			],
			emoji: '👍', // Different from other servers (👍 instead of ✅)
		},
	},

	// Features
	features: {
		isDatingServer: false,
		cleverBot: false,
		timeBasedModes: false,
		apiServer: true, // Custom feature for API server
	},
};