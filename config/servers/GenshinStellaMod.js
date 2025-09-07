const { EmbedBuilder } = require('discord.js');
const { version } = require('../../package.json');

const channels = {
	welcome: '1044714444393029722',
	botTrap: '1224420495710228540',

	announcementsPlus: '1065275114687570011',
	earlyAccessPlus: '1181323568794063110',

	support: '1056236234160214138',
	announcements: '1044714926104653844',
	changelogs: '1044715003783168030',

	verification: '1412574518177829024',

	automod: '1044721563628482560',
};

const roles = {
	verified: '1411972451163963412',
	unverified: '1411972733578903592',
};

module.exports = {
	id: '1044713077125435492',
	dev: false,

	autoModChannel: channels.automod,

	channels,
	roles,

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1044714427263500288',
			name: (count, arrow) => `👥・Members: ${count} ${arrow}`,
		},
		online: {
			enabled: true,
			channelId: '1056239296367034509',
			name: count => `🌍・Online: ${count}`,
		},
		newest: {
			enabled: true,
			channelId: '1044714728674557992',
			name: user => `🆕・New: ${user}`,
		},
	},

	events: {
		welcome: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#19ff76')
						.setAuthor({ name: `👋 ${member.user.globalName} has joined the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Welcome ${member} to our server! We hope our project grabs your interest and gets you hyped to dive into Genshin Impact. Have fun! You are our ${memberCount}th member.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#25acff')
						.setAuthor({ name: `😥 ${member.user.globalName} has left the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Unfortunately, ${member} has left our server. We now have **${memberCount} members**. We hope to see you back soon!`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.welcome,
			content: (client, guild, user, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#ff4e3d')
						.setAuthor({ name: `⚠️ ${user.globalName} has been banned from the server`, iconURL: guild.iconURL() })
						.setDescription(`The user ${user} has been permanently banned from our server due to rule violations. We now have **${memberCount} members**. We hope the community continues to be a safe and welcoming place for everyone. Goodbye.`)
						.setThumbnail(user.displayAvatarURL()),
				],
			}),
		},
		directMessages: {
			welcome: {
				enabled: true,
				content: (client, member) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#3c94ff')
							.setAuthor({ name: `Welcome ${member.user.username} to our server ${member.guild.name}`, iconURL: member.guild.iconURL() })
							.addFields([
								{
									name: '😻 » What does Genshin Stella Mod offer?',
									value: '1. **Enhanced graphics:** Enjoy improved visuals with shaders for a superior gaming experience.\n2. **FPS unlock:** Remove the 60 FPS cap for smoother gameplay, especially on monitors with refresh rates above 60Hz.\n3. **3DMigoto support:** Unlocks a wider range of mods, including character model swaps, all in a safe and stable environment.',
								},
								{
									name: '🐱 » Why should I use Genshin Stella Mod?',
									value: '1. **Own launcher:** Simply click `Start game` in our app to jump right into action with exclusive enhancements!\n2. **Regular updates:** Our software is continuously updated for compatibility with new game versions, shader improvements, security patches, and more.\n3. **Safety guaranteed:** The application is completely safe and ensures security when injecting processes into the game. However, please remember not to cheat!',
								},
								{
									name: '😽 » What benefits will I get by supporting this project?',
									value: '1. **Access to 3DMigoto:** Enjoy the benefits of using ReShade, FPS Unlock, and 3DMigoto together for a more immersive gaming experience.\n2. A curated collection of optimized, **bug-free mods**.\n3. **A shader pack with the latest versions**, all free of bugs. With Stella Plus, **shaders will no longer overlap with the game\'s UI**, offering a cleaner, more polished visual experience.\n4. **Enhanced security:** The mod is designed with safety in mind, ensuring privacy protection and a robust security system.\n5. **And much more!** Discover all the benefits on the [**official website**](https://sefinek.net/genshin-stella-mod/subscription). Choose the tier that suits you best (we recommend the "🌍 Safety Kitten" tier).',
								},
								{
									name: '🙀 » We hope to see you in the Stella Mod Launcher!',
									value: `If you have any questions, feel free to message <@${process.env.OWNER}> or visit the <#${channels.support}> channel.\n\n>> [\`Click here to download now!\`](https://sefinek.net/genshin-stella-mod) <<`,
								},
							]),
						new EmbedBuilder()
							.setColor('#15070C')
							.setImage(`https://cdn.sefinek.net/discord/sefibot/images/guildMemberAdd.png?version=${version}`)
							.setFooter({ text: 'Copyright 2024-2025 © by Sefinek. All Rights Reserved.', iconURL: member.guild.iconURL() }),
					],
				}),
			},
		},
	},

	reactions: [
		{
			name: 'check-mark-button',
			enabled: true,
			channels: [
				channels.announcementsPlus,
				channels.earlyAccessPlus,
				channels.announcements,
				channels.changelogs,
			],
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
			tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
			tokenCooldown: 5 * 60 * 1000, // 5 minutes cooldown between token requests
			reminderInterval: 6 * 60 * 60 * 1000, // 6 hours between reminders
			kickWarningAfter: 3 * 24 * 60 * 60 * 1000, // 3 days before kick warning
			kickAfter: 4 * 24 * 60 * 60 * 1000, // 4 days before actual kick
		},
		content: (client, guild) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#2EE47A')
					.setAuthor({ name: '🔐 Genshin Stella Mod Verification', iconURL: guild.iconURL() })
					.setDescription(`Welcome to **${guild.name}**!\n\nTo gain access to all channels on this server, please complete the verification process successfully by clicking the button below.`)
					.addFields([
						{ name: '🛡️ Why Verify?', value: 'Verification helps protect our server from bots and other harmful users.', inline: false },
						{ name: '⚡ Quick Process', value: 'Complete hCaptcha verification in your browser and confirm your age. It only takes a few seconds!', inline: false },
						{ name: '🔒 Secure & Private', value: 'Authentication via your Discord account will not be required. Your data is protected, and the process is completely secure.', inline: false },
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
							.setAuthor({ name: `🔐 Verification on ${guild.name}`, iconURL: guild.iconURL() })
							.setDescription(`[Click here to complete the verification](${verificationUrl}) (this link will expire in 24h, keep it private)`),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#ff7746')
							.setAuthor({ name: `⚠️ Verification Required - ${guild.name}`, iconURL: guild.iconURL() })
							.setDescription(`Hi ${member}! Your verification link has expired. You need to verify your account to gain access to all channels. Otherwise, you will be kicked.`)
							.addFields([
								{ name: '🔗 How to verify?', value: 'Click the blue button on the server to generate a new verification link.', inline: false },
								{ name: '⏰ Important', value: 'If you don\'t verify within about 4 days of joining, you will be kicked from the server.', inline: false },
							]),
					],
				}),
			},
			kickWarning: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#ff4f3d')
							.setAuthor({ name: `Final Warning - ${guild.name}`, iconURL: guild.iconURL() })
							.setDescription(`Hello ${member}. You have been on **${guild.name}** for over 3 days without completing verification. You have **24 hours** to verify your account, otherwise you will be kicked from the server. The whole process takes less than a minute.`)
							.addFields([
								{ name: '🔗 Verify Now', value: `Click the blue button on the server. You can find it in the ${channels.verification} channel.`, inline: false },
								{ name: '❓ Need Help?', value: 'Contact the server administrator if you are having trouble with verification.', inline: false },
							]),
					],
				}),
			},
			kickMessage: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#ff331a')
							.setAuthor({ name: `👋 You have been kicked from ${guild.name}`, iconURL: guild.iconURL() })
							.setDescription('You were removed from the server because you did not complete verification within the required 4-day period.')
							.addFields([
								{ name: '🔄 Want to rejoin?', value: 'You can rejoin the server at any time, but you must complete verification within 4 days.', inline: false },
								{ name: '❓ Questions?', value: 'Contact the server administrator if you have any questions.', inline: false },
							]),
					],
				}),
			},
			success: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#00d26a')
							.setAuthor({ name: '✅ Verification Completed Successfully', iconURL: guild.iconURL() })
							.setDescription(`Welcome to **${guild.name}**! Your account has been verified. Thank you for joining!`),
					],
				}),
			},
		},
	},


	features: {
		isDatingServer: false,
		cleverBot: false,
		botTrap: channels.botTrap,
	},
};