const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'activity',
	aliases: ['status', 'presence'],
	description: 'Set bot activity and status',
	cooldown: 3000,
	async execute(client, msg, args) {
		if (!args.length) {
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Missing Arguments')
					.setDescription('Usage: `!activity <default|custom> [status] [type] [activity]`')
					.addFields([
						{ name: 'Examples', value: '`!activity default`\n`!activity custom dnd 1 Choroszcz`', inline: false },
					])],
			});
		}

		const mode = args[0].toLowerCase();

		if (mode === 'default') {
			require('../../../scripts/setActivity.js')(client.user);
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#00D26A')
					.setTitle('✅ Status Reset')
					.setDescription('Bot activity has been reset to default.')],
			});
		}

		if (mode === 'custom') {
			if (!args[1] || !args[2] || isNaN(args[2]) || !args[3]) {
				return msg.reply({
					embeds: [new EmbedBuilder()
						.setColor('#FF6B6B')
						.setTitle('❌ Invalid Arguments')
						.setDescription('Usage: `!activity custom <status> <type> <activity>`')
						.addFields([
							{ name: 'Example', value: '`!activity custom dnd 1 Choroszcz`', inline: false },
						])],
				});
			}

			const [, status, type, ...activityParts] = args;
			const activity = activityParts.join(' ');

			client.user.setActivity({ name: activity, type: parseInt(type, 10) });
			client.user.setStatus(status);

			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#00D26A')
					.setTitle('✅ Custom Status Set')
					.addFields([
						{ name: 'Status', value: `\`${status}\``, inline: true },
						{ name: 'Type', value: `\`${type}\``, inline: true },
						{ name: 'Activity', value: `\`${activity}\``, inline: true },
					])],
			});
		}

		return msg.reply({
			embeds: [new EmbedBuilder()
				.setColor('#FF6B6B')
				.setTitle('❌ Invalid Mode')
				.setDescription('Mode must be `default` or `custom`.')],
		});
	},
};