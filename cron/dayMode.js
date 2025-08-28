const guilds = require('../config/guilds.js');
const banners = require('./scripts/getBanner.js');

module.exports = async client => {
	try {
		const milosnaGrotaGuild = client.guilds.cache.get('1052610210189037598');
		if (!milosnaGrotaGuild) {
			console.warn('Cron   » Miłosna Grota guild not found');
			return;
		}

		const serverCfg = guilds.getServerConfig(milosnaGrotaGuild.id);
		if (!serverCfg?.timeConfig?.dayMode) {
			console.warn('Cron   » Day mode configuration not found');
			return;
		}

		const { dayMode } = serverCfg.timeConfig;
		const mainChannel = milosnaGrotaGuild.channels.cache.get(serverCfg.channels.generaly);

		// Check if there are enough online members to proceed
		const onlineCount = milosnaGrotaGuild.members.cache.filter(m =>
			!m.user.bot && m.presence?.status &&
			['online', 'idle', 'dnd'].includes(m.presence.status)
		).size;

		if (onlineCount <= 9) {
			console.log(`Cron   » Not enough online members (${onlineCount}) for day mode activation`);
			return;
		}

		// Change guild name and banner
		const dayBanner = banners.getRandomDayBanner();
		const editOptions = {
			name: dayMode.guildName,
			reason: 'Automated day mode activation',
		};

		if (dayBanner) {
			editOptions.banner = dayBanner;
		}

		await milosnaGrotaGuild.edit(editOptions);

		// Apply rate limits to channels
		for (const [channelId, rateLimit] of Object.entries(dayMode.rateLimits)) {
			const channel = milosnaGrotaGuild.channels.cache.get(channelId);
			if (channel && channel.setRateLimitPerUser) {
				await channel.setRateLimitPerUser(rateLimit, 'Day mode rate limit');
			}
		}

		// Send message to main channel
		if (mainChannel && dayMode.message) {
			await mainChannel.send(dayMode.message);
		}

		console.log(`Cron   » Day mode activated successfully for ${milosnaGrotaGuild.name}`);
		console.log(`Cron   » Online members: ${onlineCount}`);

	} catch (err) {
		console.error('Cron   » Failed to activate day mode:', err.message);
	}
};