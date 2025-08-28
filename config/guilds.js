const { readdirSync } = require('node:fs');
const { join } = require('node:path');

// Auto-load server configurations
const loadServerConfigs = () => {
	const configs = {};
	const configPath = join(__dirname, 'servers');

	try {
		const configFiles = readdirSync(configPath).filter(file => file.endsWith('.js'));

		for (const file of configFiles) {
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
		}
	} catch (err) {
		console.error('Config » Failed to load server configs:', err.message);
	}

	return configs;
};

// Load all server configurations
const serverConfigs = loadServerConfigs();

// Server configuration adapter for backward compatibility
class ServerConfig {
	constructor(config) {
		this.config = config;
	}

	// Legacy compatibility getters
	get botTrapChannelId() { return this.config.main?.botTrapChannelId; }
	get automodChannelId() { return this.config.main?.automodChannelId; }

	// CleverBot compatibility
	get cleverBotChannelId() { return this.config.additional?.cleverBot?.channelId; }

	// Voice channels compatibility
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

	// Events compatibility
	get welcomeChannelId() { return this.config.events?.welcome?.channelId; }
	get welcomeContent() { return this.config.events?.welcome?.content; }

	get farewellChannelId() { return this.config.events?.farewell?.channelId; }
	get farewellContent() { return this.config.events?.farewell?.content; }

	get banChannelId() { return this.config.events?.ban?.channelId; }
	get banContent() { return this.config.events?.ban?.content; }

	// DM compatibility
	get joinMsgDM() { return this.config.directMessages?.welcome?.enabled; }
	get joinMsgDMContent() { return this.config.directMessages?.welcome?.content; }

	// Reactions compatibility
	get reactionApproveChannels() { return this.config.reactions?.approve?.channels; }
	get approveReaction() { return this.config.reactions?.approve?.emoji; }

	get reactionAttachmentChannels() { return this.config.reactions?.attachment?.channels; }
	get attachmentReaction() { return this.config.reactions?.attachment?.emojis; }

	get reactionHeartChannels() { return this.config.reactions?.hearts?.channels; }
	get heartReaction() { return this.config.reactions?.hearts?.emoji; }

	get reactionLikeDislikeChannels() { return this.config.reactions?.likeDislike?.channels; }
	get likeDislikeReactions() { return this.config.reactions?.likeDislike?.emojis; }

	// New structured accessors
	get channels() { return this.config.channels || {}; }
	get roles() { return this.config.roles || {}; }
	get features() { return this.config.features || {}; }
	get timeModes() { return this.config.timeModes || {}; }

	// Feature checks
	get isDatingServer() { return this.config.features?.isDatingServer || false; }
	get cleverBot() { return this.config.features?.cleverBot || false; }
	get timeBasedModes() { return this.config.features?.timeBasedModes || false; }

	// Time config compatibility
	get timeConfig() {
		if (!this.config.timeModes) return null;

		return {
			dayMode: this.config.timeModes.day ? {
				guildName: this.config.timeModes.day.name,
				banner: this.config.timeModes.day.banner,
				message: this.config.timeModes.day.message,
				rateLimits: this.config.timeModes.day.rateLimits || {},
			} : null,
			afternoonMode: this.config.timeModes.afternoon ? {
				guildName: this.config.timeModes.afternoon.name,
				banner: this.config.timeModes.afternoon.banner,
				message: this.config.timeModes.afternoon.message,
			} : null,
			nightMode: this.config.timeModes.night ? {
				guildName: this.config.timeModes.night.name,
				banner: this.config.timeModes.night.banner,
				message: this.config.timeModes.night.message,
				rateLimits: this.config.timeModes.night.rateLimits || {},
			} : null,
		};
	}
}

// Main export functions
const getServerConfig = guildId => {
	let config = serverConfigs[guildId];

	// Check for environment-specific config
	const { NODE_ENV } = process.env;
	if (NODE_ENV === 'development') {
		// Look for development-specific config
		const devConfigs = Object.values(serverConfigs).filter(cfg => cfg.id === guildId && cfg.environment === 'development');
		if (devConfigs.length > 0) {
			config = devConfigs[0];
			console.log(`Config » Using development config for guild ${guildId}`);
		} else if (config) {
			console.log(`Config » Using production config for guild ${guildId} (no dev config found)`);
		}
	}

	if (!config) {
		console.warn(`Config » No configuration found for guild ${guildId}`);
		return null;
	}

	return new ServerConfig(config);
};

const getAllServerConfigs = () => {
	return Object.keys(serverConfigs).map(guildId => ({
		guildId,
		config: new ServerConfig(serverConfigs[guildId]),
	}));
};

const reloadConfigs = () => {
	// Clear require cache for server configs
	const configPath = join(__dirname, 'servers');
	const configFiles = readdirSync(configPath).filter(file => file.endsWith('.js'));

	configFiles.forEach(file => {
		const fullPath = join(configPath, file);
		delete require.cache[require.resolve(fullPath)];
	});

	// Reload configs
	Object.assign(serverConfigs, loadServerConfigs());
	console.log('Config » Server configurations reloaded');
};

module.exports = {
	getServerConfig,
	getAllServerConfigs,
	reloadConfigs,

	// Development helpers
	_getServerConfigs: () => serverConfigs, // For debugging
	_ServerConfig: ServerConfig, // For testing
};