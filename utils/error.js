module.exports = (EmbedBuilder, msg, err) => {
	const embed = new EmbedBuilder()
		.setColor('#FE3C3A')
		.setAuthor({ name: 'Oh no! It looks like something went wrong.', iconURL: process.env.ERR })
		.setDescription('We sincerely apologize for the issues. If this error persists, please contact the administrator of this server.');
	msg.channel.send({ embeds: [embed] });

	console.error(err);
};