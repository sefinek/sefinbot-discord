const { Events, PermissionsBitField } = require('discord.js');
const guilds = require('../config/guilds.js');
const userBlacklist = require('../services/userBlacklist.js');

const ARROW_RESET_DELAY = 30000;

const getMemberCount = guild => guild.members.cache.filter(member => !member.user.bot).size;

const handleWelcomeMessage = async (member, serverCfg, client) => {
	if (!serverCfg.events?.welcome?.channelId || !serverCfg.events?.welcome?.content) return;

	const welcomeChannel = member.guild.channels.cache.get(serverCfg.events.welcome.channelId);
	if (!welcomeChannel) return console.warn(`EventA » Welcome channel ${serverCfg.events.welcome.channelId} not found in ${member.guild.name}`);

	try {
		const memberCount = getMemberCount(member.guild);
		const welcomeMessage = serverCfg.events.welcome.content(client, member, memberCount);
		await welcomeChannel.send(welcomeMessage);
	} catch (err) {
		console.warn(`EventA » Failed to send welcome message in ${welcomeChannel.name}:`, err.message);
	}
};

const handleDirectMessage = async (member, serverCfg, client) => {
	if (!serverCfg.events?.directMessages?.welcome?.enabled || !serverCfg.events?.directMessages?.welcome?.content) return;

	try {
		const dmContent = serverCfg.events.directMessages.welcome.content(client, member);
		await member.send(dmContent);
	} catch (err) {
		if (err.code === 50007) {
			console.log(`EventA » Cannot send DM to ${member.user.username} - DMs disabled`);
		} else {
			console.warn(`EventA » Failed to send DM to ${member.user.username}:`, err.message);
		}
	}
};

const handleMemberCountChannel = async (member, serverCfg) => {
	if (!serverCfg.voiceChannels?.members?.enabled || !serverCfg.voiceChannels?.members?.channelId) return;

	const memberCountChannel = member.guild.channels.cache.get(serverCfg.voiceChannels.members.channelId);
	if (!memberCountChannel) return console.warn(`EventA » Member count channel ${serverCfg.voiceChannels.members.channelId} not found`);

	try {
		const memberCount = getMemberCount(member.guild);

		const nameWithArrow = typeof serverCfg.voiceChannels.members.name === 'function'
			? serverCfg.voiceChannels.members.name(memberCount, '⬆')
			: serverCfg.voiceChannels.members.name;
		await memberCountChannel.setName(nameWithArrow);

		setTimeout(async () => {
			try {
				const currentCount = getMemberCount(member.guild);
				const nameWithoutArrow = typeof serverCfg.voiceChannels.members.name === 'function'
					? serverCfg.voiceChannels.members.name(currentCount, '')
					: serverCfg.voiceChannels.members.name;
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
	if (!serverCfg.voiceChannels?.newest?.enabled || !serverCfg.voiceChannels?.newest?.channelId) return;

	const newMemberChannel = member.guild.channels.cache.get(serverCfg.voiceChannels.newest.channelId);
	if (!newMemberChannel) return console.warn(`EventA » Newest member channel ${serverCfg.voiceChannels.newest.channelId} not found`);

	try {
		const channelName = typeof serverCfg.voiceChannels.newest.name === 'function'
			? serverCfg.voiceChannels.newest.name(member.user.username)
			: serverCfg.voiceChannels.newest.name;
		await newMemberChannel.setName(channelName);
	} catch (err) {
		console.warn(`EventA » Failed to update newest member channel: ${err.message}`);
	}
};

const handleVerification = async (member, serverCfg) => {
	if (!serverCfg.verification?.enabled || !serverCfg.verification?.unverifiedRoleId) return;

	const unverifiedRole = member.guild.roles.cache.get(serverCfg.verification.unverifiedRoleId);
	if (!unverifiedRole) return console.warn(`EventA » Unverified role ${serverCfg.verification.unverifiedRoleId} not found in ${member.guild.name}`);

	try {
		await member.roles.add(unverifiedRole);
	} catch (err) {
		console.warn(`EventA » Failed to setup verification for ${member.user.username}: ${err.message}`);
	}
};

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member, client) {
		// Skip bot users
		if (member.user.bot) return;

		// Handle blacklist check and ban
		const hasManageMessages = member.permissions.has(PermissionsBitField.Flags.ManageMessages);
		if (!hasManageMessages && userBlacklist(member.user.username, member.user.displayName)) {
			try {
				await member.ban({ reason: 'User on blacklist' });
				return console.log(`EventA » Banned blacklisted user ${member.user.username} (${member.id})`);
			} catch (err) {
				console.warn(`EventA » Failed to ban blacklisted user ${member.user.username}: ${err.message}`);
			}
		}

		// Get server configuration
		const serverCfg = guilds.getServerConfig(member.guild.id);
		if (!serverCfg) {
			if (guilds.shouldIgnoreGuild(member.guild.id)) return;
			return console.warn(`EventA » No server config found for guild ${member.guild.id}`);
		}

		// Execute all handlers concurrently for better performance
		const results = await Promise.allSettled([
			handleWelcomeMessage(member, serverCfg, client),
			handleDirectMessage(member, serverCfg, client),
			handleMemberCountChannel(member, serverCfg),
			handleNewestMemberChannel(member, serverCfg),
			handleVerification(member, serverCfg),
		]);

		// Log any handler failures
		results.forEach((result, index) => {
			if (result.status === 'rejected') {
				const handlerNames = ['welcome', 'DM', 'memberCount', 'newestMember', 'verification'];
				console.warn(`EventA » ${handlerNames[index]} handler failed for ${member.user.username}:`, result.reason);
			}
		});

		console.log(`EventA » User ${member.user.username} (${member.id}) joined '${member.guild.name}'`);
	},
};