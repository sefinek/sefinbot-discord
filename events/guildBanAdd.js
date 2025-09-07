const { Events } = require('discord.js');
const guilds = require('../config/guilds.js');

const ARROW_RESET_DELAY = 30000;

const getMemberCount = guild => guild.members.cache.filter(member => !member.user.bot).size;

const handleBanNotification = async (user, guild, serverCfg) => {
	if (!serverCfg.events?.ban?.channelId || !serverCfg.events?.ban?.content) return;

	const banNotificationChannel = guild.channels.cache.get(serverCfg.events.ban.channelId);
	if (!banNotificationChannel) {
		return console.warn(`EventB » Ban notification channel ${serverCfg.events.ban.channelId} not found in ${guild.name}`);
	}

	try {
		const memberCount = getMemberCount(guild);
		const banMessage = serverCfg.events.ban.content(guild.client, guild, user, memberCount);
		await banNotificationChannel.send(banMessage);
	} catch (err) {
		console.warn(`EventB » Failed to send ban notification in ${banNotificationChannel.name}: ${err.message}`);
	}
};

const handleMemberCountChannel = async (guild, serverCfg) => {
	if (!serverCfg.voiceChannels?.members?.enabled || !serverCfg.voiceChannels?.members?.channelId) return;

	const memberCountChannel = guild.channels.cache.get(serverCfg.voiceChannels.members.channelId);
	if (!memberCountChannel) return console.warn(`EventB » Member count channel ${serverCfg.voiceChannels.members.channelId} not found`);

	try {
		const memberCount = getMemberCount(guild);

		const nameWithArrow = typeof serverCfg.voiceChannels.members.name === 'function'
			? serverCfg.voiceChannels.members.name(memberCount, '⬇')
			: serverCfg.voiceChannels.members.name;
		await memberCountChannel.setName(nameWithArrow);

		setTimeout(async () => {
			try {
				const currentCount = getMemberCount(guild);
				const nameWithoutArrow = typeof serverCfg.voiceChannels.members.name === 'function'
					? serverCfg.voiceChannels.members.name(currentCount, '')
					: serverCfg.voiceChannels.members.name;
				await memberCountChannel.setName(nameWithoutArrow);
			} catch (err) {
				console.warn(`EventB » Failed to reset member count channel name: ${err.message}`);
			}
		}, ARROW_RESET_DELAY);
	} catch (err) {
		console.warn(`EventB » Failed to update member count channel: ${err.message}`);
	}
};

module.exports = {
	name: Events.GuildBanAdd,
	async execute(ban) {
		const { guild, user } = ban;

		// Skip bot users
		if (user.bot) return;

		// Get server configuration
		const serverCfg = guilds.getServerConfig(guild.id);
		if (!serverCfg) {
			if (guilds.shouldIgnoreGuild(guild.id)) return;
			return console.warn(`EventB » No server config found for guild ${guild.id}`);
		}

		// Execute all handlers concurrently for better performance
		const results = await Promise.allSettled([
			handleBanNotification(user, guild, serverCfg),
			handleMemberCountChannel(guild, serverCfg),
		]);

		// Log any handler failures
		results.forEach((result, index) => {
			if (result.status === 'rejected') {
				const handlerNames = ['banNotification', 'memberCount'];
				console.warn(`EventB » ${handlerNames[index]} handler failed for ${user.username}:`, result.reason);
			}
		});

		console.log(`EventB » User ${user.username} (${user.id}) banned from "${guild.name}"`);
	},
};