const { EmbedBuilder } = require('discord.js');

const channels = {
	welcome: '1328500677944803358',
	automod: '1328500595908280421',
	approve1: '1305011381959004282',
	approve2: '1305011521855819847',
};

const roles = {
	verified: '1411308185889017896',
	unverified: '1328500000000000000',
};

module.exports = {
	id: '1305001399494377533',
	dev: false,

	automodChannelId: channels.automod,

	channels,
	roles,

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1328500744361480192',
			name: (count, arrow) => `👥・Members: ${count} ${arrow || ''}`,
		},
		online: {
			enabled: true,
			channelId: '1328500785176252439',
			name: count => `🌍・Online: ${count}`,
		},
		newest: {
			enabled: true,
			channelId: '1328500800086999080',
			name: user => `👋・New: ${user}`,
		},
	},

	events: {
		welcome: {
			channelId: channels.welcome,
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#2ECC71')
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
						.setColor('#E74C3C')
						.setAuthor({ name: `😥 Member ${member.user.tag} has left the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Unfortunately, the user with the name ${member} has left our server. We hope that you will come back to us soon.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.welcome,
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#992D22')
						.setAuthor({ name: `⚠️ User ${member.tag} has been banned from the server`, iconURL: member.guild.iconURL() })
						.setDescription(`The user with the name <@${member.id}> has been permanently banned from our server due to violations of our rules. We hope that the community remains safe and welcoming for all. Goodbye.`)
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
							.setColor('#3498DB')
							.setAuthor({ name: `Welcome ${member.user.tag} on ${member.guild.name}!`, iconURL: member.guild.iconURL() })
							.setDescription('Welcome to our server! We\'re glad to have you here.')
							.setThumbnail(member.user.displayAvatarURL()),
					],
				}),
			},
		},
	},

	reactions: {
		approve: {
			channels: [
				channels.approve1,
				channels.approve2,
			],
			emoji: '✅',
		},
	},

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
					.setColor('#3498DB')
					.setTitle('🔐 Server Verification Required')
					.setDescription(`Welcome to **${guild.name}**!\n\nTo gain access to all channels and features, please complete the verification process by clicking the button below.`)
					.addFields([
						{ name: '🛡️ Why verify?', value: 'Verification helps keep our community safe from bots and spam accounts.', inline: false },
						{ name: '⚡ Quick Process', value: 'Complete hCaptcha verification in your browser - takes just a few seconds!', inline: false },
						{ name: '🔒 Secure & Private', value: 'Your data is protected and the process is completely secure.', inline: false },
					])
					.setFooter({ text: `${guild.name} • Click the button below to verify`, iconURL: guild.iconURL() })
					.setThumbnail(guild.iconURL())
					.setTimestamp(),
			],
		}),
		button: {
			label: 'Verify Account',
			emoji: '✅',
			style: 'Primary',
		},
		messages: {
			tokenMessage: {
				content: (guild, verificationUrl) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#3498DB')
							.setTitle('🔐 Discord Server Verification')
							.setDescription(`To gain access to **${guild.name}**, please complete the verification process.`)
							.addFields([
								{ name: '🔗 Verification Link', value: `[Click here to verify](${verificationUrl})`, inline: false },
								{ name: '⏰ Expires in', value: '24 hours', inline: true },
								{ name: '🛡️ Security', value: 'Complete hCaptcha challenge', inline: true },
							])
							.setFooter({ text: 'Keep this link private • Verification required for server access', iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#FF6B35')
							.setTitle('⚠️ Verification Required')
							.setDescription(`Hello ${member.user.username}!\n\nYour verification link for **${guild.name}** has expired. You need to verify your account to continue accessing the server.`)
							.addFields([
								{ name: '🔗 How to verify', value: 'Click the verification button in the server to get a new verification link.', inline: false },
								{ name: '⏰ Important', value: 'If you don\'t verify within 4 days of joining, you will be removed from the server.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Verification Required`, iconURL: guild.iconURL() })
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
							.setTitle('👋 Removed from Server')
							.setDescription(`Hello ${member.user.username},\n\nYou have been removed from **${guild.name}** because you did not complete verification within the required 4-day period.`)
							.addFields([
								{ name: '🔄 Want to rejoin?', value: 'You can rejoin the server anytime, but you\'ll need to complete verification within 4 days.', inline: false },
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
							.setTitle('✅ Verification Complete!')
							.setDescription(`Welcome to **${guild.name}**! Your account has been successfully verified.`)
							.addFields([
								{ name: '🎉 Access Granted', value: 'You now have full access to all server channels and features.', inline: false },
								{ name: '📝 Server Rules', value: 'Please make sure to read the server rules and guidelines.', inline: false },
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

	features: {
		isDatingServer: false,
		cleverBot: null,
		timeBasedModes: false,
		botTrap: null,
	},
};