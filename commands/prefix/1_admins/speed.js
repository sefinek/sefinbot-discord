module.exports = {
	name: 'speed',
	admin: true,
	execute: (_, msg) => {
		for (let x = 1; x < 6; x++) msg.channel.send(x.toString());
	},
};