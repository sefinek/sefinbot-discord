require('node:process').loadEnvFile();
const { Client, Events, Collection } = require('discord.js');
const setActivity = require('./scripts/setActivity.js');

// Init client and collections
const client = new Client({ intents: [1, 2, 4, 256, 512, 4096, 32768 ] });
client.commands = new Collection();
client.interactions = new Collection();
client.cooldowns = new Collection();

// Database
require('./database/mongoose.js');

// Handlers
require('./handlers/command.js')(client);
require('./handlers/event.js')(client);
require('./handlers/slash.js')(client);

// Shard events
client.on(Events.ShardDisconnect, (event, id) => console.warn(`Shard${id} » Disconnected unexpectedly. Event:`, event));
client.on(Events.ShardResume, async (id, events) => {
	await setActivity(client.user);
	console.info(`Shard${id} » Resumed. Replayed events:`, events);
});

// Run client
client.login(process.env.TOKEN);