const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'slowmode',
	execute: (client, msg, args) => {
		if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return msg.reply('<a:error:1127481079620718635> Nie posiadasz uprawnień **Zarządzanie kanałami**.');
		if (isNaN(args[0])) return msg.reply('<a:error:1127481079620718635> Oczekiwano liczby.');

		if (!args[0]) return msg.channel.setRateLimitPerUser(0).then(() => msg.channel.send('<a:success:1127481086499377282> Wyłączono tryb powolny na tym kanale.'));

		msg.channel.setRateLimitPerUser(args[0]).then(() => msg.channel.send(`<a:success:1127481086499377282> Zmieniono wartość trybu powolnego na \`${args[0]}s\`; Kanał ${msg.channel};`));
	},
};