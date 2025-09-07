const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { getServerConfig } = require('../../../config/guilds.js');

module.exports = {
	name: 'setup-verification',
	aliases: ['setup-verify', 'verify-setup', 'verification-setup'],
	description: 'Setup verification message with button in current channel',
	cooldown: 5000,
	async execute(client, msg) {
		const serverConfig = getServerConfig(msg.guild.id);
		if (!serverConfig || !serverConfig.verification?.enabled) return msg.reply('❌ Verification is not enabled on this server.');

		// Check if bot has permissions
		const botMember = msg.guild.members.cache.get(client.user.id);
		if (!botMember.permissions.has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageRoles])) return msg.reply('❌ Bot needs Send Messages and Manage Roles permissions.');

		// Check if roles exist
		const unverifiedRole = msg.guild.roles.cache.get(serverConfig.verification.unverifiedRoleId);
		const verifiedRole = msg.guild.roles.cache.get(serverConfig.verification.verifiedRoleId);
		if (!unverifiedRole || !verifiedRole) return msg.reply('❌ Verification roles not found. Please check server configuration.');

		// Build content from server configuration
		const verificationContent = serverConfig.verification.content;
		if (!verificationContent || typeof verificationContent !== 'function') return msg.reply('❌ Verification content configuration is missing or invalid.');

		const buttonConfig = serverConfig.verification.button;
		if (!buttonConfig) throw new Error('Button configuration is missing in server settings.');

		const button = new ButtonBuilder()
			.setCustomId('verify_account')
			.setLabel(buttonConfig?.label || 'Verify Account')
			.setStyle(ButtonStyle[buttonConfig?.style] || ButtonStyle.Primary);
		if (buttonConfig.emoji) button.setEmoji(buttonConfig.emoji);

		const row = new ActionRowBuilder().addComponents(button);
		await msg.channel.send({
			...verificationContent(client, msg.guild),
			components: [row],
		});

		msg.delete();
	},
};