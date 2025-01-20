const { join } = require('node:path');
const commandsPath = join(__dirname, '..', 'commands');

module.exports = async (client, fs) => {
	console.log('PrfCMH » Loading prefix commands...');

	try {
		const commandCategories = await fs.readdir(commandsPath);

		for (const category of commandCategories) {
			const categoryPath = join(commandsPath, category);
			const commandFiles = (await fs.readdir(categoryPath)).filter(file => file.endsWith('.js'));

			for (const file of commandFiles) {
				const filePath = join(categoryPath, file);
				const command = require(filePath);

				if (command.name) {
					await client.commands.set(command.name, command);
				} else {
					console.error(`PrfCMH » The file '${category}/${file}' is missing a command name`);
				}
			}
		}
	} catch (err) {
		console.error('PrfCMH » An error occurred while reading command files:', err);
	}
};