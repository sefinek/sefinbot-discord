const { EmbedBuilder } = require('discord.js');

module.exports = {
	async handlePokazRyjek(msg) {
		if (msg.attachments.size > 0) {
			try {
				await msg.react('😍');
				await msg.react('😕');
				await msg.react('❤️');

				const thread = await msg.startThread({
					name: `[${msg.author.username}]: Komentarze`,
					reason: `Zdjęcie użytkownika ${msg.author.tag} (${msg.author.id}).`,
					autoArchiveDuration: 4320,
				});

				await thread.send({
					embeds: [
						new EmbedBuilder()
							.setColor('#FF69B4')
							.setDescription('Tutaj możesz skomentować to zdjęcie! 📸✨')
							.setFooter({
								text: `Zdjęcie nadesłane przez: ${msg.author.tag} | ID: ${msg.author.id} | Załączników: ${msg.attachments.size}`,
								iconURL: msg.author.displayAvatarURL(),
							}),
					],
				});
			} catch (err) {
				await this.sendErrorMessage(msg, 'Nie mogliśmy przetworzyć Twojego zdjęcia. Spróbuj ponownie!');
				console.error(`Reaction » Failed to handle pokaz-ryjek for ${msg.author.tag}:`, err.message);
			}
			return;
		}

		await this.sendErrorMessage(msg, 'Na tym kanale możesz publikować tylko zdjęcia! 📸');
	},

	async handlePrzedstawSie(msg) {
		const REQUIRED_LENGTH = 68;

		if (msg.content.length >= REQUIRED_LENGTH) {
			try {
				await msg.react('❤️');

				const thread = await msg.startThread({
					name: `[${msg.author.username}]: Komentarze`,
					reason: `Przedstawienie się użytkownika ${msg.author.tag} (${msg.author.id}).`,
					autoArchiveDuration: 4320,
				});

				await thread.send({
					embeds: [
						new EmbedBuilder()
							.setColor('#00D26A')
							.setDescription('Tutaj możesz skomentować to przedstawienie się! 💬\n\nPamiętaj o przestrzeganiu regulaminu serwera.')
							.setFooter({ text: 'Bądź miły dla innych członków społeczności!' }),
					],
				});
			} catch (err) {
				console.error(`Reaction » Failed to handle przedstaw-sie for ${msg.author.tag}:`, err.message);
			}
			return;
		}

		await this.sendErrorMessage(msg, `Twoje przedstawienie się jest za krótkie! Napisz co najmniej ${REQUIRED_LENGTH} znaków, aby inni mogli Cię lepiej poznać. ✍️`);
	},

	async handleWaszeZwierzaki(msg) {
		if (msg.attachments.size > 0) {
			try {
				await msg.react('🐾');
				await msg.react('❤️');
				await msg.react('😍');

				const thread = await msg.startThread({
					name: `[${msg.author.username}]: O zwierzaku`,
					reason: `Zdjęcie zwierzaka użytkownika ${msg.author.tag} (${msg.author.id}).`,
					autoArchiveDuration: 4320,
				});

				await thread.send({
					embeds: [
						new EmbedBuilder()
							.setColor('#8B4513')
							.setDescription('Jakie słodkie zwierzątko! 🐾 Opowiedz nam o nim więcej!')
							.setFooter({
								text: `Zdjęcie nadesłane przez: ${msg.author.tag}`,
								iconURL: msg.author.displayAvatarURL(),
							}),
					],
				});
			} catch (err) {
				console.error(`Reaction » Failed to handle wasze-zwierzaki for ${msg.author.tag}:`, err.message);
			}
			return;
		}

		await this.sendErrorMessage(msg, 'Na tym kanale dzielimy się zdjęciami naszych zwierzątek! 🐾📸');
	},

	async handleLikeDislike(msg) {
		if (msg.attachments.size > 0) {
			try {
				await msg.react('👍');
				await msg.react('👎');
			} catch (err) {
				console.error(`Reaction » Failed to handle ${msg.channel.name} for ${msg.author.tag}:`, err.message);
			}
			return;
		}

		await this.sendErrorMessage(msg, 'Na tym kanale pokazujemy screenshots naszych pulpitów! 💻📸');
	},

	async sendErrorMessage(msg, description) {
		try {
			const errorEmbed = new EmbedBuilder()
				.setColor('#FF6B6B')
				.setAuthor({ name: `${msg.author.username}, ta akcja nie jest możliwa`, iconURL: msg.author.displayAvatarURL() })
				.setDescription(description)
				.setThumbnail(msg.guild.iconURL());

			const errorMsg = await msg.channel.send({ embeds: [errorEmbed] });

			await msg.delete();
			setTimeout(() => errorMsg.delete(), 15000);

			console.log(`Reaction » User ${msg.author.tag} tried invalid action in ${msg.channel.name}: ${msg.content}`);
		} catch (err) {
			console.error('Reaction » Failed to send error message:', err.message);
		}
	},
};