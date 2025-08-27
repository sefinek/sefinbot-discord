const { EmbedBuilder } = require('discord.js');
// Helper function to format date

module.exports = {
	name: 'darkweb',
	admin: true,
	execute: async (client, msg) => {
		await msg.channel.bulkDelete(48, true);


		msg.channel.send({ embeds: [new EmbedBuilder()
			.setColor('#124C1D')
			.setAuthor({ name: '🌍 Ciemna strona neta', iconURL: msg.guild.iconURL(), url: process.env.URL_SEFINEK })
			.addFields([
				{
					name: '» O co chodzi z niewolnikami?',
					value: 'Jeśli zdecydujesz się kupić niewolnika, to ten będzie mieć absolutny nakaz słuchania się Ciebie.',
				},
				{
					name: '» Na czym to polega?',
					value: 'Służącego możesz wykorzystywać jedynie do celów serwerowych, nie możesz wyłudzać od niego pieniędzy, nudesów i innych korzyści majątkowych. Wykorzystuj swoich niewolników jedynie na obszarze serwera. A co jeśli niewolnik nie będzie się słuchał? Odpowiedź jest prosta: pójdzie do Choroszczy lub dostanie bana. W takich momentach pieniądze za zakup niewolnika zostaną zwrócone. Jest jeszcze jeden warunek, a mianowicie, jeśli nie będziesz wykorzystywał swojego podwładnego przez dużej niż tydzień, zostanie Ci on całkowicie zabrany.',
				},
				{
					name: '» Jak można uniknąć zostania sprzedanym?',
					value: 'To proste! Trzymaj się zasad. Nie bądź bezbekiem, przygłupem oraz cringem. Zasady naszego serwera znajdziesz na [GitHubie](https://github.com/sefinek/Milosna_Grota/blob/main/Rules.md).',
				},
				{
					name: '» Zasady',
					value:
						'**1.** Można kupić tylko 2 niewolników w miesiącu.\n' +
						'**2.** Każdy może mieć tylko 5 niewolników.\n' +
						'**3.** Jeśli niewolnik nie będzie wykorzystywany przez swojego pana przez tydzień, zostanie on zabrany.\n' +
						'**4.** Niewolnik ma nakaz słuchania się tego, kto go kupił.',
				},
				{
					name: '» Rekrutacja na Kierownika darkweba',
					value: `Wpisz polecenie \`/kierownik-darkweba formularz\`. Dokonaj tego na kanale <#${process.env.CH_KOMENDY}>.\nWięcej informacji na temat różnych posad, znajdziesz na kanale <#${process.env.CH_O_SERWERZE}>. Życzymy powodzenia!`,
				},
			])
			.setImage('https://c.tenor.com/-SV9TjUGabMAAAAC/hacker-python.gif')
			.setFooter({ text: `Ostatnia aktualizacja wiadomości: ${new Date().toLocaleString('pl-PL')}`, iconURL: msg.guild.iconURL() })],
		}).then(m => m.react('1127458528047669258'));
	},
};