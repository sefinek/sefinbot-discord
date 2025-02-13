const activities = [
	{ name: 'meow~~? 🐈', type: 0, status: 'online' },
	{ name: '🎶🎵🎵🎶', type: 2, status: 'idle' },
	{ name: 'https://sefinek.net', type: 3, status: 'dnd' },
	{ name: 'you', type: 3, status: 'dnd' },
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

	setInterval(updateActivityAndStatus, 50000); // 50 seconds
	updateActivityAndStatus();
};