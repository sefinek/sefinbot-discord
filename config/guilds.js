const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const isDev = process.env.NODE_ENV === 'development';

const loadServerConfigs = () => {
	const configs = {};
	const configPath = join(__dirname, 'servers');

	try {
		readdirSync(configPath)
			.filter(file => file.endsWith('.js') && !file.includes('.example.'))
			.forEach(file => {
				try {
					const config = require(join(configPath, file));
					if (config.id) {
						const isConfigDev = config.dev === true;
						if ((isDev && isConfigDev) || (!isDev && !isConfigDev)) {
							configs[config.id] = config;
							console.log(`Config » Loaded server config: ${file} (${isDev ? 'dev' : 'prod'} mode)`);
						}
					} else {
						console.warn(`Config » Server config ${file} missing ID field`);
					}
				} catch (err) {
					console.error(`Config » Failed to load ${file}:`, err.message);
				}
			});
	} catch (err) {
		console.error('Config » Failed to load server configs:', err.message);
	}

	return configs;
};

const serverConfigs = loadServerConfigs();

class ServerConfig {
	constructor(config) {
		this.config = config;
	}

	get botTrapChannelId() { return this.config.features?.botTrap || null; }
	get autoModChannel() { return this.config.autoModChannel; }
	get cleverBotChannelId() { return this.config.features?.cleverBot; }

	get vcMembers() { return this.config.voiceChannels?.members?.enabled; }
	get vcMembersChannel() { return this.config.voiceChannels?.members?.channelId; }
	get vcMembersName() { return this.config.voiceChannels?.members?.name; }

	get vcOnline() { return this.config.voiceChannels?.online?.enabled; }
	get vcOnlineChannel() { return this.config.voiceChannels?.online?.channelId; }
	get vcOnlineName() { return this.config.voiceChannels?.online?.name; }

	get vcNew() { return this.config.voiceChannels?.newest?.enabled; }
	get vcNewChannel() { return this.config.voiceChannels?.newest?.channelId; }
	get vcNewName() { return this.config.voiceChannels?.newest?.name; }

	get vcRecordOnline() { return this.config.voiceChannels?.recordOnline?.enabled; }
	get vcRecordOnlineChannel() { return this.config.voiceChannels?.recordOnline?.channelId; }
	get vcRecordOnlineName() { return this.config.voiceChannels?.recordOnline?.name; }

	get welcomeChannelId() { return this.config.events?.welcome?.channelId; }
	get welcomeContent() { return this.config.events?.welcome?.content; }
	get farewellChannelId() { return this.config.events?.farewell?.channelId; }
	get farewellContent() { return this.config.events?.farewell?.content; }
	get banChannelId() { return this.config.events?.ban?.channelId; }
	get banContent() { return this.config.events?.ban?.content; }

	get joinMsgDM() { return this.config.events?.directMessages?.welcome?.enabled; }
	get joinMsgDMContent() { return this.config.events?.directMessages?.welcome?.content; }
	get verificationSuccessDM() { return this.config.events?.directMessages?.verificationSuccess?.enabled; }
	get verificationSuccessDMContent() { return this.config.events?.directMessages?.verificationSuccess?.content; }

	get reactions() { return this.config.reactions || []; }

	get verificationEnabled() { return this.config.verification?.enabled || false; }
	get unverifiedRoleId() { return this.config.verification?.unverifiedRoleId; }
	get verifiedRoleId() { return this.config.verification?.verifiedRoleId; }
	get verificationContent() { return this.config.verification?.content; }
	get verificationButton() { return this.config.verification?.button; }

	get channels() { return this.config.channels || {}; }
	get roles() { return this.config.roles || {}; }
	get features() { return this.config.features || {}; }
	get timeModes() { return this.config.timeModes || {}; }

	get isDatingServer() { return this.config.features?.isDatingServer || false; }
	get cleverBot() {
		return !!this.config.features?.cleverBot;
	}

	get cronConfig() { return this.config.cron || null; }

	get timeConfig() {
		if (!this.config.cron) return null;

		const { schedules } = this.config.cron;
		const createModeConfig = schedule => schedule ? {
			guildName: schedule.name,
			banner: schedule.banner || (schedule.banners ? schedule.banners[0] : null), // Support both banner and banners
			banners: schedule.banners || (schedule.banner ? [schedule.banner] : []), // Support both formats
			message: schedule.message,
			messageChannel: schedule.messageChannel || null,
			rateLimits: schedule.rateLimits || {},
			ignoreOnlineCheck: schedule.ignoreOnlineCheck || false,
		} : null;

		return {
			dayMode: createModeConfig(schedules?.day),
			afternoonMode: createModeConfig(schedules?.afternoon),
			nightMode: createModeConfig(schedules?.night),
			papajStart: createModeConfig(schedules?.papajStart),
			papajEnd: createModeConfig(schedules?.papajEnd),
		};
	}
}

const getServerConfig = guildId => {
	const config = serverConfigs[guildId];

	if (!config) {
		if (process.env.NODE_ENV === 'development') console.warn(`Config » No configuration found for guild ${guildId}`);
		return null;
	}

	return new ServerConfig(config);
};

const getAllServerConfigs = () =>
	Object.keys(serverConfigs).map(guildId => ({
		guildId,
		config: new ServerConfig(serverConfigs[guildId]),
	}));

const reloadConfigs = () => {
	const configPath = join(__dirname, 'servers');
	readdirSync(configPath)
		.filter(file => file.endsWith('.js') && !file.includes('.example.'))
		.forEach(file => {
			delete require.cache[require.resolve(join(configPath, file))];
		});

	Object.keys(serverConfigs).forEach(key => delete serverConfigs[key]);
	Object.assign(serverConfigs, loadServerConfigs());
	console.log('Config » Server configurations reloaded');
};

module.exports = {
	getServerConfig,
	getAllServerConfigs,
	reloadConfigs,
	_getServerConfigs: () => serverConfigs,
	_ServerConfig: ServerConfig,
};