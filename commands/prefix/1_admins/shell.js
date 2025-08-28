const { EmbedBuilder } = require('discord.js');
const { exec } = require('node:child_process');

const FORBIDDEN_PATTERNS = /curl|wget|rm\s+-rf/i;

module.exports = {
	name: 'shell',
	aliases: ['sh', 'bash', 'cmd', 'terminal'],
	description: 'Execute shell commands (owner only)',
	ownerOnly: true,
	cooldown: 1000,
	async execute(client, msg, args) {

		if (!args.length) {
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Missing Command')
					.setDescription('Please provide a command to execute.')]
			});
		}

		const command = args.join(' ');
		if (FORBIDDEN_PATTERNS.test(command)) {
			console.log('Shell » Blocked dangerous command:', command);
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Forbidden Command')
					.setDescription('This command contains dangerous patterns.')]
			});
		}

		const loading = await msg.reply({
			embeds: [new EmbedBuilder()
				.setColor('#4169E1')
				.setTitle('⏳ Executing...')
				.setDescription(`\`${command}\``)
				.setFooter({ text: 'Command execution in progress' })]
		});

		exec(command, { timeout: 30000 }, async (error, stdout, stderr) => {
			let output = '';
			if (stdout) output += `**stdout:**\n\`\`\`\n${stdout.slice(0, 1500)}\n\`\`\`\n`;
			if (stderr) output += `**stderr:**\n\`\`\`\n${stderr.slice(0, 1500)}\n\`\`\`\n`;
			if (error) output += `**error:**\n\`\`\`\n${error.message.slice(0, 1500)}\n\`\`\``;

			if (!output) output = '✅ Command executed successfully with no output.';

			const color = error ? '#FF6B6B' : '#00D26A';
			const title = error ? '❌ Command Failed' : '✅ Command Executed';

			await loading.edit({
				embeds: [new EmbedBuilder()
					.setColor(color)
					.setTitle(title)
					.setDescription(`**Command:** \`${command}\`\n\n${output.slice(0, 3500)}${output.length > 3500 ? '\n*...output truncated*' : ''}`)
					.setTimestamp()]
			});

			console.log(`Shell » ${error ? 'Error' : 'Success'}:`, command);
		});
	},
};