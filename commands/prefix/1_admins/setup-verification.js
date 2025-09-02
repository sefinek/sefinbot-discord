const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { getServerConfig } = require('../../../config/guilds.js');

module.exports = {
	name: 'setup-verification',
	aliases: ['setup-verify', 'verify-setup', 'verification-setup'],
	description: 'Setup verification message with button in current channel',
	cooldown: 5000,
	async execute(client, msg) {
		const serverConfig = getServerConfig(msg.guild.id);
		if (!serverConfig || !serverConfig.verification?.enabled) {
			return msg.reply('❌ Verification is not enabled on this server.');
		}

		// Check if bot has permissions
		const botMember = msg.guild.members.cache.get(client.user.id);
		if (!botMember.permissions.has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageRoles])) {
			return msg.reply('❌ Bot needs Send Messages and Manage Roles permissions.');
		}

		// Check if roles exist
		const unverifiedRole = msg.guild.roles.cache.get(serverConfig.verification.unverifiedRoleId);
		const verifiedRole = msg.guild.roles.cache.get(serverConfig.verification.verifiedRoleId);

		if (!unverifiedRole || !verifiedRole) {
			return msg.reply('❌ Verification roles not found. Please check server configuration.');
		}

		// Build content from server configuration
		const verificationContent = serverConfig.verification.content;
		const buttonConfig = serverConfig.verification.button;

		// Get verification message content
		const messageContent = verificationContent ? verificationContent(msg.guild) : {
			embeds: [
				new EmbedBuilder()
					.setColor('#3498DB')
					.setTitle('🔐 Server Verification Required')
					.setDescription(`Welcome to **${msg.guild.name}**!\n\nTo gain access to all channels and features, please complete the verification process by clicking the button below.`)
					.setFooter({ text: `${msg.guild.name} • Click the button below to verify`, iconURL: msg.guild.iconURL() })
					.setTimestamp(),
			],
		};

		const button = new ButtonBuilder()
			.setCustomId('verify_account')
			.setLabel(buttonConfig?.label || 'Verify Account')
			.setStyle(ButtonStyle[buttonConfig?.style] || ButtonStyle.Primary);

		// Add emoji if configured
		if (buttonConfig?.emoji) button.setEmoji(buttonConfig.emoji);

		const row = new ActionRowBuilder().addComponents(button);

		// Send verification message
		await msg.channel.send({
			...messageContent,
			components: [row],
		});

		// Reply with setup information
		const setupEmbed = new EmbedBuilder()
			.setColor('#00FF00')
			.setTitle('✅ Verification Setup Complete')
			.setDescription('Verification message has been created successfully!')
			.addFields(
				{ name: '✅ Ready to use', value: 'Users can now click the button to verify their accounts. The button will work even after bot restarts.', inline: false },
				{ name: '🔧 Channel Configuration', value: 'Consider restricting this channel to prevent regular messaging and only allow button interactions.', inline: false }
			)
			.setFooter({ text: 'Verification system is now active' })
			.setTimestamp();

		await msg.reply({ embeds: [setupEmbed] });
		msg.delete();

		console.log(`Verifi » Setup message created in ${msg.guild.name} (${msg.guild.id}) - Channel: ${msg.channel.id}`);
	},
};