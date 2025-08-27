const { EmbedBuilder } = require('discord.js');
const { exec } = require('node:child_process');

// grex "wget" "curl"
const FORBIDDEN_PATTERNS = /curl|wget/i;

module.exports = {
	name: 'shell',
	admin: true,
	execute: async (client, msg, args) => {
		if (msg.author.id !== process.env.BOT_OWNER) {
			msg.channel.send('\\❎ **Administrative Session**\nOnly the bot owner can use this command.');
			return console.log('ShellC » Only the bot creator can use the \'shell\' command');
		}

		if (!args.length) return msg.channel.send('\\❎ **Administrative Session**\nThis command requires arguments.');

		const cmd = args.join(' ');
		if (FORBIDDEN_PATTERNS.test(cmd)) {
			msg.channel.send('\\❎ **Administrative Session**\nThis method is not allowed.');
			return console.log('ShellC » ✘ Undesirable actions:', cmd);
		}

		const loading = await msg.channel.send({ embeds: [new EmbedBuilder().setColor('#4169E1').setAuthor({ name: 'Please wait...', iconURL: process.env.LOA })] });

		exec(cmd, (err, stdout, stderr) => {
			if (err) {
				loading.edit({
					embeds: [new EmbedBuilder()
						.setColor('#F92F60')
						.addFields([{ name: '\\❌ Command Execution Failed', value: `\`\`\`js\n${err.toString().slice(0, 1015)}\`\`\`` }]),
					],
				});
				return console.log('ShellC » ✘ Failure:', cmd);
			}

			if (stdout) console.log(`Stdout » ${stdout}`);
			if (stderr) console.log(`Stderr » ${stderr}`);

			loading.edit({
				embeds: [new EmbedBuilder()
					.setColor('#00A6ED')
					.setAuthor({ name: '📥 Command Executed - Shell', iconURL: msg.author.displayAvatarURL() })
					.setDescription(`\`\`\`md\n${stdout.slice(0, 4087)}\`\`\``)
					.addFields([{ name: '» Stderr', value: `\`\`\`js\n${stderr.slice(0, 1015)}\`\`\`` }]),
				],
			});

			console.log('ShellC » ✔️ Success:', cmd);
		});
	},
};