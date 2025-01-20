const { EmbedBuilder } = require('discord.js');
const fetchDiscordUser = require('./scripts/fetchDiscordUser.js');
const prefix = '[SendDirectMsg]:';

module.exports = async (req, res) => {
	const { guildId, userId, subject, message } = req.body;

	try {
		// Get Discord user
		const data = await fetchDiscordUser(req, res, guildId, userId);
		if (!data.success) {
			console.warn(data);
			return res.status(data.status).send(data);
		}

		// Send message
		await data.member.send({ embeds: [
			new EmbedBuilder()
				.setAuthor({ name: subject, iconURL: data.guild.iconURL() })
				.setDescription(message)
				.setFooter({ text: 'If you don\'t want such messages, adjust your settings in the dashboard', iconURL: data.member.displayAvatarURL() })],
		});

		console.log(prefix, `✔️🔵 Successfully sent a Discord message to ${data.member.user.username} (${data.member.user.id}); Subject: ${subject}`);
		res.json({ success: true, username: data.member.user.username, id: data.member.user.id });
	} catch (err) {
		if (err.code === 50007) {
			console.log(prefix, err.message);
			res.status(200).send({ success: true, status: 200, message: err.message });
		} else {
			console.error(prefix, err);
			res.status(500).send({ success: false, status: 500, message: err });
		}
	}
};