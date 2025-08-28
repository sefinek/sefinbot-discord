const guilds = require('../config/guilds.js');
const banners = require('./scripts/getBanner.js');

module.exports = {
	async start(client) {
		try {
			const milosnaGrotaGuild = client.guilds.cache.get('1052610210189037598');
			if (!milosnaGrotaGuild) {
				console.warn('Cron   » Miłosna Grota guild not found for papaj mode');
				return;
			}

			const serverCfg = guilds.getServerConfig(milosnaGrotaGuild.id);
			if (!serverCfg) {
				console.warn('Cron   » Server config not found for papaj mode');
				return;
			}

			const mainChannel = milosnaGrotaGuild.channels.cache.get(serverCfg.channels.generaly);

			// Change to papiezowa banner and name
			await milosnaGrotaGuild.edit({
				name: 'Miłosna Grota・🙏',
				banner: banners.papiezowa,
				reason: 'GODZINA PAPIEŻOWA 21:37',
			});

			// Send papiezowa message
			if (mainChannel) {
				const papiezRole = milosnaGrotaGuild.roles.cache.get(serverCfg.roles.pingPapiezowa);
				const roleText = papiezRole ? `<@&${papiezRole.id}>` : 'wszystkich';

				await mainChannel.send(
					'🙏 **GODZINA PAPIEŻOWA** 🙏\n' +
					`Wybiła godzina ${roleText}!\n\n` +
					'> https://www.youtube.com/watch?v=1vZ28SAgzKc'
				);
			}

			console.log('Cron   » Papaj mode started at 21:37');

		} catch (err) {
			console.error('Cron   » Failed to start papaj mode:', err.message);
		}
	},

	async end(client) {
		try {
			const milosnaGrotaGuild = client.guilds.cache.get('1052610210189037598');
			if (!milosnaGrotaGuild) return;

			// Return to normal night mode name and banner
			const nightBanner = banners.getRandomNightBanner();
			const editOptions = {
				name: 'Miłosna Grota・😴',
				reason: 'End of GODZINA PAPIEŻOWA',
			};

			if (nightBanner) {
				editOptions.banner = nightBanner;
			}

			await milosnaGrotaGuild.edit(editOptions);

			console.log('Cron   » Papaj mode ended at 21:38');

		} catch (err) {
			console.error('Cron   » Failed to end papaj mode:', err.message);
		}
	},
};