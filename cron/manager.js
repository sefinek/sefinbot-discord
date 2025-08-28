const { CronJob } = require('cron');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const guilds = require('../config/guilds.js');

class CronManager {
	constructor(client) {
		this.client = client;
		this.jobs = [];
		this.bannerCache = {};
		this.loadBanners();
	}

	loadBanners() {
		const bannerPath = path.join(__dirname, '../assets/banners');
		const loadBanner = (filename) => {
			const fullPath = path.join(bannerPath, filename);
			if (existsSync(fullPath)) {
				return readFileSync(fullPath);
			}
			console.warn(`Banner » File not found: ${filename}`);
			return null;
		};

		const loadBannersByType = (type, files) => {
			if (Array.isArray(files)) {
				return files.map(file => {
					const fullFilename = `${type}/${file}`;
					return loadBanner(fullFilename);
				}).filter(banner => banner !== null);
			}
			return loadBanner(files);
		};

		this.bannerCache = {
			day: [],
			afternoon: [],
			night: [],
			papaj: null,
		};

		this.client.guilds.cache.forEach(guild => {
			const config = guilds.getServerConfig(guild.id);
			if (config?.cronConfig?.enabled) {
				const { banners } = config.cronConfig;
				Object.keys(banners).forEach(type => {
					if (type === 'papaj') {
						this.bannerCache.papaj = loadBanner(banners.papaj);
					} else {
						this.bannerCache[type] = loadBannersByType(type, banners[type]);
					}
				});
			}
		});
	}

	getRandomBanner(type) {
		const banners = this.bannerCache[type];
		if (!banners || (Array.isArray(banners) && banners.length === 0)) return null;
		if (Array.isArray(banners)) {
			return banners[Math.floor(Math.random() * banners.length)];
		}
		return banners;
	}

	async executeSchedule(guildId, scheduleName, schedule) {
		try {
			const guild = this.client.guilds.cache.get(guildId);
			if (!guild) {
				console.warn(`Cron   » Guild ${guildId} not found`);
				return;
			}

			const config = guilds.getServerConfig(guildId);
			if (!config?.cronConfig?.enabled) return;

			if (!schedule.ignoreOnlineCheck) {
				const onlineCount = guild.members.cache.filter(m =>
					!m.user.bot && m.presence?.status &&
					['online', 'idle', 'dnd'].includes(m.presence.status)
				).size;

				if (onlineCount <= config.cronConfig.minimumOnlineMembers) {
					console.log(`Cron   » Not enough online members (${onlineCount}) for ${scheduleName} on ${guild.name}`);
					return;
				}
			}

			const editOptions = {
				name: schedule.name,
				reason: `Automated ${scheduleName} activation`,
			};

			if (schedule.randomBanner) {
				const bannerType = schedule.bannerType || scheduleName.replace(/Start|End/, '');
				const banner = this.getRandomBanner(bannerType);
				if (banner) editOptions.banner = banner;
			} else if (scheduleName === 'papajStart') {
				const banner = this.getRandomBanner('papaj');
				if (banner) editOptions.banner = banner;
			}

			await guild.edit(editOptions);

			for (const [channelId, rateLimit] of Object.entries(schedule.rateLimits || {})) {
				const channel = guild.channels.cache.get(channelId);
				if (channel?.setRateLimitPerUser) {
					await channel.setRateLimitPerUser(rateLimit, `${scheduleName} rate limit`);
				}
			}

			if (schedule.messageChannel && schedule.message) {
				const messageChannel = guild.channels.cache.get(schedule.messageChannel);
				if (messageChannel) {
					let message = schedule.message;
					if (message.includes('{role.')) {
						const roleMatch = message.match(/\{role\.(\w+)\}/g);
						if (roleMatch) {
							roleMatch.forEach(match => {
								const roleName = match.replace(/\{role\.|\}/g, '');
								const roleId = config.roles?.[roleName];
								if (roleId) {
									message = message.replace(match, roleId);
								}
							});
						}
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

		if (this.client.guilds.cache.size === 0) {
			console.warn('Cron   » No guilds in cache, waiting for ready event...');
			return;
		}

		console.log(`Cron   » Found ${this.client.guilds.cache.size} guilds in cache`);

		this.client.guilds.cache.forEach(guild => {
			console.log(`Cron   » Checking guild: ${guild.name} (${guild.id})`);

			const config = guilds.getServerConfig(guild.id);
			if (!config) {
				console.log(`Cron   » No config found for guild ${guild.name}`);
				return;
			}

			if (!config.cronConfig) {
				console.log(`Cron   » No cronConfig for guild ${guild.name}`);
				return;
			}

			if (!config.cronConfig.enabled) {
				console.log(`Cron   » Cron disabled for guild ${guild.name}`);
				return;
			}

			const { schedules, timezone } = config.cronConfig;
			console.log(`Cron   » Found ${Object.keys(schedules).length} schedules for ${guild.name}`);

			Object.entries(schedules).forEach(([scheduleName, schedule]) => {
				if (!schedule.enabled) {
					console.log(`Cron   » Schedule ${scheduleName} disabled for ${guild.name}`);
					return;
				}

				const job = new CronJob(
					schedule.time,
					() => this.executeSchedule(guild.id, scheduleName, schedule),
					null,
					true,
					timezone
				);

				this.jobs.push({
					guildId: guild.id,
					scheduleName,
					job,
				});

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
	if (cronManager) {
		cronManager.stop();
	}

	cronManager = new CronManager(client);
	cronManager.initialize();
};