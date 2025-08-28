const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'clear',
	aliases: ['purge', 'delete', 'clean'],
	description: 'Clear messages from channel',
	permissions: PermissionsBitField.Flags.ManageMessages,
	cooldown: 3000,
	async execute(client, msg, args) {

		if (!args[0] || isNaN(args[0])) {
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Invalid Amount')
					.setDescription('Please provide a valid number of messages to delete.')
					.addFields([{ name: 'Usage', value: '`!clear <amount>`\n`!clear 10`', inline: false }])]
			});
		}

		const amount = parseInt(args[0]);
		if (amount < 1 || amount > 100) {
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Invalid Range')
					.setDescription('Amount must be between 1 and 100 messages.')]
			});
		}

		try {
			await msg.channel.sendTyping();
			const deleted = await msg.channel.bulkDelete(amount, true);
			
			const successMsg = await msg.channel.send({
				embeds: [new EmbedBuilder()
					.setColor('#00D26A')
					.setTitle('✅ Messages Cleared')
					.setDescription(`Successfully deleted **${deleted.size}** messages from ${msg.channel}`)
					.setFooter({ text: 'This message will be deleted in 5 seconds' })]
			});

			setTimeout(() => successMsg.delete().catch(() => {}), 5000);
		} catch (err) {
			console.warn('Clear » Error:', err.message);
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Clear Failed')
					.setDescription('Failed to delete messages. They might be older than 14 days.')]
			});
		}
	},
};