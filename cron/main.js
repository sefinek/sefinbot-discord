const { CronJob } = require('cron');

// Cron modules
const dayMode = require('./dayMode.js');
const nightMode = require('./nightMode.js');
const afternoonMode = require('./afternoonMode.js');
const papajMode = require('./papajMode.js');

// Variables
const timezone = 'Europe/Warsaw';

module.exports = client => {
	console.log('Cron   » Initializing scheduled tasks...');

	// Day mode - 6:30 AM
	new CronJob('30 6 * * *', async () => {
		try {
			await dayMode(client);
		} catch (err) {
			console.error('Cron   » Error in day mode:', err.message);
		}
	}, null, true, timezone);

	// Afternoon mode - 5:30 PM
	new CronJob('30 17 * * *', async () => {
		try {
			await afternoonMode(client);
		} catch (err) {
			console.error('Cron   » Error in afternoon mode:', err.message);
		}
	}, null, true, timezone);

	// Night mode - 11:30 PM
	new CronJob('30 23 * * *', async () => {
		try {
			await nightMode(client);
		} catch (err) {
			console.error('Cron   » Error in night mode:', err.message);
		}
	}, null, true, timezone);

	// Papaj mode start - 9:37 PM
	new CronJob('37 21 * * *', async () => {
		try {
			await papajMode.start(client);
		} catch (err) {
			console.error('Cron   » Error starting papaj mode:', err.message);
		}
	}, null, true, timezone);

	// Papaj mode end - 9:38 PM
	new CronJob('38 21 * * *', async () => {
		try {
			await papajMode.end(client);
		} catch (err) {
			console.error('Cron   » Error ending papaj mode:', err.message);
		}
	}, null, true, timezone);

	console.log('Cron   » Scheduled tasks loaded successfully');
};