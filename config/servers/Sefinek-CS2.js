const { EmbedBuilder } = require('discord.js');

const channels = {
	welcome: '1336492300939034714',
	ogloszenia: '1341100492930940971',

	automod: '1415885203838075040',
};

const roles = {
	verified: '1002329878592499722',
	unverified: '1412492205704220692',
};

module.exports = {
	id: '1336371829400408150',
	dev: false,

	autoModChannel: null,

	channels,
	roles,

	voiceChannels: {},

	events: {
		welcome: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#05ff81')
						.setAuthor({ name: `👋 ${member.user.globalName} dołączył do nas`, iconURL: member.guild.iconURL() })
						.setDescription(`Witaj ${member} na naszym kurwidołku! Mamy wielką nadzieje, że zostaniesz u nas na dłuższy czas. Miłego pobytu.\nJesteś naszym **${memberCount} gościem**.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#61d2ff')
						.setAuthor({ name: `😥 ${member.user.globalName} opuścił serwer`, iconURL: member.guild.iconURL() })
						.setDescription(`Niestety ${member} wyszedł z naszego kurwidołka.\nMamy nadzieję, że jeszcze wrócisz do nas. Wierzymy w Ciebie.\nPo stracie tej osoby mamy w sumie **${memberCount} ludu**.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.welcome,
			content: (client, guild, user, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#ff4f62')
						.setAuthor({ name: `⚠️ ${user.globalName} otrzymał bana`, iconURL: guild.iconURL() })
						.setDescription(`${user} został zbanowany na naszym kurwidołku xD.\nPo stracie tego podludzia mamy w sumie **${memberCount} osób**.`)
						.setThumbnail(user.displayAvatarURL()),
				],
			}),
		},
		directMessages: {
			welcome: { enabled: false },
		},
	},

	reactions: [
		{
			name: 'check-mark-button',
			enabled: true,
			channels: [channels.ogloszenia],
			emojis: ['✅'],
			thread: { enabled: false },
			validation: {},
		},
	],

	verification: { enabled: false },

	features: {
		isDatingServer: false,
		cleverBot: false,
		botTrap: null,
	},
};