const { EmbedBuilder } = require('discord.js');

const channels = {
	welcome: '1328507335328661605',
	automod: '1328507486101045340',
	announcements: '1276628914697015337',
	changelog: '1276628998914576404',
};

const roles = {
	member: '1412778207945691197',
	unverified: '1412778261892567110',
};

module.exports = {
	id: '1242596950428094536',
	dev: false,

	autoModChannel: channels.automod,

	channels,
	roles,

	voiceChannels: {
		members: { enabled: false },
		online: { enabled: false },
		newest: { enabled: false },
	},

	events: {
		welcome: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#03528E')
						.setAuthor({ name: `👋 Member ${member.user.tag} has joined the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Welcome, ${member}, to our server!`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#ff9a17')
						.setAuthor({ name: `😥 Member ${member.user.tag} has left the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Unfortunately, the user with the name ${member} has left our server. We hope that you will come back to us soon.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.welcome,
			content: (client, guild, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#ff4332')
						.setAuthor({ name: `⚠️ User ${member.tag} has been banned from the server`, iconURL: member.guild.iconURL() })
						.setDescription(`The user with the name <@${member.id}> has been permanently banned from our server due to violations of our rules. We hope that the community remains safe and welcoming for all. Goodbye.`)
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
			name: 'thumbs-up',
			enabled: true,
			channels: [channels.announcements, channels.changelog],
			emojis: ['👍'],
			thread: { enabled: false },
			validation: {},
		},
	],

	verification: {
		enabled: true,
		unverifiedRoleId: roles.unverified,
		verifiedRoleId: roles.member,
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
					.setAuthor({ name: '🔐 Server Verification Required', iconURL: client.user.displayAvatarURL() })
					.setDescription(`Welcome to **${guild.name}**!\n\nTo gain access to all channels and features, please complete the verification process by clicking the button below.`)
					.addFields([
						{ name: '🛡️ Why verify?', value: 'Verification helps keep our server safe from bots and unauthorized access.', inline: false },
						{ name: '⚡ Quick Process', value: 'Complete hCaptcha verification in your browser - takes just a few seconds!', inline: false },
						{ name: '🔒 Secure & Private', value: 'Your data is protected and the process is completely secure.', inline: false },
					])
					.setThumbnail(guild.iconURL()),
			],
		}),
		button: {
			label: 'Verify me',
			emoji: '🔎',
			style: 'Primary',
		},
		messages: {
			tokenMessage: {
				content: (guild, verificationUrl) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#1ABC9C')
							.setAuthor({ name: '🔐 Server Verification', iconURL: guild.iconURL() })
							.setDescription(`To gain access to **${guild.name}**, please complete the verification process.`)
							.addFields([
								{ name: '🔗 Verification Link', value: `[Click here to verify](${verificationUrl}) (expires in 24h)`, inline: false },
							]),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#ff7746')
							.setAuthor({ name: `⚠️ Verification Required - ${guild.name}`, iconURL: guild.iconURL() })
							.setDescription(`Hello ${member.user.username}! Your verification link has expired. You need to verify your account to continue accessing the server.`)
							.addFields([
								{ name: '🔗 How to verify', value: 'Click the verification button in the server to get a new verification link.', inline: false },
								{ name: '⏰ Important', value: 'If you don\'t verify within 4 days of joining, you will be removed from the server.', inline: false },
							]),
					],
				}),
			},
			kickWarning: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#ff4f3d')
							.setAuthor({ name: '🚨 Final Warning - Account Removal', iconURL: guild.iconURL() })
							.setDescription(`**IMPORTANT NOTICE**\n\nHello ${member.user.username},\n\nYou have been on **${guild.name}** for over 3 days without completing verification. **You have 24 hours to verify your account or you will be removed from the server.**`)
							.addFields([
								{ name: '🔗 Verify NOW', value: 'Click the verification button in the server immediately to get your verification link.', inline: false },
								{ name: '⏰ Time Remaining', value: 'Less than 24 hours before automatic removal', inline: false },
								{ name: '❓ Need Help?', value: 'Contact server moderators if you\'re having trouble with verification.', inline: false },
							]),
					],
				}),
			},
			kickMessage: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#ff331a')
							.setAuthor({ name: `👋 Removed from ${guild.name}`, iconURL: guild.iconURL() })
							.setDescription(`Hello ${member.user.username},\n\nYou have been removed from **${guild.name}** because you did not complete verification within the required 4-day period.`)
							.addFields([
								{ name: '🔄 Want to rejoin?', value: 'You can rejoin server anytime, but you\'ll need to complete verification within 4 days.', inline: false },
								{ name: '❓ Questions?', value: 'Contact server moderators if you have any questions about this policy.', inline: false },
							]),
					],
				}),
			},
			success: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#00d26a')
							.setAuthor({ name: '✅ Verification Complete', iconURL: guild.iconURL() })
							.setDescription(`Welcome to **${guild.name}**! Your account has been successfully verified.`),
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