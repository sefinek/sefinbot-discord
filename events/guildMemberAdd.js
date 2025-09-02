const { Events, PermissionsBitField } = require('discord.js');
const guilds = require('../config/guilds.js');
const userBlacklist = require('../services/userBlacklist.js');
const VerificationStatus = require('../database/models/verification.model.js');

const ARROW_RESET_DELAY = 30000;
const DISCORD_ERROR_CODES = {
	CANNOT_SEND_DM: 50007,
};

const getMemberCount = guild => guild.members.cache.filter(member => !member.user.bot).size;

const handleWelcomeMessage = async (member, serverCfg) => {
	const { welcomeChannelId, welcomeContent } = serverCfg;
	if (!welcomeChannelId || !welcomeContent) return;

	const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
	if (!welcomeChannel) {
		return console.warn(`EventA » Welcome channel ${welcomeChannelId} not found in ${member.guild.name}`);
	}

	try {
		const memberCount = getMemberCount(member.guild);
		const welcomeMessage = welcomeContent(member, memberCount);
		await welcomeChannel.send(welcomeMessage);
	} catch (err) {
		console.warn(`EventA » Failed to send welcome message in ${welcomeChannel.name}:`, err.message);
	}
};

const handleDirectMessage = async (member, serverCfg) => {
	const { joinMsgDM, joinMsgDMContent } = serverCfg;
	if (!joinMsgDM || !joinMsgDMContent) return;

	try {
		const dmContent = joinMsgDMContent(member);
		await member.send(dmContent);
	} catch (err) {
		if (err.code === DISCORD_ERROR_CODES.CANNOT_SEND_DM) {
			console.log(`EventA » Cannot send DM to ${member.user.tag} - DMs disabled`);
		} else {
			console.warn(`EventA » Failed to send DM to ${member.user.tag}:`, err.message);
		}
	}
};

const handleMemberCountChannel = async (member, serverCfg) => {
	const { vcMembers, vcMembersChannel, vcMembersName } = serverCfg;
	if (!vcMembers || !vcMembersChannel || !vcMembersName) return;

	const memberCountChannel = member.guild.channels.cache.get(vcMembersChannel);
	if (!memberCountChannel) {
		return console.warn(`EventA » Member count channel ${vcMembersChannel} not found`);
	}

	try {
		const memberCount = getMemberCount(member.guild);

		// Set name with up arrow
		const nameWithArrow = typeof vcMembersName === 'function'
			? vcMembersName(memberCount, '⬆')
			: vcMembersName;
		await memberCountChannel.setName(nameWithArrow);

		// Reset arrow after delay
		setTimeout(async () => {
			try {
				const currentCount = getMemberCount(member.guild);
				const nameWithoutArrow = typeof vcMembersName === 'function'
					? vcMembersName(currentCount, '')
					: vcMembersName;
				await memberCountChannel.setName(nameWithoutArrow);
			} catch (err) {
				console.warn(`EventA » Failed to reset member count channel name: ${err.message}`);
			}
		}, ARROW_RESET_DELAY);
	} catch (err) {
		console.warn(`EventA » Failed to update member count channel: ${err.message}`);
	}
};

const handleNewestMemberChannel = async (member, serverCfg) => {
	const { vcNew, vcNewChannel, vcNewName } = serverCfg;
	if (!vcNew || !vcNewChannel || !vcNewName) return;

	const newMemberChannel = member.guild.channels.cache.get(vcNewChannel);
	if (!newMemberChannel) {
		return console.warn(`EventA » Newest member channel ${vcNewChannel} not found`);
	}

	try {
		const channelName = typeof vcNewName === 'function'
			? vcNewName(member.user.username)
			: vcNewName;
		await newMemberChannel.setName(channelName);
	} catch (err) {
		console.warn(`EventA » Failed to update newest member channel: ${err.message}`);
	}
};

const handleVerification = async (member, serverCfg) => {
	const { verificationEnabled, unverifiedRoleId } = serverCfg;
	if (!verificationEnabled || !unverifiedRoleId) return;

	const unverifiedRole = member.guild.roles.cache.get(unverifiedRoleId);
	if (!unverifiedRole) {
		return console.warn(`EventA » Unverified role ${unverifiedRoleId} not found in ${member.guild.name}`);
	}

	try {
		await member.roles.add(unverifiedRole);

		await VerificationStatus.create({
			userId: member.id,
			guildId: member.guild.id,
			joinedAt: member.joinedAt || new Date(),
		});

		console.log(`EventA » Added unverified role to ${member.user.tag} (${member.id})`);
	} catch (err) {
		console.warn(`EventA » Failed to setup verification for ${member.user.tag}: ${err.message}`);
	}
};

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		// Skip bot users
		if (member.user.bot) return;

		// Handle blacklist check and ban
		const hasManageMessages = member.permissions.has(PermissionsBitField.Flags.ManageMessages);
		if (!hasManageMessages && userBlacklist(member.user.username, member.user.displayName)) {
			try {
				await member.ban({ reason: 'User on blacklist' });
				console.log(`EventA » Banned blacklisted user ${member.user.tag} (${member.id})`);
				return;
			} catch (err) {
				console.warn(`EventA » Failed to ban blacklisted user ${member.user.tag}: ${err.message}`);
			}
		}

		// Get server configuration
		const serverCfg = guilds.getServerConfig(member.guild.id);
		if (!serverCfg) {
			return console.warn(`EventA » No server config found for guild ${member.guild.id}`);
		}

		// Execute all handlers concurrently for better performance
		const handlers = [
			handleWelcomeMessage(member, serverCfg),
			handleDirectMessage(member, serverCfg),
			handleMemberCountChannel(member, serverCfg),
			handleNewestMemberChannel(member, serverCfg),
			handleVerification(member, serverCfg),
		];

		// Wait for all handlers to complete, but don't let one failure stop others
		const results = await Promise.allSettled(handlers);

		// Log any handler failures
		results.forEach((result, index) => {
			if (result.status === 'rejected') {
				const handlerNames = ['welcome', 'DM', 'memberCount', 'newestMember', 'verification'];
				console.warn(`EventA » ${handlerNames[index]} handler failed for ${member.user.tag}:`, result.reason);
			}
		});

		console.log(`EventA » User ${member.user.tag} (${member.id}) joined "${member.guild.name}"`);
	},
};