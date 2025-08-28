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
		if (!serverCfg?.timeConfig?.nightMode) {
			console.warn('Cron   » Night mode configuration not found');
			return;
		}

		const { nightMode } = serverCfg.timeConfig;
		const mainChannel = milosnaGrotaGuild.channels.cache.get(serverCfg.channels.generaly);

		// Check if there are enough online members to proceed
		const onlineCount = milosnaGrotaGuild.members.cache.filter(m =>
			!m.user.bot && m.presence?.status &&
			['online', 'idle', 'dnd'].includes(m.presence.status)
		).size;

		if (onlineCount <= 9) {
			console.log(`Cron   » Not enough online members (${onlineCount}) for night mode activation`);
			return;
		}

		// Change guild name and banner
		const nightBanner = banners.getRandomNightBanner();
		const editOptions = {
			name: nightMode.guildName,
			reason: 'Automated night mode activation',
		};

		if (nightBanner) {
			editOptions.banner = nightBanner;
		}

		await milosnaGrotaGuild.edit(editOptions);

		// Apply rate limits to channels (more restrictive for night)
		for (const [channelId, rateLimit] of Object.entries(nightMode.rateLimits)) {
			const channel = milosnaGrotaGuild.channels.cache.get(channelId);
			if (channel && channel.setRateLimitPerUser) {
				await channel.setRateLimitPerUser(rateLimit, 'Night mode rate limit');
			}
		}

		// Send message to main channel
		if (mainChannel && nightMode.message) {
			await mainChannel.send(nightMode.message);
		}

		console.log(`Cron   » Night mode activated successfully for ${milosnaGrotaGuild.name}`);
		console.log(`Cron   » Online members: ${onlineCount}`);

	} catch (err) {
		console.error('Cron   » Failed to activate night mode:', err.message);
	}
};