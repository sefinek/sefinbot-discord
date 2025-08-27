const { EmbedBuilder } = require('discord.js');
const { inspect } = require('node:util');

// grex "_WEBHOOK" "_URL" "config" "TOKEN" ".env"
const FORBIDDEN_PATTERNS = /_(?:WEBHOOK|URL)|config|TOKEN|\.env/i;

module.exports = {
	name: 'eval',
	admin: true,
	execute: async (client, msg, args) => {
		if (msg.author.id !== process.env.BOT_OWNER) {
			msg.channel.send('\\❎ **Admin Session**\nOnly the bot owner can use this command.');
			return console.log('EvalCM » Only the bot creator can use the \'eval\' command');
		}

		if (!args.length) return msg.channel.send('\\❎ **Admin Session**\nThis command requires arguments.');

		const script = args.join(' ');
		if (FORBIDDEN_PATTERNS.test(script)) {
			msg.channel.send('\\❎ **Admin Session**\nThis method is not allowed.');
			return console.log('EvalCM » ✘ Unauthorized actions:', script);
		}

		const loading = await msg.channel.send({ embeds: [new EmbedBuilder().setColor('#4169E1').setAuthor({ name: 'Please wait...', iconURL: process.env.LOA })] });

		try {
			const evaled = eval(script);
			const output = inspect(evaled, { depth: 0 });

			loading.edit({
				embeds: [new EmbedBuilder()
					.setColor('#77B255')
					.addFields([
						{ name: '📥 Input', value: `\`\`\`js\n${script.slice(0, 1015)}\`\`\`` },
						{ name: '📤 Output', value: `\`\`\`js\n${output.slice(0, 1015)}\`\`\`` },
					]),
				],
			});

			console.log('EvalCM » ✔ Success:', script);
		} catch (err) {
			loading.edit({
				embeds: [new EmbedBuilder()
					.setColor('#DD2E44')
					.addFields([
						{ name: '📥 Input', value: `\`\`\`js\n${script.slice(0, 1015)}\`\`\`` },
						{ name: '📤 Output', value: `\`\`\`js\n${err}\`\`\`` },
					]),
				],
			});

			console.log(script);
			console.log(err.message);
		}
	},
};