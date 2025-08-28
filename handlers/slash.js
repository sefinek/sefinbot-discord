const { readdirSync, existsSync } = require('node:fs');
const { join } = require('node:path');

module.exports = client => {
	const commandsPath = join(__dirname, '..', 'commands', 'slashes');
	if (!existsSync(commandsPath)) return console.log('SlCMD  » No slash commands folder found, skipping...');

	try {
		const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		let loaded = 0;

		for (const file of commandFiles) {
			const filePath = join(commandsPath, file);

			try {
				const command = require(filePath);

				if ('data' in command && 'execute' in command) {
					client.interactions.set(command.data.name, command);
					loaded++;
				} else {
					console.error(`SlCMD  » The command '${file}' is missing required "data" or "execute" property`);
				}
			} catch (err) {
				console.error(`SlCMD  » Failed to load slash command '${file}':`, err.message);
			}
		}

		console.log(`SlCMD  » Successfully loaded ${loaded}/${commandFiles.length} slash commands`);
	} catch (err) {
		console.error('SlCMD  » An error occurred while reading command files:', err);
	}
};