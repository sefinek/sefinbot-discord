const { Events, PermissionsBitField, EmbedBuilder } = require('discord.js');
const guilds = require('../config/guilds.js');
const { admins } = require('../config/config.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(msg, client) {
		if (!msg.content.startsWith(process.env.PREFIX) || msg.author.bot) return;

		// Fetch server configuration
		const serverCfg = guilds.getServerConfig(msg.member.guild.id);
		if (!serverCfg) return console.warn(`EventA » Server config for ${msg.member.guild.id} was not found`);

		const args = msg.content.slice(process.env.PREFIX.length).split(/ +/);
		const cmd = args.shift().toLowerCase();

		const command = client.commands.get(cmd);
		if (!command) return;

		// Check if command requires dating server
		if (command.category === '3_dating' && !serverCfg.isDatingServer) {
			return msg.reply('<a:error:1127481079620718635> Ta komenda jest dostępna tylko na serwerze randkowym.');
		}

		if (!msg.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
			return console.log(`Server » I don't have SendMessages permission on ${msg.guild.name} (${msg.guild.id}). ${msg.author.tag} (${msg.author.id}), command ${command.name}`);
		}

		if (command.admin && !admins.includes(msg.author.id)) {
			return console.log(`Server » User ${msg.author.tag} (${msg.author.id}) without permissions attempted to access administrative bot commands on the server ${msg.guild.name} (${msg.guild.id})!`);
		}

		try {
			await command.execute(client, msg, args);
		} catch (err) {
			require('../scripts/error.js')(EmbedBuilder, msg, err);
		}

		if (!command.admin) {
			console.log(`PrfCMD » Command '${command.name}' was used by '${msg.author.tag}' (${msg.author.id}) on the server '${msg.guild.name}' (${msg.guild.id})`);
		} else {
			console.log(`AdmCMD » Administrative command '${command.name}' was used by ${msg.author.tag} (${msg.author.id}) on '${msg.guild.name}' (${msg.guild.id})`);
		}
	},
};
