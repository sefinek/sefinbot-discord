const { ActivityType } = require('discord.js');

const activities = [
	{ name: 'meow~~? 🐈', type: ActivityType.Playing, status: 'online' },
	{ name: '🎶🎵🎵🎶', type: ActivityType.Listening, status: 'idle' },
	{ name: 'https://sefinek.net', type: ActivityType.Watching, status: 'dnd' },
	{ name: 'you', type: ActivityType.Watching, status: 'dnd' },
];

module.exports = client => {
	let previousActivityIndex = null;

	const updateActivityAndStatus = () => {
		let newActivityIndex;

		do {
			newActivityIndex = Math.floor(Math.random() * activities.length);
		} while (newActivityIndex === previousActivityIndex);

		client.setActivity(activities[newActivityIndex]);
		client.setStatus(activities[newActivityIndex].status);

		previousActivityIndex = newActivityIndex;
	};

	setInterval(updateActivityAndStatus, 5 * 60 * 1000); // 5 minutes
	updateActivityAndStatus();
};