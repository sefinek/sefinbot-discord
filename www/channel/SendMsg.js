const { EmbedBuilder } = require('discord.js');
const prefix = '[SendUpdateMsg]:';

module.exports = async (req, res) => {
	const { guildId, roles, channelId, author, title, address, category, description, message } = req.body;

	const channel = await req.bot.channels.cache.get(channelId);
	if (!channel) return res.status(400).send({ success: false, status: 400, message: `Channel ${channelId} was not found` });
	if (!title || !message) return res.status(400).send({ success: false, status: 400, message: 'subject `title` or `message`' });

	const guild = req.bot.guilds.cache.get(guildId);

	try {
		if (message.length <= 4096) {
			await channel.send({
				content: `<@&${roles.stellaPlus}> <@&${roles.patreon}>`,
				embeds: [
					new EmbedBuilder()
						.setAuthor({ name: title, iconURL: guild.iconURL(), url: address })
						.setDescription(message)
						.setFooter({ text: `Author: ${author.username} ${category ? `• Category: ${category}` : ''}`, iconURL: author.avatar })
						.setTimestamp(),
				],
			});
		} else {
			await channel.send({
				content: `<@&${roles.stellaPlus}> <@&${roles.patreon}>`,
				embeds: [
					new EmbedBuilder()
						.setAuthor({ name: title, iconURL: guild.iconURL(), url: address })
						.setDescription(`${description}\n\n\nSee: ${address}`)
						.setFooter({ text: `Author: ${author.username} ${category ? `• Category: ${category}` : ''}`, iconURL: author.avatar })
						.setTimestamp(),
				],
			});
		}

		console.log(prefix, `✔️🔔 Successfully sent a Discord message to the channel #${channel.name}; Title: ${title}`);
		res.sendStatus(200);
	} catch (err) {
		console.error(err);
		res.status(500).send({ success: false, status: 500, message: err.message });
	}
};