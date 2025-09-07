const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'speed',
	aliases: ['speedtest', 'ping-test'],
	description: 'Test bot response speed',
	cooldown: 2000,
	async execute(client, msg) {
		const start = Date.now();

		const speedEmbed = await msg.reply({ embeds: [new EmbedBuilder()
			.setColor('#4169E1')
			.setTitle('🚀 Speed Test')
			.setDescription('Testing bot response time...')
			.setTimestamp()],
		});

		const responseTime = Date.now() - start;
		const wsLatency = client.ws.ping;

		await speedEmbed.edit({ embeds: [new EmbedBuilder()
			.setColor('#00D26A')
			.setTitle('🚀 Speed Test Results')
			.addFields([
				{ name: '⚡ Response Time', value: `${responseTime}ms`, inline: true },
				{ name: '🌐 WebSocket Latency', value: `${wsLatency}ms`, inline: true },
				{ name: '📊 Status', value: responseTime < 100 ? '🟢 Excellent' : responseTime < 200 ? '🟡 Good' : '🟠 Slow', inline: true },
			])
			.setTimestamp()],
		});
	},
};