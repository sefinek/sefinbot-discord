const { EmbedBuilder } = require('discord.js');

module.exports = {
	id: '1305001399494377533',

	botTrapChannelId: null,
	automodChannelId: '1328500595908280421',

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

	events: {
		welcome: {
			channelId: '1328500677944803358',
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
			channelId: '1328500677944803358',
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
			channelId: '1328500677944803358',
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
			verificationSuccess: {
				enabled: true,
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

	reactions: {
		approve: {
			channels: [
				'1305011381959004282',
				'1305011521855819847',
			],
			emoji: '✅',
		},
	},

	verification: {
		enabled: true,
		unverifiedRoleId: '1328500000000000000',
		verifiedRoleId: '1411308185889017896',
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
	},

	features: {
		isDatingServer: false,
		cleverBot: false,
		timeBasedModes: false,
	},
};