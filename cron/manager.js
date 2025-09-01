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

		const loadBannersByFiles = files => {
			if (!Array.isArray(files)) return null;
			return files.map(filename => {
				// Try different paths
				let banner = loadBanner(`day/${filename}`);
				if (!banner) banner = loadBanner(`night/${filename}`);
				if (!banner) banner = loadBanner(filename);
				return banner;
			}).filter(Boolean);
		};

		this.client.guilds.cache.forEach(guild => {
			const config = guilds.getServerConfig(guild.id);
			if (config?.cronConfig?.enabled) {
				const { schedules } = config.cronConfig;
				// Cache banners from all schedules
				Object.entries(schedules).forEach(([scheduleName, schedule]) => {
					if (schedule.banners) {
						const banners = loadBannersByFiles(schedule.banners);
						if (banners && banners.length > 0) {
							if (!this.bannerCache[scheduleName]) {
								this.bannerCache[scheduleName] = banners;
							}
						}
					}
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

			// Handle banners from schedule config
			if (schedule.banners && Array.isArray(schedule.banners)) {
				const banners = this.bannerCache[scheduleName] || [];
				if (banners.length > 0) {
					const randomBanner = banners[Math.floor(Math.random() * banners.length)];
					if (randomBanner) editOptions.banner = randomBanner;
				}
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
					const message = schedule.message;
					await messageChannel.send(message);
				}
			}

			console.log(`Cron   » ${scheduleName} executed successfully for ${guild.name}`);
		} catch (err) {
			console.error(`Cron   » Error executing ${scheduleName} for guild ${guildId}:`, err.message);
		}
	}

	initialize() {
		if (!this.client.guilds.cache.size) {
			return console.warn('Cron   » No guilds in cache, waiting for ready event...');
		}

		// Check all configured servers first
		const allConfigs = guilds.getAllServerConfigs();
		allConfigs.forEach(({ guildId, config }) => {
			if (!config?.cronConfig?.enabled) return;

			// In development mode, only process development servers
			if (process.env.NODE_ENV === 'development' && !config.config.dev) {
				return;
			}

			// In production mode, skip development servers
			if (process.env.NODE_ENV !== 'development' && config.config.dev) {
				return;
			}

			const guild = this.client.guilds.cache.get(guildId);
			if (!guild) {
				console.error(`Cron   » ERROR: Bot is not in guild ${guildId} but cron is enabled in config!`);
				return;
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
				console.log(`Cron   » Scheduled '${scheduleName}' for '${guild.name}' at '${schedule.time}'`);
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