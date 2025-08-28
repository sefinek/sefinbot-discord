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
		if (!serverCfg?.timeConfig?.afternoonMode) {
			console.warn('Cron   » Afternoon mode configuration not found');
			return;
		}

		const { afternoonMode } = serverCfg.timeConfig;
		const mainChannel = milosnaGrotaGuild.channels.cache.get(serverCfg.channels.generaly);

		// Change guild name and banner (no rate limit changes for afternoon mode)
		const afternoonBanner = banners.getRandomAfternoonBanner();
		const editOptions = {
			name: afternoonMode.guildName,
			reason: 'Automated afternoon mode activation',
		};

		if (afternoonBanner) {
			editOptions.banner = afternoonBanner;
		}

		await milosnaGrotaGuild.edit(editOptions);

		// Send message if configured
		if (mainChannel && afternoonMode.message) {
			await mainChannel.send(afternoonMode.message);
		}

		console.log(`Cron   » Afternoon mode activated successfully for ${milosnaGrotaGuild.name}`);

	} catch (err) {
		console.error('Cron   » Failed to activate afternoon mode:', err.message);
	}
};