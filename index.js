require('dotenv').config();
const { Client, Events, Collection } = require('discord.js');
const fs = require('node:fs/promises');

// Intents & commands & modals
const client = new Client({ intents: [1, 2, 4, 256, 512, 4096, 32768 ] });
client.commands = new Collection();
client.interactions = new Collection();

// Database
require('./database/mongoose.js');

// Handlers
// require('./handlers/command.js')(client, fs);
require('./handlers/event.js')(client, fs);

// Shards error handler
client.on(Events.ShardError, (err, id) => console.error(`Shard${id} » A websocket connection encountered an error:`, err));
client.on(Events.ShardDisconnect, (event, id) => console.log(`Shard${id} » Shard disconnected for an unknown reason. Event:`, event));
client.on(Events.ShardReconnecting, id => console.log(`Shard${id} » Attempting to reconnect to the API...`));
client.on(Events.ShardResume, (id, events) => {
	require('./utils/setActivity.js')(client.user);
	console.log(`Shard${id} » Shard has been successfully resumed. Replayed events:`, events);
});
client.on(Events.ShardReady, shard => console.log(`Shard${shard} » Shard has been successfully started`));

// Error handler
process.on('unhandledRejection', err => console.error('ErrorR » Unhandled promise rejection:', err));

// Run client
client.login(process.env.BOT_TOKEN);