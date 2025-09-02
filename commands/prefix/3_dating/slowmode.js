const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'slowmode',
	aliases: ['slow', 'ratelimit'],
	description: 'Set channel slowmode',
	permissions: PermissionsBitField.Flags.ManageChannels,
	cooldown: 3000,
	async execute(client, msg, args) {
		if (!args[0]) {
			await msg.channel.setRateLimitPerUser(0);
			return msg.reply({ embeds: [new EmbedBuilder()
				.setColor('#00D26A')
				.setTitle('✅ Slowmode Disabled')
				.setDescription(`Slowmode has been disabled in ${msg.channel}`)],
			});
		}

		const seconds = parseInt(args[0]);
		if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
			return msg.reply({ embeds: [new EmbedBuilder()
				.setColor('#FF6B6B')
				.setTitle('❌ Invalid Time')
				.setDescription('Slowmode must be between 0 and 21600 seconds (6 hours).')
				.addFields([{ name: 'Usage', value: '`!slowmode <seconds>`\n`!slowmode 5` or `!slowmode` (to disable)', inline: false }])],
			});
		}

		await msg.channel.setRateLimitPerUser(seconds);
		return msg.reply({ embeds: [new EmbedBuilder()
			.setColor('#00D26A')
			.setTitle('✅ Slowmode Updated')
			.setDescription(`Slowmode set to **${seconds}** seconds in ${msg.channel}`)],
		});
	},
};