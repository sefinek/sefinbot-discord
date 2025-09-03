const { readdirSync } = require('node:fs');
const { join } = require('node:path');

const isDev = process.env.NODE_ENV === 'development';
const configPath = join(__dirname, 'servers');
const fileFilter = file => file.endsWith('.js') && !file.includes('.example.');

const loadServerConfigs = () => {
	const configs = {};

	try {
		const configFiles = readdirSync(configPath).filter(fileFilter);

		for (const file of configFiles) {
			try {
				const config = require(join(configPath, file));

				if (!config.id) {
					console.warn(`Config » Server config ${file} missing ID field`);
					continue;
				}

				const isConfigDev = config.dev === true;
				if ((isDev && isConfigDev) || (!isDev && !isConfigDev)) {
					configs[config.id] = config;
					console.log(`Config » Loaded ${file} (${isDev ? 'dev' : 'prod'} mode)`);
				}
			} catch (err) {
				console.error(`Config » Failed to load ${file}: ${err.message}`);
			}
		}
	} catch (err) {
		console.error(`Config » Failed to read configs directory: ${err.message}`);
	}

	console.log(`Config » Loaded ${Object.keys(configs).length} server configurations`);
	return configs;
};

let serverConfigs = loadServerConfigs();

const getServerConfig = guildId => serverConfigs[guildId] || null;

let allConfigs = null;

const loadAllConfigs = () => {
	if (allConfigs) return allConfigs;
	allConfigs = {};

	try {
		const configFiles = readdirSync(configPath).filter(fileFilter);
		for (const file of configFiles) {
			try {
				const config = require(join(configPath, file));
				if (config.id) allConfigs[config.id] = config;
			} catch { /* ignore */ }
		}
	} catch (err) {
		console.error(`Config » Error loading all configs: ${err.message}`);
	}

	return allConfigs;
};

const shouldIgnoreGuild = guildId => {
	if (isDev || serverConfigs[guildId]) return false;
	const configs = loadAllConfigs();
	return configs[guildId]?.dev === true;
};

const getAllServerConfigs = () =>
	Object.entries(serverConfigs).map(([guildId, config]) => ({ guildId, config }));

const reloadConfigs = () => {
	try {
		readdirSync(configPath)
			.filter(fileFilter)
			.forEach(file => delete require.cache[require.resolve(join(configPath, file))]);

		serverConfigs = loadServerConfigs();
		allConfigs = null;
		console.log('Config » Server configurations reloaded successfully');
	} catch (err) {
		console.error(`Config » Failed to reload configurations: ${err.message}`);
	}
};

module.exports = {
	getServerConfig,
	getAllServerConfigs,
	reloadConfigs,
	shouldIgnoreGuild,
};