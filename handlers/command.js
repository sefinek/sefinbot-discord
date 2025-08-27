const { readdirSync, existsSync, statSync } = require('node:fs');
const { join } = require('node:path');

module.exports = client => {
	const commandsPath = join(__dirname, '..', 'commands', 'prefix');
	if (!existsSync(commandsPath)) return console.log('PrfCMH » No prefix commands folder found, skipping...');

	const loadCommand = (filePath, file, prefix) => {
		try {
			const command = require(filePath);
			if (command.name) {
				command.category = prefix.split('/')[0];
				client.commands.set(command.name, command);
				return true;
			} else {
				console.error(`PrfCMH » The command '${file}' is missing a required "name" property`);
				return false;
			}
		} catch (err) {
			console.error(`PrfCMH » Failed to load command '${file}':`, err);
			return false;
		}
	};

	const loadFromDirectory = (dirPath, prefix = '') => {
		const items = readdirSync(dirPath);
		let loaded = 0;
		let total = 0;

		for (const item of items) {
			const itemPath = join(dirPath, item);
			const stat = statSync(itemPath);

			if (stat.isDirectory()) {
				const subResult = loadFromDirectory(itemPath, prefix ? `${prefix}/${item}` : item);
				loaded += subResult.loaded;
				total += subResult.total;
			} else if (item.endsWith('.js')) {
				total++;
				const displayName = prefix ? `${prefix}/${item}` : item;
				if (loadCommand(itemPath, displayName, prefix)) {
					loaded++;
				}
			}
		}

		return { loaded, total };
	};

	try {
		const result = loadFromDirectory(commandsPath);
		console.log(`PrfCMH » Successfully loaded ${result.loaded}/${result.total} prefix commands`);
	} catch (err) {
		console.error('PrfCMH » An error occurred while reading command files:', err);
	}
};