const { EmbedBuilder } = require('discord.js');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	name: 'shutdown',
	aliases: ['stop', 'exit', 'kill'],
	description: 'Shutdown the bot process',
	cooldown: 4000,
	async execute(client, msg) {
		await msg.reply({ embeds: [new EmbedBuilder()
			.setColor('#FF6B6B')
			.setTitle('🔴 Shutting Down')
			.setDescription(`Bot process terminated by ${msg.author.username}`)
			.addFields([
				{
					name: 'Environment',
					value: isProd ? '🌐 Production' : '🔧 Development',
					inline: true,
				},
				{
					name: 'Expected Behavior',
					value: isProd ? 'PM2 will restart shortly' : 'Manual restart required',
					inline: true,
				},
			])
			.setTimestamp()],
		});

		console.log(`Shutdown » Process terminated by ${msg.author.username} (${msg.author.id})`);
		process.exit(0);
	},
};