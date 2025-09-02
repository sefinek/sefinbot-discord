const { Events } = require('discord.js');
const guilds = require('../config/guilds.js');

const ARROW_RESET_DELAY = 30000;

const getMemberCount = guild => guild.members.cache.filter(member => !member.user.bot).size;

const handleBanNotification = async (user, guild, serverCfg) => {
	const { banChannelId, banContent } = serverCfg;
	if (!banChannelId || !banContent) return;

	const banNotificationChannel = guild.channels.cache.get(banChannelId);
	if (!banNotificationChannel) {
		return console.warn(`EventB » Ban notification channel ${banChannelId} not found in ${guild.name}`);
	}

	try {
		const memberCount = getMemberCount(guild);
		const banMessage = banContent(user, guild, memberCount);
		await banNotificationChannel.send(banMessage);
	} catch (err) {
		console.warn(`EventB » Failed to send ban notification in ${banNotificationChannel.name}: ${err.message}`);
	}
};

const handleMemberCountChannel = async (guild, serverCfg) => {
	const { vcMembers, vcMembersChannel, vcMembersName } = serverCfg;
	if (!vcMembers || !vcMembersChannel || !vcMembersName) return;

	const memberCountChannel = guild.channels.cache.get(vcMembersChannel);
	if (!memberCountChannel) {
		return console.warn(`EventB » Member count channel ${vcMembersChannel} not found`);
	}

	try {
		const memberCount = getMemberCount(guild);

		// Set name with down arrow
		const nameWithArrow = typeof vcMembersName === 'function'
			? vcMembersName(memberCount, '⬇')
			: vcMembersName;
		await memberCountChannel.setName(nameWithArrow);

		// Reset arrow after delay
		setTimeout(async () => {
			try {
				const currentCount = getMemberCount(guild);
				const nameWithoutArrow = typeof vcMembersName === 'function'
					? vcMembersName(currentCount, '')
					: vcMembersName;
				await memberCountChannel.setName(nameWithoutArrow);
			} catch (err) {
				console.warn(`EventB » Failed to reset member count channel name: ${err.message}`);
			}
		}, ARROW_RESET_DELAY);
	} catch (err) {
		console.warn(`EventB » Failed to update member count channel: ${err.message}`);
	}
};

module.exports = {
	name: Events.GuildBanAdd,
	async execute(ban) {
		const { guild, user } = ban;

		// Skip bot users
		if (user.bot) return;

		// Get server configuration
		const serverCfg = guilds.getServerConfig(guild.id);
		if (!serverCfg) {
			return console.warn(`EventB » No server config found for guild ${guild.id}`);
		}

		// Execute all handlers concurrently for better performance
		const handlers = [
			handleBanNotification(user, guild, serverCfg),
			handleMemberCountChannel(guild, serverCfg),
		];

		// Wait for all handlers to complete, but don't let one failure stop others
		const results = await Promise.allSettled(handlers);

		// Log any handler failures
		results.forEach((result, index) => {
			if (result.status === 'rejected') {
				const handlerNames = ['banNotification', 'memberCount'];
				console.warn(`EventB » ${handlerNames[index]} handler failed for ${user.tag}:`, result.reason);
			}
		});

		console.log(`EventB » User ${user.tag} (${user.id}) banned from "${guild.name}"`);
	},
};