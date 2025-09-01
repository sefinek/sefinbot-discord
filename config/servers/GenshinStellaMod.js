const { EmbedBuilder } = require('discord.js');
const { version } = require('../../package.json');

const channels = {
	botTrap: '1224420495710228540',
	welcome: '1044714444393029722',

	announcementsPlus: '1065275114687570011',
	earlyAccessPlus: '1181323568794063110',

	support: '1056236234160214138',
	announcements: '1044714926104653844',
	changelogs: '1044715003783168030',

	automod: '1044721563628482560',
};

const roles = {
	verified: '1044720100000000000',
	unverified: '1044720000000000000',
};

module.exports = {
	id: '1044713077125435492',
	dev: false,

	botTrapChannelId: channels.botTrap,
	automodChannelId: channels.automod,

	channels,
	roles,

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1044714427263500288',
			name: (count, arrow) => `👥・Members: ${count} ${arrow || ''}`,
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
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#2EE47A')
						.setAuthor({ name: `👋 Member ${member.user.tag} has joined the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Welcome ${member} to our server! We hope our project grabs your interest and gets you hyped to dive into Genshin Impact. Have fun! You are our ${memberCount}th member.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.welcome,
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#29A6F9')
						.setAuthor({ name: `😥 Member ${member.user.tag} has left the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Unfortunately, the user ${member} has left our server. We hope you'll come back soon.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.welcome,
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#E13A2A')
						.setAuthor({ name: `⚠️ User ${member.tag} has been banned from the server`, iconURL: member.guild.iconURL() })
						.setDescription(`The user <@${member.id}> has been permanently banned from our server due to rule violations. We hope the community continues to be a safe and welcoming place for everyone. Goodbye.`)
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
							.setColor('#8E44AD')
							.setAuthor({ name: `Welcome ${member.user.tag} to our server ${member.guild.name}`, iconURL: member.guild.iconURL() })
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

	reactions: {
		likeDislike: {
			channels: [
				channels.announcementsPlus,
				channels.earlyAccessPlus,
				channels.announcements,
				channels.changelogs,
			],
			emojis: ['✅'],
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
					.setColor('#2EE47A')
					.setTitle('🔐 Genshin Stella Mod Verification Required')
					.setDescription(`Welcome to **${guild.name}**!\n\nTo gain access to all channels and features of our Genshin Impact modding community, please complete the verification process by clicking the button below.`)
					.addFields([
						{ name: '🛡️ Why verify?', value: 'Verification helps keep our modding community safe from bots and ensures quality discussions about Stella Mod.', inline: false },
						{ name: '⚡ Quick Process', value: 'Complete hCaptcha verification in your browser - takes just a few seconds!', inline: false },
						{ name: '🔒 Secure & Private', value: 'Your data is protected and the process is completely secure.', inline: false },
						{ name: '🎮 Stella Mod Access', value: 'After verification, you\'ll gain access to mod downloads, support channels, and the community.', inline: false },
					])
					.setFooter({ text: `${guild.name} • Click the button below to verify`, iconURL: guild.iconURL() })
					.setThumbnail(guild.iconURL())
					.setTimestamp(),
			],
		}),
		button: {
			label: 'Verify for Stella Mod',
			emoji: '⭐',
			style: 'Primary',
		},
		messages: {
			tokenMessage: {
				content: (guild, verificationUrl) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#2EE47A')
							.setTitle('🔐 Genshin Stella Mod Verification')
							.setDescription(`To gain access to **${guild.name}** and our Genshin Impact modding community, please complete the verification process.`)
							.addFields([
								{ name: '🔗 Verification Link', value: `[Click here to verify](${verificationUrl})`, inline: false },
								{ name: '⏰ Expires in', value: '24 hours', inline: true },
								{ name: '🛡️ Security', value: 'Complete hCaptcha challenge', inline: true },
							])
							.setFooter({ text: 'Keep this link private • Stella Mod verification', iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#FF6B35')
							.setTitle('⚠️ Verification Required - Stella Mod')
							.setDescription(`Hello ${member.user.username}!\n\nYour verification link for **${guild.name}** has expired. You need to verify your account to continue accessing our Genshin Impact modding community.`)
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
							.setTitle('👋 Removed from Stella Mod Server')
							.setDescription(`Hello ${member.user.username},\n\nYou have been removed from **${guild.name}** because you did not complete verification within the required 4-day period.`)
							.addFields([
								{ name: '🔄 Want to rejoin?', value: 'You can rejoin the Stella Mod server anytime, but you\'ll need to complete verification within 4 days.', inline: false },
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
							.setTitle('✅ Stella Mod Verification Complete!')
							.setDescription(`Welcome to **${guild.name}**! Your account has been successfully verified.`)
							.addFields([
								{ name: '🎉 Access Granted', value: 'You now have full access to all Stella Mod channels and downloads.', inline: false },
								{ name: '🎮 Get Started', value: 'Check out our mod downloads and join the community discussions!', inline: false },
								{ name: '📝 Server Rules', value: 'Please make sure to read the server rules and modding guidelines.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Welcome to the community!`, iconURL: guild.iconURL() })
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
		timeBasedModes: false,
		papajMode: false,
		cleverBot: { enabled: false },
	},
};