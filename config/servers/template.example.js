const { EmbedBuilder } = require('discord.js');

// Server configuration template
const channels = {
	welcome: 'CHANNEL_ID_HERE',
	general: 'CHANNEL_ID_HERE',
	lobby: 'CHANNEL_ID_HERE',
	automod: 'CHANNEL_ID_HERE',
	botTrap: 'CHANNEL_ID_HERE',
	support1: 'CHANNEL_ID_HERE',
	support2: 'CHANNEL_ID_HERE',
	announcements: 'CHANNEL_ID_HERE',
	changelogs: 'CHANNEL_ID_HERE',
	photoChannel: 'CHANNEL_ID_HERE',
	pokazRyjek: 'CHANNEL_ID_HERE',
	introductions: 'CHANNEL_ID_HERE',
};

const roles = {
	verified: 'ROLE_ID_HERE',
	unverified: 'ROLE_ID_HERE',
	member: 'ROLE_ID_HERE',
};

module.exports = {
	id: 'YOUR_DISCORD_SERVER_ID_HERE', // Required: Discord server ID
	dev: true, // Set to false for production
	autoModChannel: channels.automod,
	channels,
	roles,

	voiceChannels: {
		members: {
			enabled: true,
			channelId: 'VOICE_CHANNEL_ID_HERE',
			name: (count, arrow) => `👥・Members: ${count} ${arrow}`,
		},
		online: {
			enabled: true,
			channelId: 'VOICE_CHANNEL_ID_HERE',
			name: count => `🌍・Online: ${count}`,
		},
		newest: {
			enabled: true,
			channelId: 'VOICE_CHANNEL_ID_HERE',
			name: user => `🆕・New: ${user}`,
		},
	},

	events: {
		welcome: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#00D26A')
						.setAuthor({ name: `👋 Member ${member.user.tag} has joined the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Welcome ${member} to our server! You are our ${memberCount}th member.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF6B6B')
						.setAuthor({ name: `😥 Member ${member.user.tag} has left the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Unfortunately, ${member} has left our server. We hope you'll come back soon.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#E74C3C')
						.setAuthor({ name: `⚠️ User ${member.tag} has been banned from the server`, iconURL: member.guild.iconURL() })
						.setDescription(`The user <@${member.id}> has been permanently banned from our server due to rule violations.`)
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
							.setColor('#8E44AD')
							.setAuthor({ name: `Welcome ${member.user.tag} to ${member.guild.name}`, iconURL: member.guild.iconURL() })
							.setDescription('Thank you for joining our server! We hope you have a great time here.')
							.setThumbnail(member.user.displayAvatarURL()),
					],
				}),
			},
		},
	},

	reactions: [
		{
			name: 'photo-reactions',
			enabled: true,
			channels: [channels.photoChannel],
			emojis: ['😍', '😐', '🤢'],
			thread: {
				enabled: true,
				nameTemplate: author => `${author.globalName || author.username}: Photo Comments`,
				autoArchiveDuration: 24 * 60, // 24 hours in minutes
				reason: author => `Photo shared by ${author.tag}`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setDescription('Share your thoughts about this photo! 📸✨'),
					],
				},
			},
			validation: {
				onlyImages: { message: 'This channel is for photos only! 📸' },
			},
		},
		{
			name: 'introductions',
			enabled: false,
			channels: [channels.introductions],
			emojis: ['❤️', '👋'],
			thread: {
				enabled: true,
				nameTemplate: author => `Welcome ${author.username}!`,
				autoArchiveDuration: 72 * 60, // 3 days
				reason: author => `Introduction thread for ${author.tag}`,
				startMessage: {
					embeds: [
						new EmbedBuilder()
							.setDescription('Welcome to our community! Others can comment here.'),
					],
				},
			},
			validation: {
				textLength: {
					min: 50,
					message: minLength => `Please write at least ${minLength} characters so we can get to know you better! ✍️`,
				},
			},
		},
		{
			name: 'voting-reactions',
			enabled: false, // Enable as needed
			channels: [channels.announcements],
			emojis: ['👍', '👎'],
			thread: { enabled: false },
			validation: {},
		},
		{
			name: 'admin-approval',
			enabled: false, // Enable for support channels
			channels: [channels.support1, channels.support2],
			emojis: ['✅'],
			thread: { enabled: false },
			validation: {},
		},
	],

	verification: {
		enabled: true,
		unverifiedRoleId: roles.unverified,
		verifiedRoleId: roles.verified,
		timeouts: {
			tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
			tokenCooldown: 5 * 60 * 1000, // 5 minutes
			reminderInterval: 6 * 60 * 60 * 1000, // 6 hours
			kickWarningAfter: 3 * 24 * 60 * 60 * 1000, // 3 days
			kickAfter: 4 * 24 * 60 * 60 * 1000, // 4 days
		},
		content: guild => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#2EE47A')
					.setTitle('🔐 Server Verification Required')
					.setDescription(`Welcome to **${guild.name}**!\\n\\nTo gain access to all channels and features, please complete the verification process by clicking the button below.`)
					.addFields([
						{ name: '🛡️ Why verify?', value: 'Verification helps keep our community safe from bots and spam.', inline: false },
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
							.setColor('#2EE47A')
							.setTitle('🔐 Account Verification')
							.setDescription(`To gain access to **${guild.name}**, please complete the verification process.`)
							.addFields([
								{ name: '🔗 Verification Link', value: `[Click here to verify](${verificationUrl})`, inline: false },
								{ name: '⏰ Expires in', value: '24 hours', inline: true },
								{ name: '🛡️ Security', value: 'Complete hCaptcha challenge', inline: true },
							])
							.setFooter({ text: 'Keep this link private • Verification required', iconURL: guild.iconURL() })
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
							.setDescription(`Hello ${member.user.username}!\\n\\nYour verification link for **${guild.name}** has expired. You need to verify your account to continue accessing the server.`)
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
							.setDescription(`**IMPORTANT NOTICE**\\n\\nHello ${member.user.username},\\n\\nYou have been on **${guild.name}** for over 3 days without completing verification. **You have 24 hours to verify your account or you will be removed from the server.**`)
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
							.setDescription(`Hello ${member.user.username},\\n\\nYou have been removed from **${guild.name}** because you did not complete verification within the required 4-day period.`)
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
							.setFooter({ text: `${guild.name} • Welcome to the community!`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
		},
	},

	cron: {
		enabled: true,
		timezone: 'Europe/Warsaw',
		minimumOnlineMembers: 10,
		schedules: {
			day: {
				enabled: true,
				time: '0 8 * * *',
				name: 'Server Name・😊',
				banners: ['day-banner.jpg'],
				messageChannel: channels.general,
				message: 'Good morning! Have a wonderful day! ☀️',
				rateLimits: {
					[channels.general]: 0,
				},
			},
			night: {
				enabled: true,
				time: '0 22 * * *',
				name: 'Server Name・😴',
				banners: ['night-banner.jpg'],
				messageChannel: channels.general,
				message: 'Good night! Sweet dreams! 🌙',
				rateLimits: {
					[channels.general]: 30,
				},
			},
		},
	},

	features: {
		isDatingServer: false,
		cleverBot: channels.general,
		botTrap: channels.botTrap,
	},
};