const { readdirSync } = require('node:fs');
const { join } = require('node:path');

const loadServerConfigs = () => {
	const configs = {};
	const configPath = join(__dirname, 'servers');

	try {
		readdirSync(configPath)
			.filter(file => file.endsWith('.js'))
			.forEach(file => {
				try {
					const config = require(join(configPath, file));
					if (config.id) {
						configs[config.id] = config;
						console.log(`Config » Loaded server config: ${file}`);
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

	get botTrapChannelId() { return this.config.main?.botTrapChannelId; }
	get automodChannelId() { return this.config.main?.automodChannelId; }
	get cleverBotChannelId() { return this.config.features?.cleverBot?.channelId; }

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

	get joinMsgDM() { return this.config.directMessages?.welcome?.enabled; }
	get joinMsgDMContent() { return this.config.directMessages?.welcome?.content; }

	get reactionApproveChannels() { return this.config.reactions?.approve?.channels; }
	get approveReaction() { return this.config.reactions?.approve?.emoji; }
	get reactionAttachmentChannels() { return this.config.reactions?.attachment?.channels; }
	get attachmentReaction() { return this.config.reactions?.attachment?.emojis; }
	get reactionHeartChannels() { return this.config.reactions?.hearts?.channels; }
	get heartReaction() { return this.config.reactions?.hearts?.emoji; }
	get reactionLikeDislikeChannels() { return this.config.reactions?.likeDislike?.channels; }
	get likeDislikeReactions() { return this.config.reactions?.likeDislike?.emojis; }

	get channels() { return this.config.channels || {}; }
	get roles() { return this.config.roles || {}; }
	get features() { return this.config.features || {}; }
	get timeModes() { return this.config.timeModes || {}; }

	get isDatingServer() { return this.config.features?.isDatingServer || false; }
	get cleverBot() {
		const cleverBotConfig = this.config.features?.cleverBot;
		if (typeof cleverBotConfig === 'boolean') return cleverBotConfig;
		if (typeof cleverBotConfig === 'object' && cleverBotConfig) return cleverBotConfig.enabled;
		return false;
	}
	get timeBasedModes() { return this.config.features?.timeBasedModes || false; }

	get cronConfig() { return this.config.cron || null; }

	get timeConfig() {
		if (!this.config.cron) return null;

		const { schedules } = this.config.cron;
		const createModeConfig = schedule => schedule ? {
			guildName: schedule.name,
			banner: schedule.banner,
			message: schedule.message,
			rateLimits: schedule.rateLimits || {},
		} : null;

		return {
			dayMode: createModeConfig(schedules?.day),
			afternoonMode: createModeConfig(schedules?.afternoon),
			nightMode: createModeConfig(schedules?.night),
		};
	}
}

const getServerConfig = guildId => {
	let config = serverConfigs[guildId];

	if (process.env.NODE_ENV === 'development') {
		const devConfigs = Object.values(serverConfigs).filter(cfg => cfg.id === guildId && cfg.environment === 'development');
		if (devConfigs.length > 0) {
			config = devConfigs[0];
		}
	}

	if (!config) {
		console.warn(`Config » No configuration found for guild ${guildId}`);
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
		.filter(file => file.endsWith('.js'))
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