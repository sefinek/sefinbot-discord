const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'clear',
	execute: async (client, msg, args) => {
		if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return msg.reply('<a:error:1127481079620718635> Nie posiadasz uprawnień **Zarządzanie wiadomościami**.');
		if (!args[0]) return msg.reply('<a:error:1127481079620718635> Podaj liczbę wiadomości do usunięcia.');
		if (isNaN(args[0])) return msg.reply('<a:error:1127481079620718635> Parametr musi być liczbą.');

		await msg.channel.sendTyping();

		try {
			await msg.channel.bulkDelete(args[0], true);
		} catch (err) {
			msg.reply('<a:error:1127481079620718635> Wystąpił błąd podczas usuwania wiadomości.', err.message);
			return console.warn(err);
		}

		msg.channel.send(`<a:success:1127481086499377282> Usunięto **${args[0]}** wiadomości na kanale ${msg.channel}.`).then(toDel => setTimeout(() => toDel.delete(), 3000));
	},
};