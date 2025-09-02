const { Events } = require('discord.js');
const guilds = require('../config/guilds.js');

const ARROW_RESET_DELAY = 30000;

const getMemberCount = guild => guild.members.cache.filter(member => !member.user.bot).size;

const handleFarewellMessage = async (member, serverCfg) => {
	const { farewellChannelId, farewellContent } = serverCfg;
	if (!farewellChannelId || !farewellContent) return;

	const farewellChannel = member.guild.channels.cache.get(farewellChannelId);
	if (!farewellChannel) {
		return console.warn(`EventR » Farewell channel ${farewellChannelId} not found in ${member.guild.name}`);
	}

	try {
		const memberCount = getMemberCount(member.guild);
		const farewellMessage = farewellContent(member, memberCount);
		await farewellChannel.send(farewellMessage);
	} catch (err) {
		console.warn(`EventR » Failed to send farewell message in ${farewellChannel.name}: ${err.message}`);
	}
};

const handleMemberCountChannel = async (member, serverCfg) => {
	const { vcMembers, vcMembersChannel, vcMembersName } = serverCfg;
	if (!vcMembers || !vcMembersChannel || !vcMembersName) return;

	const memberCountChannel = member.guild.channels.cache.get(vcMembersChannel);
	if (!memberCountChannel) {
		return console.warn(`EventR » Member count channel ${vcMembersChannel} not found`);
	}

	try {
		const memberCount = getMemberCount(member.guild);

		// Set name with down arrow
		const nameWithArrow = typeof vcMembersName === 'function'
			? vcMembersName(memberCount, '⬇')
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
				console.warn(`EventR » Failed to reset member count channel name: ${err.message}`);
			}
		}, ARROW_RESET_DELAY);
	} catch (err) {
		console.warn(`EventR » Failed to update member count channel: ${err.message}`);
	}
};

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		// Skip bot users
		if (member.user.bot) return;

		// Get server configuration
		const serverCfg = guilds.getServerConfig(member.guild.id);
		if (!serverCfg) {
			return console.warn(`EventR » No server config found for guild ${member.guild.id}`);
		}

		// Execute all handlers concurrently for better performance
		const handlers = [
			handleFarewellMessage(member, serverCfg),
			handleMemberCountChannel(member, serverCfg),
		];

		// Wait for all handlers to complete, but don't let one failure stop others
		const results = await Promise.allSettled(handlers);

		// Log any handler failures
		results.forEach((result, index) => {
			if (result.status === 'rejected') {
				const handlerNames = ['farewell', 'memberCount'];
				console.warn(`EventR » ${handlerNames[index]} handler failed for ${member.user.tag}:`, result.reason);
			}
		});

		console.log(`EventR » User ${member.user.tag} (${member.id}) left "${member.guild.name}"`);
	},
};