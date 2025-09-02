const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { version } = require('../../../package.json');

module.exports = {
	name: 'boosts',
	permissions: PermissionsBitField.Flags.ManageChannels,
	execute: async (client, msg) => {
		await msg.channel.bulkDelete(48, true);

		await msg.channel.send({ embeds: [new EmbedBuilder().setColor('#E1F2E2').setImage(`${process.env.URL_CDN}/discord/bydgobot/boosts.png?version=${version}`)] });

		msg.channel.send({ embeds: [new EmbedBuilder()
			.setColor('#FFFFFF')
			.setAuthor({ name: 'Co można otrzymać w zamian za ulepszenie serwera? 💗', iconURL: msg.guild.iconURL() })
			.addFields([
				{
					name: '🥉 » Nagrody za 1 poziom',
					value:
						'- 30k kremówek (waluty na ekonomii)\n' +
						'- Ranga <@&1121994534348390441>\n' +
						'- Własna ranga, którą specjalnie dla ciebie zrobimy\n' +
						'- Wolność od Choroszczy na zawsze\n' +
						'- 1 darmowy niewolnik',
				}, {
					name: '🥈 » Nagrody za 2 poziom',
					value:
						'- Wszystko z pierwszego poziomu\n' +
						'- 50k kremówek (waluty na ekonomii)\n' +
						'- Ranga <@&1127462608883171478>\n' +
						'- Jako administracja, rozdamy Twoim znajomym rangę, którą Ci zrobiliśmy za 1 poziom\n' +
						'- 2 darmowych niewolników\n' +
						'- 1 bilet do rozdania dla kolegi dzięki któremu będzie na zawsze wolny od Choroszczy',
				}, {
					name:  '🥇 » Nagrody za 3 poziom',
					value:
						'- Wszystko z 1 i 2 poziomu\n' +
						'- 80k kremówek (waluty na ekonomii)\n' +
						'- Twoja ranga będzie widoczna na samej górze (zaraz pod administracja)\n' +
						'- 3 darmowych niewolników\n' +
						'- 3 bilety do rozdania na wolności od Choroszczy',
				},
			])],
		});
	},
};