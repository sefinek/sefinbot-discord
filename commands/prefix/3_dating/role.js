const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'rola',
	execute: (client, msg, args) => {
		if (!msg.member.roles.cache.has('1121994541973647381')) return msg.reply('<a:error:1127481079620718635> Nie posiadasz roli Dark weber.');

		const member = msg.mentions.members.first();
		const name = member ? `💀┃Niewolnik ${member.user.username}` : args.join(' ');

		msg.guild.roles.create({
			name,
			color: '#3498DB',
			position: 71,
		});

		msg.reply({ embeds: [
			new EmbedBuilder()
				.setColor('#00D26A')
				.setAuthor({ name: '✔️️ Pomyślnie utworzono nową rolę', iconURL: msg.author.displayAvatarURL() })
				.setDescription(`> **Nazwa roli:** ${name}`)],
		});
	},
};