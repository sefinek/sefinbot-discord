const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'shutdown',
	aliases: ['stop', 'exit', 'kill'],
	description: 'Shutdown the bot process',
	cooldown: 5000,
	async execute(client, msg) {
		const isProd = process.env.NODE_ENV === 'production';
		
		await msg.reply({
			embeds: [new EmbedBuilder()
				.setColor('#FF6B6B')
				.setTitle('🔴 Shutting Down')
				.setDescription(`Bot process terminated by ${msg.author.tag}`)
				.addFields([
					{ 
						name: 'Environment', 
						value: isProd ? '🌐 Production' : '🔧 Development', 
						inline: true 
					},
					{ 
						name: 'Expected Behavior', 
						value: isProd ? 'PM2 will restart shortly' : 'Manual restart required', 
						inline: true 
					}
				])
				.setTimestamp()]
		});

		console.log(`Shutdown » Process terminated by ${msg.author.tag} (${msg.author.id})`);
		process.exit(0);
	},
};