const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const guilds = require('../../../config/guilds.js');

module.exports = {
	name: 'reload-config',
	aliases: ['rc', 'reload-cfg', 'reloadconfig'],
	description: 'Reload server configurations and cron jobs',
	permissions: PermissionsBitField.Flags.Administrator,
	cooldown: 5000,
	async execute(client, msg) {

		try {
			const startTime = Date.now();
			guilds.reloadConfigs();
			require('../../../cron/manager.js')(client);
			const reloadTime = Date.now() - startTime;

			const allConfigs = guilds.getAllServerConfigs();
			const botGuilds = client.guilds.cache;
			const configuredServers = allConfigs.length;
			const connectedServers = allConfigs.filter(({ guildId }) => botGuilds.has(guildId)).length;
			const missingServers = allConfigs.filter(({ guildId }) => !botGuilds.has(guildId)).length;

			const statusColor = missingServers > 0 ? '#FFA500' : '#00D26A';
			const statusIcon = missingServers > 0 ? '⚠️' : '✅';

			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor(statusColor)
					.setTitle(`${statusIcon} Configuration Reloaded`)
					.setDescription(`Successfully reloaded **${configuredServers}** server configurations and cron schedules.`)
					.addFields([
						{
							name: '⚡ Performance',
							value: `\`${reloadTime}ms\` reload time\n\`Config + Cron\` updated`,
							inline: true,
						},
						{
							name: '🌐 Server Status',
							value: `**${connectedServers}**/${configuredServers} connected\n${missingServers > 0 ? `\`${missingServers}\` not accessible` : 'All servers online'}`,
							inline: true,
						},
					])
					.setFooter({ text: 'Use !diag for detailed diagnostics' })
					.setTimestamp()],
			});
		} catch (err) {
			console.error('ReloadConfig » Error:', err.message);
			return msg.reply({
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Reload Failed')
					.setDescription(`\`\`\`${err.message}\`\`\``)
					.setTimestamp()],
			});
		}
	},
};