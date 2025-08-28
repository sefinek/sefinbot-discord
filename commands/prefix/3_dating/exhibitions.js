const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'wystaw',
	aliases: ['exhibition', 'sell'],
	description: 'Put user for sale (Dark weber only)',
	permissions: PermissionsBitField.Flags.ManageMessages,
	cooldown: 3000,
	async execute(client, msg, args) {
		if (!msg.member.roles.cache.has('1121994541973647381') && !msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) return msg.reply('<a:error:1127481079620718635> Nie posiadasz roli Dark weber.');

		if (!args[0]) return msg.reply(`<a:error:1127481079620718635> **Prawidłowe użycie:** ${process.env.PREFIX}wystaw <@Osoba> <Cena> <Zastosowania>`);

		const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLowerCase());
		if (!member) return msg.reply('<a:error:1127481079620718635> Podany użytkownik nie został odnaleziony.');

		if (member.id === msg.author.id) return msg.reply('<a:error:1127481079620718635> Nie możesz wystawić siebie samego.');
		if (member.user.bot) return msg.reply('<a:error:1127481079620718635> Wyznaczona osoba jest botem.');
		if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return msg.reply('<a:error:1127481079620718635> Nie możesz wystawić administratora tego serwera.');
		if (member.roles.cache.has('1121994541973647381')) return msg.reply('<a:error:1127481079620718635> Oznaczony użytkownik jest na tej samej posadzie co Ty.');

		if (!args[1]) return msg.reply('<a:error:1127481079620718635> Cena nie została podana.');
		if (isNaN(args[1])) return msg.reply('<a:error:1127481079620718635> Podana cena nie jest liczbą. Pamiętaj, by zastąpić przecinek kropką.');

		const text = args.slice(2).join(' ');
		if (!text) return msg.reply('<a:error:1127481079620718635> Zastosowania nie zostały podane.');

		msg.guild.channels.cache.get('1127703409932382228').send({ embeds: [new EmbedBuilder()
			.setColor('#36393F')
			.addFields([
				{ name: '» Na sprzedaż', value: `> ${member}`, inline: true },
				{ name: '» Sprzedawca', value: `> ${msg.author}`, inline: true },
				{ name: '» Cena', value: `> **${args[1]}** <:kremowka:1127459149899366550>`, inline: true },
				{ name: '» Zastosowania i funkcje', value: text },
			])
			.setThumbnail(member.user.displayAvatarURL())
			.setFooter({ text: 'Jeżeli chcesz zakupić tego niewolnika, skontaktuj się ze sprzedającym.' })],
		}).then(m => m.react('1127479274497130666'));



		if (msg.channel.id === '1127703409932382228') return msg.delete();

		msg.reply({ embeds: [
			new EmbedBuilder()
				.setColor('#005AFF')
				.setAuthor({ name: `Pomyślnie wystawiono użytkownika ${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
				.setDescription('> Sprawdź kanał <#1127703409932382228>.')],
		});
	},
};