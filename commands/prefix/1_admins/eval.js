const { EmbedBuilder } = require('discord.js');
const { inspect } = require('node:util');

const FORBIDDEN_PATTERNS = /_(?:WEBHOOK|URL)|config|TOKEN|\.env/i;

module.exports = {
	name: 'eval',
	aliases: ['e', 'evaluate'],
	description: 'Evaluate JavaScript code (owner only)',
	ownerOnly: true,
	cooldown: 1000,
	async execute(client, msg, args) {

		if (!args.length) {
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Missing Code')
					.setDescription('Please provide JavaScript code to evaluate.')],
			});
		}

		const script = args.join(' ');
		if (FORBIDDEN_PATTERNS.test(script)) {
			console.log('Eval » Blocked unauthorized action:', script);
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Forbidden Pattern')
					.setDescription('This code contains forbidden patterns.')],
			});
		}

		const loading = await msg.reply({
			embeds: [new EmbedBuilder()
				.setColor('#4169E1')
				.setTitle('⏳ Evaluating...')
				.setDescription('Please wait while the code is being executed.')],
		});

		try {
			const evaled = eval(script);
			const output = inspect(evaled, { depth: 0 });

			await loading.edit({
				embeds: [new EmbedBuilder()
					.setColor('#00D26A')
					.setTitle('✅ Evaluation Successful')
					.addFields([
						{ name: '📥 Input', value: `\`\`\`js\n${script.slice(0, 1015)}\`\`\`` },
						{ name: '📤 Output', value: `\`\`\`js\n${output.slice(0, 1015)}\`\`\`` },
					])
					.setTimestamp()],
			});

			console.log('Eval » Success:', script);
		} catch (err) {
			await loading.edit({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Evaluation Failed')
					.addFields([
						{ name: '📥 Input', value: `\`\`\`js\n${script.slice(0, 1015)}\`\`\`` },
						{ name: '📤 Error', value: `\`\`\`js\n${err.message.slice(0, 1015)}\`\`\`` },
					])
					.setTimestamp()],
			});

			console.log('Eval » Error:', err.message);
		}
	},
};