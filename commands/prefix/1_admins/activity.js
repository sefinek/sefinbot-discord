const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'activity',
	admin: true,
	execute: (client, msg, args) => {
		if ((/default/gi).test(args[0])) {
			require('../../../scripts/setActivity.js')(client.user);

			return msg.reply({ embeds: [new EmbedBuilder().setColor('#00D26A').setAuthor({ name: '✔️️ Odświeżono status bota', iconURL: msg.author.displayAvatarURL() })] });
		}

		if ((/custom/gi).test(args[0])) {
			if (!args[1]) return msg.reply(`<a:error:1127481079620718635> Oczekiwano argumentu numer 1 ze statusem bota.\n> **${process.env.PREFIX}activity** custom \`dnd\` 1 Choroszcz`);
			if (!args[2] || isNaN(args[2])) return msg.reply(`<a:error:1127481079620718635> Oczekiwano argumentu numer 2 z typem aktywności bota lub podana wartość nie jest liczbą.\n> **${process.env.PREFIX}activity** custom dnd \`1\` Choroszcz`);
			if (!args[3]) return msg.reply(`<a:error:1127481079620718635> Oczekiwano argumentu numer 3 z aktywnością bota.\n> **${process.env.PREFIX}activity** custom dnd 1 \`Choroszcz\``);

			const presence = args.slice(3).join(' ');
			client.user.setActivity({ name: presence, type: parseInt(args[2], 10) });
			client.user.setStatus(args[1]);

			return msg.reply({ embeds: [new EmbedBuilder()
				.setColor('#00D26A')
				.setAuthor({ name: '✔️️ Zmieniono niestandardowy status', iconURL: msg.author.displayAvatarURL() })
				.addFields([
					{ name: '» Status', value: `> ${args[1]}`, inline: true },
					{ name: '» Typ aktywności', value: `> ${args[2]}`, inline: true },
					{ name: '» Aktywność', value: `> ${presence}`, inline: true },
				])],
			});
		}

		msg.reply({ embeds: [
			new EmbedBuilder()
				.setAuthor({ name: 'Coś poszło nie tak', iconURL: msg.author.displayAvatarURL() })
				.setDescription('Oczekiwano argumentu zerowego równającego się `default` lub `custom`.')],
		});
	},
};