const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const newGuilds = require('../../../config/guilds.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	name: 'check-migration',
	aliases: ['cm', 'migration-status'],
	description: 'Check migration status from old guilds.js to new config system',
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
			// Read old guilds file
			const oldGuildsPath = path.join(__dirname, '../../../guilds_old.js');
			let oldGuildsData = {};

			if (fs.existsSync(oldGuildsPath)) {
				// Parse old file for guild IDs
				const oldContent = fs.readFileSync(oldGuildsPath, 'utf8');
				const guildIdMatches = oldContent.match(/'(\d{17,19})':\s*{/g);
				if (guildIdMatches) {
					oldGuildsData = guildIdMatches.reduce((acc, match) => {
						const id = match.match(/'(\d{17,19})'/)[1];
						acc[id] = true;
						return acc;
					}, {});
				}
			}

			// Get new configs
			const configsPath = path.join(__dirname, '../../../config/servers');
			const configFiles = fs.readdirSync(configsPath).filter(f => f.endsWith('.js'));
			const newConfigs = {};

			configFiles.forEach(file => {
				try {
					const config = require(path.join(configsPath, file));
					if (config.id) {
						newConfigs[config.id] = {
							file: file.replace('.js', ''),
							environment: config.environment || 'production',
						};
					}
				} catch (err) {
					console.error(`Error loading ${file}:`, err.message);
				}
			});

			// Compare
			const oldGuildIds = Object.keys(oldGuildsData);
			const newGuildIds = Object.keys(newConfigs).filter(id => newConfigs[id].environment !== 'development');

			const migrated = oldGuildIds.filter(id => newGuildIds.includes(id));
			const missing = oldGuildIds.filter(id => !newGuildIds.includes(id));
			const newOnly = newGuildIds.filter(id => !oldGuildIds.includes(id));

			// Create status embed
			const embed = new EmbedBuilder()
				.setColor(missing.length > 0 ? '#FFA500' : '#00D26A')
				.setTitle('📊 Migration Status Report')
				.setDescription('Status of migration from old guilds.js to new modular config system')
				.addFields([
					{
						name: '📁 Old System',
						value: `${oldGuildIds.length} server configs found`,
						inline: true,
					},
					{
						name: '🔄 New System',
						value: `${newGuildIds.length} server configs loaded`,
						inline: true,
					},
					{
						name: '✅ Migration Progress',
						value: `${migrated.length}/${oldGuildIds.length} (${Math.round(migrated.length / oldGuildIds.length * 100)}%)`,
						inline: true,
					},
				]);

			if (migrated.length > 0) {
				embed.addFields({
					name: '✅ Successfully Migrated',
					value: migrated.map(id => {
						const config = newConfigs[id];
						return `• \`${id}\` → ${config.file}.js`;
					}).join('\n'),
					inline: false,
				});
			}

			if (missing.length > 0) {
				embed.addFields({
					name: '❌ Missing Migrations',
					value: missing.map(id => `• \`${id}\` (not found in new system)`).join('\n'),
					inline: false,
				});
			}

			if (newOnly.length > 0) {
				embed.addFields({
					name: '🆕 New Configs Only',
					value: newOnly.map(id => {
						const config = newConfigs[id];
						return `• \`${id}\` → ${config.file}.js`;
					}).join('\n'),
					inline: false,
				});
			}

			// Check development configs
			const devConfigs = Object.values(newConfigs).filter(c => c.environment === 'development');
			if (devConfigs.length > 0) {
				embed.addFields({
					name: '🚧 Development Configs',
					value: devConfigs.map(c => `• ${c.file}.js`).join('\n'),
					inline: false,
				});
			}

			embed.setFooter({
				text: `Checked ${configFiles.length} config files`,
				iconURL: msg.author.displayAvatarURL(),
			}).setTimestamp();

			return msg.reply({ embeds: [embed] });

		} catch (err) {
			console.error('CheckMigration » Error:', err);

			return msg.reply({ embeds: [
				new EmbedBuilder()
					.setColor('#FF6B6B')
					.setTitle('❌ Migration Check Failed')
					.setDescription('Failed to check migration status.')
					.addFields([{
						name: '🐛 Error Details',
						value: `\`\`\`js\n${err.message}\`\`\``,
					}])
					.setTimestamp(),
			] });
		}
	},
};