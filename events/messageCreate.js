const { Events, PermissionsBitField, EmbedBuilder } = require('discord.js');
const guilds = require('../config/guilds.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(msg, client) {
		if (!msg.content.startsWith(process.env.PREFIX) || msg.author.bot) return;

		// Fetch server configuration
		const serverCfg = guilds.getServerConfig(msg.member.guild.id);
		if (!serverCfg) {
			if (guilds.shouldIgnoreGuild(msg.member.guild.id)) return;
			return console.warn(`EventA » Server config for ${msg.member.guild.id} was not found`);
		}

		const args = msg.content.slice(process.env.PREFIX.length).split(/ +/);
		const cmd = args.shift().toLowerCase();

		const command = client.commands.get(cmd) || client.commands.find(c => c.aliases?.includes(cmd));
		if (!command) return;

		// Check bot permissions
		if (!msg.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
			return console.log(`Server » I don't have SendMessages permission on ${msg.guild.name} (${msg.guild.id}). ${msg.author.username} (${msg.author.id}), command ${command.name}`);
		}

		// Owner-only commands (more restrictive than category)
		if (command.ownerOnly && msg.author.id !== process.env.OWNER) {
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Access Denied')
					.setDescription('This command is restricted to the bot owner only.')],
			});
		}

		// Category-based permission checks
		if (command.category === '1_admins' && msg.author.id !== process.env.OWNER) {
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Access Denied')
					.setDescription('This command is restricted to the bot owner.')],
			});
		}

		if (command.category === '2_mods' && !msg.member.permissions.has(PermissionsBitField.Flags.Administrator) && !msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Access Denied')
					.setDescription('This command requires **Administrator** or **Manage Messages** permission.')],
			});
		}

		if (command.category === '3_dating' && !serverCfg.features?.isDatingServer) {
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Feature Unavailable')
					.setDescription('Dating commands are only available on dating servers.')],
			});
		}

		// Command-specific permission checks
		if (command.permissions && !msg.member.permissions.has(command.permissions)) {
			const permName = Object.keys(PermissionsBitField.Flags).find(key =>
				PermissionsBitField.Flags[key] === command.permissions
			) || 'Required Permission';

			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Missing Permissions')
					.setDescription(`You need **${permName}** permission to use this command.`)],
			});
		}

		try {
			await command.execute(client, msg, args);
		} catch (err) {
			require('../scripts/error.js')(EmbedBuilder, msg, err);
		}

		const logPrefix = command.category === '1_admins' ? 'AdmCMD' : 'PrfCMD';
		console.log(`${logPrefix} » Command '${command.name}' was used by '${msg.author.username}' (${msg.author.id}) on the server '${msg.guild.name}' (${msg.guild.id})`);
	},
};
