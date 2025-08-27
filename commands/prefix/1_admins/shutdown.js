module.exports = {
	name: 'shutdown',
	admin: true,
	execute: async (client, msg) => {
		await msg.reply(`\\✅ The process was successfully terminated. ${process.env.NODE_ENV === 'production' ? 'PM2 should restart the application shortly.' : 'The bot has been shut down.'}`);
		console.log(`AdmCMD » Administrator '${msg.author.tag}' (${msg.author.id}) terminated the process`);
		process.exit(0);
	},
};