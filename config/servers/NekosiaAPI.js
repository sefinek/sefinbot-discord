const { EmbedBuilder } = require('discord.js');

module.exports = {
	id: '1242596950428094536',

	botTrapChannelId: null,
	automodChannelId: '1328507486101045340',

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

	events: {
		welcome: {
			channelId: '1328507335328661605',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#1ABC9C')
						.setAuthor({ name: `👋 Member ${member.user.tag} has joined the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Welcome, ${member}, to our server!`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: '1328507335328661605',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#F39C12')
						.setAuthor({ name: `😥 Member ${member.user.tag} has left the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Unfortunately, the user with the name ${member} has left our server. We hope that you will come back to us soon.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: '1328507335328661605',
			content: (member, guild, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#E74C3C')
						.setAuthor({ name: `⚠️ User ${member.tag} has been banned from the server`, iconURL: member.guild.iconURL() })
						.setDescription(`The user with the name <@${member.id}> has been permanently banned from our server due to violations of our rules. We hope that the community remains safe and welcoming for all. Goodbye.`)
						.setThumbnail(member.displayAvatarURL()),
				],
			}),
		},
		directMessages: {
			welcome: {
				enabled: false,
			},
		},
	},

	reactions: {
		approve: {
			channels: [
				'1276628914697015337',
				'1276628998914576404',
			],
			emoji: '👍',
		},
	},

	// Features
	features: {
		isDatingServer: false,
		cleverBot: false,
		timeBasedModes: false,
		apiServer: true,
	},
};