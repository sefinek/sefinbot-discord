const { Events } = require('discord.js');
const guilds = require('../config/guilds.js');

module.exports = {
	name: Events.GuildBanAdd,
	async execute(ban) {
		const { guild, user } = ban;
		if (user.bot) return;

		const serverCfg = guilds.getServerConfig(guild.id);
		if (!serverCfg) return console.warn(`EventB » Server config for ${guild.id} was not found`);

		const banNotificationChannel = guild.channels.cache.get(serverCfg.events?.ban?.channelId);
		if (banNotificationChannel && serverCfg.events?.ban?.content) {
			const memberCount = guild.members.cache.filter(m => !m.user.bot).size;

			try {
				const banContent = serverCfg.events.ban.content(user, guild, memberCount);
				await banNotificationChannel.send(banContent);
			} catch (err) {
				console.error(`EventB » Failed to send ban notification in channel ID ${serverCfg.events.ban.channelId}:`, err.message);
			}
		}

		if (serverCfg.voiceChannels?.members?.enabled && serverCfg.voiceChannels?.members?.channelId) {
			const memberCountChannel = guild.channels.cache.get(serverCfg.voiceChannels.members.channelId);
			if (memberCountChannel) {
				try {
					const memberCount = guild.members.cache.filter(m => !m.user.bot).size;
					const channelNameWithArrow = typeof serverCfg.voiceChannels.members.name === 'function'
						? serverCfg.voiceChannels.members.name(memberCount, '⬇')
						: serverCfg.voiceChannels.members.name;
					await memberCountChannel.setName(channelNameWithArrow);
					setTimeout(async () => {
						try {
							const currentCount = guild.members.cache.filter(m => !m.user.bot).size;
							const channelNameNoArrow = typeof serverCfg.voiceChannels.members.name === 'function'
								? serverCfg.voiceChannels.members.name(currentCount, '')
								: serverCfg.voiceChannels.members.name;
							await memberCountChannel.setName(channelNameNoArrow);
						} catch (err) {
							console.warn('EventB » Failed to reset member count channel name:', err.message);
						}
					}, 30000);
				} catch (err) {
					console.warn(`EventB » Failed to update member count for guild ID ${guild.id}:`, err.message);
				}
			}
		}

		console.log(`EventB » User ${user.tag} (${user.id}) has been banned from the server "${guild.name}"`);
	},
};