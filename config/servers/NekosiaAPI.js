const { EmbedBuilder } = require('discord.js');

const channels = {
	welcome: '1328507335328661605',
	automod: '1328507486101045340',
	api1: '1276628914697015337',
	api2: '1276628998914576404',
};

const roles = {
	verified: '1328507800000000000',
	unverified: '1328507700000000000',
};

module.exports = {
	id: '1242596950428094536',
	dev: false,

	automodChannelId: channels.automod,

	channels,
	roles,

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
			channelId: channels.welcome,
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
			channelId: channels.welcome,
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
			channelId: channels.welcome,
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

	reactions: [
		{
			name: 'api-approval',
			enabled: true,
			channels: [channels.api1, channels.api2],
			emojis: ['👍'],
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
					.setColor('#1ABC9C')
					.setTitle('🔐 API Server Verification Required')
					.setDescription(`Welcome to **${guild.name}**!\n\nTo gain access to all channels and features, please complete the verification process by clicking the button below.`)
					.addFields([
						{ name: '🛡️ Why verify?', value: 'Verification helps keep our API server safe from bots and unauthorized access.', inline: false },
						{ name: '⚡ Quick Process', value: 'Complete hCaptcha verification in your browser - takes just a few seconds!', inline: false },
						{ name: '🔒 Secure & Private', value: 'Your data is protected and the process is completely secure.', inline: false },
						{ name: '🔌 API Access', value: 'After verification, you\'ll gain access to API documentation and support channels.', inline: false },
					])
					.setFooter({ text: `${guild.name} • Click the button below to verify`, iconURL: guild.iconURL() })
					.setThumbnail(guild.iconURL())
					.setTimestamp(),
			],
		}),
		button: {
			label: 'Verify API Access',
			emoji: '🔐',
			style: 'Primary',
		},
		messages: {
			tokenMessage: {
				content: (guild, verificationUrl) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#1ABC9C')
							.setTitle('🔐 API Server Verification')
							.setDescription(`To gain access to **${guild.name}** API server, please complete the verification process.`)
							.addFields([
								{ name: '🔗 Verification Link', value: `[Click here to verify](${verificationUrl})`, inline: false },
								{ name: '⏰ Expires in', value: '24 hours', inline: true },
								{ name: '🛡️ Security', value: 'Complete hCaptcha challenge', inline: true },
							])
							.setFooter({ text: 'Keep this link private • API access verification', iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#FF6B35')
							.setTitle('⚠️ API Verification Required')
							.setDescription(`Hello ${member.user.username}!\n\nYour verification link for **${guild.name}** API server has expired. You need to verify your account to continue accessing the server.`)
							.addFields([
								{ name: '🔗 How to verify', value: 'Click the verification button in the server to get a new verification link.', inline: false },
								{ name: '⏰ Important', value: 'If you don\'t verify within 4 days of joining, you will be removed from the server.', inline: false },
							])
							.setFooter({ text: `${guild.name} • API Verification Required`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			kickWarning: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#E74C3C')
							.setTitle('🚨 Final Warning - Account Removal')
							.setDescription(`**IMPORTANT NOTICE**\n\nHello ${member.user.username},\n\nYou have been on **${guild.name}** for over 3 days without completing verification. **You have 24 hours to verify your account or you will be removed from the server.**`)
							.addFields([
								{ name: '🔗 Verify NOW', value: 'Click the verification button in the server immediately to get your verification link.', inline: false },
								{ name: '⏰ Time Remaining', value: 'Less than 24 hours before automatic removal', inline: false },
								{ name: '❓ Need Help?', value: 'Contact server moderators if you\'re having trouble with verification.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Final Warning`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			kickMessage: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#992D22')
							.setTitle('👋 Removed from API Server')
							.setDescription(`Hello ${member.user.username},\n\nYou have been removed from **${guild.name}** because you did not complete verification within the required 4-day period.`)
							.addFields([
								{ name: '🔄 Want to rejoin?', value: 'You can rejoin the API server anytime, but you\'ll need to complete verification within 4 days.', inline: false },
								{ name: '❓ Questions?', value: 'Contact server moderators if you have any questions about this policy.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Account Removed`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			success: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#27ae60')
							.setTitle('✅ API Verification Complete!')
							.setDescription(`Welcome to **${guild.name}**! Your account has been successfully verified.`)
							.addFields([
								{ name: '🎉 Access Granted', value: 'You now have full access to all API channels and documentation.', inline: false },
								{ name: '📝 API Guidelines', value: 'Please make sure to read the API usage guidelines and documentation.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Welcome!`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
		},
	},

	cron: {
		enabled: false,
		timezone: 'Europe/Warsaw',
		minimumOnlineMembers: 0,
		schedules: {},
	},

	// Features
	features: {
		isDatingServer: false,
		cleverBot: null,
		botTrap: null,
	},
};