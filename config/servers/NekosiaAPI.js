const { EmbedBuilder } = require('discord.js');

const channels = {
	welcome: '1328507335328661605',
	announcements: '1276628914697015337',
	changelog: '1276628998914576404',

	verification: '1412778124487426068',

	automod: '1328507486101045340',
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
						.setAuthor({ name: `👋 ${member.user.globalName} has joined the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Welcome ${member}! You are member number **${memberCount}** on our server.`)
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
						.setColor('#ff4332')
						.setAuthor({ name: `⚠️ ${user.globalName} has been banned from the server`, iconURL: guild.iconURL() })
						.setDescription(`The user with the name ${user} has been permanently banned from our server due to violations of our rules. We hope that the community remains safe and welcoming for all. We now have **${memberCount} members**. Goodbye.`)
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
							.setColor('#37b1ff')
							.setAuthor({ name: `Welcome ${member.user.username} to ${member.guild.name}`, iconURL: member.user.displayAvatarURL() })
							.setDescription('If you are a Genshin Impact player and want to take your gameplay to the next level, visit [Genshin Stella Mod](https://stella.sefinek.net). Have a great day (or night)!'),
					],
				}),
			},
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
					.setAuthor({ name: '🔐 Wymagana weryfikacja na serwerze', iconURL: client.user.displayAvatarURL() })
					.setDescription(`Witamy na **${guild.name}**!\n\nAby uzyskać dostęp do wszystkich kanałów na tym serwerze, pomyślnie ukończ proces weryfikacji, klikając przycisk poniżej.`)
					.addFields([
						{ name: '🛡️ Dlaczego warto się zweryfikować?', value: 'Weryfikacja pomaga chronić nasz serwer przed botami oraz innymi szkodliwymi użytkownikami.', inline: false },
						{ name: '⚡ Szybki proces', value: 'Ukończ weryfikację hCaptcha w swojej przeglądarce oraz potwierdź swój wiek. To zajmie tylko kilka sekund!', inline: false },
						{ name: '🔒 Bezpiecznie i prywatnie', value: 'Uwierzytelnienie za pomocą konta Discord nie będzie wymagane. Twoje dane są chronione, a proces jest całkowicie bezpieczny.', inline: false },
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
		botTrap: null,
	},
};