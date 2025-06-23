const { EmbedBuilder } = require('discord.js');
const prefix = '[SendLogMsg]:';

module.exports = async (req, res) => {
	const { channelId, title, message, image } = req.body;

	// Get Discord channel & check subject
	const channel = await req.bot.channels.cache.get(channelId);
	if (!channel) return res.status(400).send({ success: false, status: 400, message: `Channel ${channelId} was not found` });
	if (!title || !message) return res.status(400).send({ success: false, status: 400, message: 'Missing `title` or `message`' });

	try {
		// Send message
		await channel.send({ embeds: [
			new EmbedBuilder()
				.setAuthor({ name: title, iconURL: image })
				.setDescription(message)],
		});

		res.sendStatus(200);
		console.log(prefix, `Successfully sent a Discord message to the log channel #${channel.name}; Title: ${title}`);
	} catch (err) {
		res.status(500).send({ success: false, status: 500, message: err.message });
	}
};