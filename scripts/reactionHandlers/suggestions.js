const { EmbedBuilder } = require('discord.js');

module.exports = {
	async handlePropozycje(msg) {
		try {
			await msg.react('👍');
			await msg.react('👎');

			// Create thread for discussion about the suggestion
			const thread = await msg.startThread({
				name: `💡 Propozycja: ${msg.content.substring(0, 50)}...`,
				reason: `Propozycja użytkownika ${msg.author.tag} (${msg.author.id}).`,
				autoArchiveDuration: 10080, // 7 days
			});

			await thread.send({
				embeds: [
					new EmbedBuilder()
						.setColor('#3498DB')
						.setDescription('💬 **Dyskusja o propozycji**\n\nTutaj możesz przedyskutować tę propozycję z innymi członkami społeczności!')
						.addFields([
							{
								name: '👍 Podoba Ci się?',
								value: 'Zagłosuj pozytywnie i napisz dlaczego!',
								inline: true,
							},
							{
								name: '👎 Nie podoba Ci się?',
								value: 'Zagłosuj negatywnie i napisz konstruktywną krytykę!',
								inline: true,
							},
						])
						.setFooter({
							text: `Propozycja od: ${msg.author.tag}`,
							iconURL: msg.author.displayAvatarURL(),
						}),
				],
			});
		} catch (err) {
			console.error(`Reaction » Failed to handle propozycje for ${msg.author.tag}:`, err.message);
		}
	},

	async handleMemy(msg) {
		if (msg.attachments.size > 0 || msg.content.includes('http')) {
			try {
				await msg.react('👍');
				await msg.react('👎');
			} catch (err) {
				console.error(`Reaction » Failed to handle memy for ${msg.author.tag}:`, err.message);
			}
			return;
		}

		try {
			const errorEmbed = new EmbedBuilder()
				.setColor('#FFA500')
				.setAuthor({ name: `${msg.author.username}, to nie jest mem!`, iconURL: msg.author.displayAvatarURL() })
				.setDescription('Na tym kanale dzielimy się memami (zdjęciami, gifami lub linkami). Dodaj załącznik lub link! 😄')
				.setThumbnail(msg.guild.iconURL());

			const errorMsg = await msg.channel.send({ embeds: [errorEmbed] });

			await msg.delete();
			setTimeout(() => errorMsg.delete(), 10000);
		} catch (err) {
			console.error('Reaction » Failed to send memy error message:', err.message);
		}
	},
};