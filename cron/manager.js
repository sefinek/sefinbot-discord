const { CronJob } = require('cron');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const guilds = require('../config/guilds.js');

class CronManager {
	constructor(client) {
		this.client = client;
		this.jobs = [];
		this.bannerCache = { day: [], afternoon: [], night: [], papaj: null };
		this.loadBanners();
	}

	loadBanners() {
		const bannerPath = path.join(__dirname, '../assets/banners');
		const loadBanner = filename => {
			const fullPath = path.join(bannerPath, filename);
			return existsSync(fullPath) ? readFileSync(fullPath) : null;
		};

		const loadBannersByType = (type, files) => 
			Array.isArray(files) 
				? files.map(file => loadBanner(`${type}/${file}`)).filter(Boolean)
				: loadBanner(files);

		this.client.guilds.cache.forEach(guild => {
			const config = guilds.getServerConfig(guild.id);
			if (config?.cronConfig?.enabled) {
				const { banners } = config.cronConfig;
				Object.entries(banners).forEach(([type, files]) => {
					this.bannerCache[type] = type === 'papaj' 
						? loadBanner(files) 
						: loadBannersByType(type, files);
				});
			}
		});
	}

	getRandomBanner(type) {
		const banners = this.bannerCache[type];
		if (!banners || (Array.isArray(banners) && !banners.length)) return null;
		return Array.isArray(banners) 
			? banners[Math.floor(Math.random() * banners.length)] 
			: banners;
	}

	async executeSchedule(guildId, scheduleName, schedule) {
		try {
			const guild = this.client.guilds.cache.get(guildId);
			if (!guild) return console.warn(`Cron   » Guild ${guildId} not found`);

			const config = guilds.getServerConfig(guildId);
			if (!config?.cronConfig?.enabled) return;

			if (!schedule.ignoreOnlineCheck) {
				const onlineCount = guild.members.cache.filter(m =>
					!m.user.bot && m.presence?.status &&
					['online', 'idle', 'dnd'].includes(m.presence.status)
				).size;

				if (onlineCount <= config.cronConfig.minimumOnlineMembers) {
					return console.log(`Cron   » Not enough online members (${onlineCount}) for ${scheduleName} on ${guild.name}`);
				}
			}

			const editOptions = { name: schedule.name, reason: `Automated ${scheduleName} activation` };

			if (schedule.randomBanner) {
				const banner = this.getRandomBanner(schedule.bannerType || scheduleName.replace(/Start|End/, ''));
				if (banner) editOptions.banner = banner;
			} else if (scheduleName === 'papajStart') {
				const banner = this.getRandomBanner('papaj');
				if (banner) editOptions.banner = banner;
			}

			await guild.edit(editOptions);

			await Promise.all(
				Object.entries(schedule.rateLimits || {}).map(([channelId, rateLimit]) => {
					const channel = guild.channels.cache.get(channelId);
					return channel?.setRateLimitPerUser?.(rateLimit, `${scheduleName} rate limit`);
				}).filter(Boolean)
			);

			if (schedule.messageChannel && schedule.message) {
				const messageChannel = guild.channels.cache.get(schedule.messageChannel);
				if (messageChannel) {
					let message = schedule.message;
					const roleMatches = message.match(/\{role\.(\w+)\}/g);
					if (roleMatches) {
						roleMatches.forEach(match => {
							const roleName = match.replace(/\{role\.|\}/g, '');
							const roleId = config.roles?.[roleName];
							if (roleId) message = message.replace(match, roleId);
						});
					}
					await messageChannel.send(message);
				}
			}

			console.log(`Cron   » ${scheduleName} executed successfully for ${guild.name}`);
		} catch (err) {
			console.error(`Cron   » Error executing ${scheduleName} for guild ${guildId}:`, err.message);
		}
	}

	initialize() {
		console.log('Cron   » Initializing dynamic scheduled tasks...');

		if (!this.client.guilds.cache.size) {
			return console.warn('Cron   » No guilds in cache, waiting for ready event...');
		}

		console.log(`Cron   » Found ${this.client.guilds.cache.size} guilds in cache`);

		this.client.guilds.cache.forEach(guild => {
			console.log(`Cron   » Checking guild: ${guild.name} (${guild.id})`);

			const config = guilds.getServerConfig(guild.id);
			if (!config?.cronConfig?.enabled) {
				return console.log(`Cron   » No enabled cronConfig for guild ${guild.name}`);
			}

			const { schedules, timezone } = config.cronConfig;
			console.log(`Cron   » Found ${Object.keys(schedules).length} schedules for ${guild.name}`);

			Object.entries(schedules).forEach(([scheduleName, schedule]) => {
				if (!schedule.enabled) {
					return console.log(`Cron   » Schedule ${scheduleName} disabled for ${guild.name}`);
				}

				const job = new CronJob(
					schedule.time,
					() => this.executeSchedule(guild.id, scheduleName, schedule),
					null,
					true,
					timezone
				);

				this.jobs.push({ guildId: guild.id, scheduleName, job });
				console.log(`Cron   » Scheduled ${scheduleName} for ${guild.name} at ${schedule.time}`);
			});
		});

		console.log(`Cron   » Loaded ${this.jobs.length} scheduled tasks`);
	}

	stop() {
		this.jobs.forEach(({ job }) => job.stop());
		this.jobs = [];
		console.log('Cron   » All scheduled tasks stopped');
	}
}

let cronManager = null;

module.exports = client => {
	cronManager?.stop();
	cronManager = new CronManager(client);
	cronManager.initialize();
};