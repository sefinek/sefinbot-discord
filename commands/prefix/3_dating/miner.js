const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Items = require('../../../database/models/items.model');
const Members = require('../../../database/models/Members');

module.exports = {
	name: 'miner',
	permissions: PermissionsBitField.Flags.SendMessages,
	execute: async (client, msg, args) => {
		if (!args[0]) {
			return msg.reply({ embeds: [
				new EmbedBuilder()
					.setColor('#00FF84')
					.setAuthor({ name: 'Pomoc do polecenia miner', iconURL: msg.author.displayAvatarURL() })
					.setDescription('To taka mini alternatywa ekonomii. Za posiadanie określonej ilości surowców możesz coś kupić w sklepie. W razie pytań, administracja służy pomocą.')
					.addFields([
						{ name: '😺 Co chcesz wykopać?', value: `> **${process.env.PREFIX}miner** \`${['drewno', 'patyki', 'kamień', 'złoto', 'żelazo', 'diament'].join('`, `')}\`` },
						{ name: '💼 Ekwipunek', value: `> **${process.env.PREFIX}miner** eq`, inline: true },
						{ name: '🛒 Sklep', value: `> **${process.env.PREFIX}miner** sklep`, inline: true },
					])],
			});
		}

		const items = await Items.find({});

		// Shop
		if (['sklep', 'shop'].includes(args[0].toLowerCase())) {
			const arr = [];
			items.forEach(i => arr.push({ name: `${i.id}. ${i.name}`, value: i.description }));
			console.log(arr);

			return msg.reply({ embeds: [
				new EmbedBuilder()
					.setColor('#0096FF')
					.setAuthor({ name: 'Sklep - Co chcesz kupić lub wymienić?', iconURL: msg.author.displayAvatarURL() })
					.setDescription(`Jeżeli chcesz dokonać transakcji, wpisz \`${process.env.PREFIX}miner kup <Numer przedmiotu>\`.\nAby dowiedzieć się, co oznacza dana emotikona surowca, wpisz \`${process.env.PREFIX}miner eq\`.`)
					.addFields(arr)],
			});
		}

		// Eq
		let memberDb = await Members.findOne({ userId: msg.author.id });
		if (!memberDb) memberDb = await Members.create({ userId: msg.author.id });

		if (['ekwipunek', 'eq'].includes(args[0].toLowerCase())) {
			if (!memberDb) return msg.reply('<a:error:1127481079620718635> Nie wykopałeś jeszcze niczego.');

			return msg.reply({ embeds: [
				new EmbedBuilder()
					.setColor('#00A2FF')
					.setAuthor({ name: `Ekwipunek użytkownika ${msg.author.username}`, iconURL: msg.author.displayAvatarURL() })
					.addFields([
						{ name: '🪵 Drewno', value: `> ${memberDb.miner.wood}`, inline: true },
						{ name: '🪓 Patyki', value: `> ${memberDb.miner.stick}`, inline: true },
						{ name: '🪨 Kamienie', value: `> ${memberDb.miner.stone}`, inline: true },
						{ name: '🪙 Złoto', value: `> ${memberDb.miner.gold}`, inline: true },
						{ name: '💮 Żelazo', value: `> ${memberDb.miner.iron}`, inline: true },
						{ name: '💎 Diamenty', value: `> ${memberDb.miner.diamond}`, inline: true },
						{ name: '📝 Ostatnia aktualizacja danych', value: `> ${new Date(memberDb.updatedAt).toLocaleString('pl-PL')}` },
					])],
			});
		}

		// Buy
		if (['kup', 'zakup', 'buy'].includes(args[0].toLowerCase())) {
			if (!args[1]) return msg.reply('<a:error:1127481079620718635> Wprowadź cyfrę przedmiotu, którego chcesz kupić.');

			const itemId = parseInt(args[1]);
			const item = items.find(i => i.id === itemId);

			if (!item) {
				return msg.reply('<a:error:1127481079620718635> Wprowadzona cyfra przedmiotu jest błędna.');
			}

			return msg.reply({ embeds: [
				new EmbedBuilder()
					.setColor('#FFA500')
					.setAuthor({ name: 'Funkcja kupowania jest tymczasowo niedostępna', iconURL: msg.author.displayAvatarURL() })
					.setDescription(`Przedmiot **${item.name}** zostanie dodany w przyszłej aktualizacji.`),
			] });
		}


		// Random material
		const result = (word, count) => {
			switch (true) {
			case count > 0: msg.reply(`<a:success:1127481086499377282> Zyskano **${count}** ${word}.`); break;
			case count === 0: msg.reply('🙀 Ani nagrody, ani strat!'); break;
			case count < 0: msg.reply(`<a:error:1127481079620718635> Stracono **${String(count).replace('-', '')}** ${word}.`); break;
			default: msg.reply('❌ **Coś poszło nie tak**');
			}
		};

		switch (args[0]) {
		case 'drewno': case 'drewna': {
			const number = Math.floor(Math.random() * (68 - -35 + 1)) + -35;
			await memberDb.updateOne({ $set: { 'miner.wood': memberDb.miner.wood + number } });

			await result('drewien', number);
			break;
		}
		case 'patyk': case 'patyki': {
			const number = Math.floor(Math.random() * (67 - -36 + 1)) + -36;
			await memberDb.updateOne({ $set: { 'miner.stick': memberDb.miner.stick + number } });

			await result('patyków', number);
			break;
		}
		case 'kamień': case 'kamien': case 'kamienie': {
			const number = Math.floor(Math.random() * (66 - -37 + 1)) + -37;
			await memberDb.updateOne({ $set: { 'miner.stone': memberDb.miner.stone + number } });

			await result('kamieni', number);
			break;
		}
		case 'złoto': case 'zloto': {
			const number = Math.floor(Math.random() * (65 - -38 + 1)) + -38;
			await memberDb.updateOne({ $set: { 'miner.gold': memberDb.miner.gold + number } });

			await result('złota', number);
			break;
		}
		case 'żelazo': case 'zelazo': {
			const number = Math.floor(Math.random() * (64 - -39 + 1)) + -39;
			await memberDb.updateOne({ $set: { 'miner.iron': memberDb.miner.iron + number } });

			await result('żelaza', number);
			break;
		}
		case 'diament': case 'diamenty': {
			const number = Math.floor(Math.random() * (63 - -40 + 1)) + -40;
			await memberDb.updateOne({ $set: { 'miner.diamond': memberDb.miner.diamond + number } });

			await result('diamentów', number);
			break;
		}
		default: msg.reply('<a:error:1127481079620718635> Wprowadzony argument jest nieprawidłowy.');
		}
	},
};