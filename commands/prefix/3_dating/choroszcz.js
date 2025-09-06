const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const Members = require('../../../database/models/members.model');

module.exports = {
	name: 'choroszcz',
	permissions: PermissionsBitField.Flags.SendMessages,
	execute: async (client, msg, args) => {
		if (!msg.member.roles.cache.has('1127462608883171478') && !msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) return msg.reply('<a:error:1127481079620718635> Nie posiadasz roli Straż Choroszczy.');

		const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLowerCase());
		if (!member) return msg.reply('<a:error:1127481079620718635> Użytkownik nie został odnaleziony.');

		if (member.id === msg.author.id) return msg.reply('<a:error:1127481079620718635> Nie możesz wysłać siebie samego do Choroszczy.');
		if (member.user.bot) return msg.reply('<a:error:1127481079620718635> Wyznaczona osoba jest botem.');
		if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return msg.reply('<a:error:1127481079620718635> Nie możesz wysłać do Choroszczy administratora tego serwera.');
		if (member.roles.cache.has('1127462608883171478')) return msg.reply('<a:error:1127481079620718635> Oznaczony użytkownik jest na tej samej posadzie co Ty.');

		let memberDb = await Members.findOne({ userId: member.user.id });
		if (!memberDb) memberDb = await Members.create({ userId: member.user.id });

		if (memberDb.bydgoszcz) {
			await memberDb.updateOne({ userId: member.user.id, bydgoszcz: false });
			await member.roles.remove(process.env.RO_WIEZIEN_CHOROSZCZY);

			msg.reply({ embeds: [new EmbedBuilder()
				.setColor('#00FF72')
				.setAuthor({ name: `${member.user.tag} nie jest już w Choroszczy`, iconURL: member.displayAvatarURL() })],
			});
		} else {
			const reason = args.slice(1).join(' ');
			if (!reason) return msg.reply('<a:error:1127481079620718635> Podaj powód przeniesienia użytkownika do Choroszczy.');
			if (reason.length < 12 && !msg.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return msg.reply('⚠️ **Wykryto nadużycie**\nMusisz podać konkretny powód przeniesienia użytkownika do Choroszczy. Rozwiń swoją wypowiedź.');

			await memberDb.updateOne({ userId: member.id, bydgoszcz: true });
			await member.roles.add(process.env.RO_WIEZIEN_CHOROSZCZY);

			const choroszcz = msg.guild.channels.cache.get(process.env.CH_CHOROSZCZ);
			await choroszcz.send({
				embeds: [
					new EmbedBuilder()
						.setAuthor({ name: `Witamy w Choroszczy ${member.user.tag}`, iconURL: msg.guild.iconURL() })
						.addFields([{ name: '» Powód przebywania', value: reason }])
						.setThumbnail(member.user.displayAvatarURL()),
				],
				content: `🥀 **[${member}]**`,
			});

			if (msg.channel.id !== process.env.CH_CHOROSZCZ) {
				msg.guild.channels.cache.get(process.env.CH_WYROKI).send({ embeds: [
					new EmbedBuilder()
						.setColor('#FF7800')
						.setAuthor({ name: `Wyrok użytkownika ${member.user.tag}`, iconURL: msg.guild.iconURL() })
						.addFields([
							{ name: '» Osoba', value: `> ${member}`, inline: true },
							{ name: '» Strażnik', value: `> ${msg.author}`, inline: true },
							{ name: '» Powód pobytu w Choroszczy', value: reason },
						])
						.setThumbnail(member.user.displayAvatarURL())],
				}).then(async m => {
					await m.react('1127458528047669258');
					await m.react('1127472967648018502');
					await m.react('1127457966807846912');
					await m.react('1127479376179626104');
				});
			}

			msg.reply({ embeds: [
				new EmbedBuilder()
					.setColor('#005AFF')
					.setAuthor({ name: `${member.user.tag} wyjechał do Choroszczy na badania`, iconURL: member.user.displayAvatarURL() })
					.setDescription(`> Powód jest dostępny do wglądu na kanale <#${process.env.CH_WYROKI}>.`)],
			});
		}
	},
};
