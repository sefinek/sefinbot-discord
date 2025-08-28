const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const guilds = require('../../../config/guilds.js');

module.exports = {
	name: 'reload-config',
	aliases: ['rc', 'reload-cfg'],
	description: 'Reload server configurations from files',
	cooldown: 5000,
	async execute(msg) {
		if (!msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return msg.reply({ embeds: [
				new EmbedBuilder()
					.setColor('#FF6B6B')
					.setDescription('❌ You need Administrator permission to use this command.'),
			] });
		}

		try {
			const startTime = Date.now();

			// Reload configurations
			guilds.reloadConfigs();

			// Test current server config
			const currentConfig = guilds.getServerConfig(msg.guild.id);
			const configStatus = currentConfig ? '✅ Available' : '❌ Not found';

			const reloadTime = Date.now() - startTime;

			return msg.reply({ embeds: [
				new EmbedBuilder()
					.setColor('#00D26A')
					.setTitle('🔄 Configuration Reloaded')
					.setDescription('Server configurations have been successfully reloaded from files.')
					.addFields([
						{
							name: '⏱️ Reload Time',
							value: `${reloadTime}ms`,
							inline: true,
						},
						{
							name: '🎛️ Current Server Config',
							value: configStatus,
							inline: true,
						},
						{
							name: '📁 Config Files',
							value: 'All `.js` files from `/config/servers/` directory',
							inline: false,
						},
					])
					.setFooter({
						text: `Requested by ${msg.author.tag}`,
						iconURL: msg.author.displayAvatarURL(),
					})
					.setTimestamp(),
			] });

		} catch (err) {
			console.error('ReloadConfig » Error reloading configs:', err);

			return msg.reply({ embeds: [
				new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Reload Failed')
					.setDescription('Failed to reload server configurations.')
					.addFields([
						{
							name: '🐛 Error Details',
							value: `\`\`\`js\n${err.message}\`\`\``,
							inline: false,
						},
					])
					.setFooter({
						text: `Requested by ${msg.author.tag}`,
						iconURL: msg.author.displayAvatarURL(),
					})
					.setTimestamp(),
			] });
		}
	},
};