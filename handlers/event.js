const { readdirSync, existsSync } = require('node:fs');
const { join } = require('node:path');

module.exports = client => {

	const eventsPath = join(__dirname, '..', 'events');
	if (!existsSync(eventsPath)) return console.log('EventH » No events folder found, skipping...');

	try {
		const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));
		let loaded = 0;

		for (const file of eventFiles) {
			const filePath = join(eventsPath, file);

			try {
				const event = require(filePath);

				if ('name' in event && 'execute' in event) {
					Object.freeze(event);
					const handler = (...args) => event.execute(...args, client);
					(event.once ? client.once : client.on).call(client, event.name, handler);
					loaded++;
				} else {
					console.error(`EventH » The event '${file}' is missing required "name" or "execute" property`);
				}
			} catch (err) {
				console.error(`EventH » Failed to load event '${file}':`, err);
			}
		}

		console.log(`EventH » Successfully loaded ${loaded}/${eventFiles.length} events`);
	} catch (err) {
		console.error('EventH » An error occurred while reading event files:', err);
	}
};