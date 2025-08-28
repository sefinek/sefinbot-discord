const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const guilds = require('../../../config/guilds.js');

module.exports = {
	name: 'config-diag',
	aliases: ['cdiag', 'config-diagnostic', 'diag', 'check-migration', 'cm'],
	description: 'Comprehensive server configuration diagnostics and health report',
	cooldown: 3000,
	async execute(client, msg) {

		try {
			const allConfigs = guilds.getAllServerConfigs();
			const botGuilds = client.guilds.cache;
			
			const connectedServers = [];
			const missingServers = [];
			const currentServerConfig = guilds.getServerConfig(msg.guild.id);

			allConfigs.forEach(({ guildId, config }) => {
				const guild = botGuilds.get(guildId);
				if (guild) {
					connectedServers.push({
						id: guildId,
						name: guild.name,
						members: guild.memberCount,
						cron: config.cronConfig?.enabled || false,
						dating: config.isDatingServer || false,
						env: config.config.environment || 'production'
					});
				} else {
					missingServers.push({
						id: guildId,
						env: config.config.environment || 'production'
					});
				}
			});

			const cronEnabled = connectedServers.filter(s => s.cron).length;
			const datingServers = connectedServers.filter(s => s.dating).length;
			const devServers = connectedServers.filter(s => s.env === 'development').length;

			const fields = [
				{ 
					name: '📊 Server Overview', 
					value: `**${allConfigs.length}** total configs\n**${connectedServers.length}** connected\n**${missingServers.length}** missing`, 
					inline: true 
				},
				{ 
					name: '🎛️ Current Server', 
					value: currentServerConfig 
						? `✅ **Available**\n${currentServerConfig.cronConfig?.enabled ? '🕒 Cron enabled' : '⏸️ Cron disabled'}`
						: '❌ **No configuration**', 
					inline: true 
				},
				{ 
					name: '⚙️ Features Active', 
					value: `🕒 **${cronEnabled}** with cron\n💕 **${datingServers}** dating servers\n🔧 **${devServers}** development`, 
					inline: true 
				}
			];

			if (connectedServers.length > 0) {
				const serverList = connectedServers.map(s => {
					const features = [
						s.cron ? '🕒' : '⏸️',
						s.dating ? '💕' : '🔒', 
						s.env === 'development' ? '🔧' : '🌐'
					].join(' ');
					return `**${s.name}** \`${s.members} members\`\n${features}`;
				}).join('\n\n');
				
				fields.push({ 
					name: `🌐 Connected Servers (${connectedServers.length})`, 
					value: serverList.length > 1000 ? serverList.substring(0, 1000) + '\n*...truncated*' : serverList,
					inline: false 
				});
			}

			if (missingServers.length > 0) {
				const missingList = missingServers.map(s => 
					`\`${s.id}\` ${s.env === 'development' ? '🔧 dev' : '🌐 prod'}`
				).join('\n');
				
				fields.push({ 
					name: `⚠️ Missing Servers (${missingServers.length})`, 
					value: missingList.length > 1000 ? missingList.substring(0, 1000) + '\n*...truncated*' : missingList,
					inline: false 
				});
			}

			const diagnosticColor = missingServers.length > 0 ? '#FFA500' : '#0099FF';

			return msg.reply({ 
				embeds: [new EmbedBuilder()
					.setColor(diagnosticColor)
					.setTitle('🔍 Configuration Diagnostics')
					.setDescription('**Server configuration status and connectivity overview**')
					.addFields(fields)
					.setFooter({ text: '🕒 Cron Active • 💕 Dating Server • 🔧 Development • 🌐 Production' })
					.setTimestamp()]
			});

		} catch (err) {
			console.error('ConfigDiag » Error:', err.message);
			return msg.reply({ 
				embeds: [new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Diagnostic Failed')
					.setDescription(`\`\`\`${err.message}\`\`\``)
					.setTimestamp()]
			});
		}
	},
};