const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const Announcements = require('../../../database/models/Announcements.js');

module.exports = {
	name: 'ogl',
	execute: async (client, msg, args) => {
		if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return msg.reply('<a:error:1127481079620718635> Nie posiadasz uprawnień **Zarządzanie wiadomościami**.');

		if (!args[0] || !args[1]) return msg.reply(`<a:error:1127481079620718635> **Oczekiwano argumentów**\n> **${process.env.PREFIX}ogl** <add/remove> <id> <reason>`);

		const data = await Announcements.findById(args[1]).catch(err => msg.reply(`<a:error:1127481079620718635> **Podane ID jest błędne**\n\`\`\`js\n${err.message}\`\`\``));
		if (!data) return msg.reply('<a:error:1127481079620718635> **Dane w bazie nie zostały odnalezione**');

		const author = msg.guild.members.cache.get(data.authorId);
		if (!author) return msg.reply('<a:error:1127481079620718635> **Autor nie został odnaleziony**');

		if (data.status !== 201) return msg.reply(`<a:error:1127481079620718635> **Ogłoszenie ${author.user.username} zostało już sprawdzone**`);

		const review = msg.guild.channels.cache.get(process.env.CH_FORMULARZE);
		if (!review) return msg.reply('<a:error:1127481079620718635> **Kanał 『💗』do-sprawdzenia nie został odnaleziony**');

		const reviewMsg = await review.messages.fetch(data.discord.reviewId);
		if (!reviewMsg) return msg.reply('<a:error:1127481079620718635> **Wymagana wiadomość na kanale 『💗』do-sprawdzenia nie została odnaleziona**');

		// Delete message
		msg.delete();

		// Add
		if (args[0].toLowerCase() === 'add') {
			const annMsg = await msg.guild.channels.cache.get(process.env.CH_OGLOSZENIA_RANDKI).send({
				content: `**[${author.user}]**`,
				embeds: [
					new EmbedBuilder()
						.setColor('#0078FF')
						.setAuthor({ name: `Ogłoszenie użytkownika ${author.user.tag}`, iconURL: msg.guild.iconURL() })
						.addFields([
							{ name: '💗 » Szukam', value: data.announcement.type },
							{ name: '📝 » Opis', value: data.announcement.bio },
							{ name: '✍️ » Treść ogłoszenia', value: data.announcement.desc },
						])
						.setImage(data.announcement.img)
						.setThumbnail(author.displayAvatarURL())
						.setTimestamp()
						.setFooter({ text: `ID: ${data.id} • Wersja: ${client.version}`, iconURL: client.user.displayAvatarURL() })],
			});

			await annMsg.react('❤');
			await annMsg.startThread({ name: `Skomentuj ogłoszenie od ${author.user.username}`, autoArchiveDuration: 4320 });
			await data.updateOne({ status: 200, adminId: msg.author.id, 'discord.messageId': annMsg.id });

			author.send({ embeds: [
				new EmbedBuilder()
					.setColor('#00D26A')
					.setAuthor({ name: 'Twoje ogłoszenie zostało zatwierdzone', iconURL: msg.guild.iconURL() })
					.setDescription(`Przychodzę do Ciebie z dobrą informacją! Twoje ogłoszenie zostało zatwierdzone przez jednego członka z naszej ekipy o nazwie **${msg.author.username}**. Serdecznie dziękujemy i życzymy powodzenia w szukaniu!\n\n> Kliknij [tutaj](${annMsg.url}), aby skoczyć do wiadomości.`)
					.setThumbnail(author.displayAvatarURL())],
			});

			try {
				await reviewMsg.react('1127457986697240698');
			} catch (err) {
				console.warn('Server » Reakcja \'add\' nie została dodana do wiadomości.', err.message);
			}

			return msg.channel.send({ embeds: [
				new EmbedBuilder()
					.setColor('#00D26A')
					.setAuthor({ name: `✔️️ Zatwierdzono ogłoszenie od ${author.user.username}`, iconURL: msg.author.displayAvatarURL() })
					.setDescription(`[[Skocz do wiadomości]](${annMsg.url})`)
					.setThumbnail(author.user.displayAvatarURL())
					.setFooter({ text: `${msg.author.tag} • ID: ${data.id}` })],
			});
		}

		// Discard
		if (args[0].toLowerCase() === 'discard') {
			try {
				await reviewMsg.react('1127457937678409789');
			} catch (err) {
				console.warn('Server » Reakcja \'discard\' nie została dodana do wiadomości.', err.message);
			}

			const reason = args.slice(2).join(' ') || false;
			await data.updateOne({ status: 500, adminId: msg.author.id, canceledStr: reason });

			author.send({ embeds: [
				new EmbedBuilder()
					.setColor('#FFCC00')
					.setAuthor({ name: 'Twoje ogłoszenie nie zostało przyjęte', iconURL: msg.guild.iconURL() })
					.setDescription(`Przepraszamy, lecz niestety nie możemy zaakceptować Twojego ogłoszenia. Odrzucił je administrator **${msg.author.username}**. Poniżej znajdziesz powód. Jeżeli masz jakieś pytania - śmiało pytaj.\n\n\`\`\`${reason || 'Powód nie został podany.'}\`\`\`  `)
					.setThumbnail(author.displayAvatarURL())],
			});

			return msg.channel.send({ embeds: [
				new EmbedBuilder()
					.setColor('#003CFF')
					.setAuthor({ name: `❌ Anulowano ogłoszenie od ${author.user.username}`, iconURL: msg.author.displayAvatarURL() })
					.addFields([{ name: '» Powód odrzucenia', value: reason }])
					.setThumbnail(author.user.displayAvatarURL())
					.setFooter({ text: `${msg.author.tag} • ID: ${data.id}` })],
			});
		}

		msg.reply('<a:error:1127481079620718635> **Pomylono jakiś argument**');
	},
};