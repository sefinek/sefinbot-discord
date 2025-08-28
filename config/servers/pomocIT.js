const { EmbedBuilder } = require('discord.js');

module.exports = {
	id: '1002327795344621669',

	main: {
		botTrapChannelId: null,
		automodChannelId: '1002371687746109490',
	},

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1328449218528022610',
			name: '👥・{count} {arrow}ludu',
		},
		online: {
			enabled: true,
			channelId: '1328449298698076222',
			name: '🌍・Online: {count}',
		},
		newest: {
			enabled: true,
			channelId: '1328452652836716629',
			name: '👋・{user}',
		},
	},

	events: {
		welcome: {
			channelId: '1002327796468699218',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#00D26A')
						.setAuthor({
							name: `👋 Użytkownik ${member.user.tag} dołączył do nas`,
							iconURL: member.user.displayAvatarURL(),
						})
						.setDescription(`Witaj ${member} na naszym serwerze! Mamy wielką nadzieje, że zostaniesz u nas na dłuższy czas. Miłego pobytu.\nJesteś naszym **${memberCount}. gościem**. Dziękujemy Ci za dołączenie!`)
						.setThumbnail(member.user.displayAvatarURL())
						.setTimestamp(),
				],
			}),
		},
		farewell: {
			channelId: '1002327796468699218',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF6B6B')
						.setAuthor({
							name: `😥 Użytkownik ${member.user.tag} opuścił serwer`,
							iconURL: member.user.displayAvatarURL(),
						})
						.setDescription(`Niestety osoba ${member} wyszła z naszego serwera.\nMamy nadzieję, że jeszcze wrócisz do nas. Wierzymy w Ciebie.\nPo stracie tego członka mamy w sumie **${memberCount} osób**.`)
						.setThumbnail(member.user.displayAvatarURL())
						.setTimestamp(),
				],
			}),
		},
		ban: {
			channelId: '1002327796468699218',
			content: (user, guild, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF4757')
						.setAuthor({
							name: `⚠️ Użytkownik ${user.tag} otrzymał bana`,
							iconURL: user.displayAvatarURL(),
						})
						.setDescription(`Osoba z nickiem <@${user.id}> została zbanowana na naszym serwerze przez jednego z administratorów. Cóż, bywa...\nPo stracie tego osobnika mamy w sumie **${memberCount} ludzi**.`)
						.setThumbnail(user.displayAvatarURL())
						.setTimestamp(),
				],
			}),
		},
	},

	directMessages: {
		welcome: {
			enabled: true,
			content: member => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#0078FF')
						.setAuthor({
							name: `Witaj ${member.user.tag} na naszym serwerze ${member.guild.name}`,
							iconURL: member.guild.iconURL() || undefined,
						})
						.setDescription('Dziękujemy za dołączenie do naszego serwera! Miłego pobytu.')
						.setThumbnail(member.user.displayAvatarURL())
						.setTimestamp(),
					new EmbedBuilder()
						.setColor('#15070C')
						.setFooter({
							text: 'Copyright 2024-2025 © by Sefinek. All Rights Reserved.',
							iconURL: member.guild.iconURL() || undefined,
						}),
				],
			}),
		},
	},

	reactions: {
		approve: {
			channels: [
				'1002327796468699220',
				'1002327796468699226',
			],
			emoji: '✅',
		},
	},

	features: {
		isDatingServer: false,
		cleverBot: false,
		timeBasedModes: false,
		techSupport: true,
	},
};