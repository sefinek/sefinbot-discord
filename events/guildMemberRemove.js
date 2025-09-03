const { Events } = require('discord.js');
const guilds = require('../config/guilds.js');

const ARROW_RESET_DELAY = 30000;

const getMemberCount = guild => guild.members.cache.filter(member => !member.user.bot).size;

const handleFarewellMessage = async (member, serverCfg, client) => {
	if (!serverCfg.events?.farewell?.channelId || !serverCfg.events?.farewell?.content) return;

	const farewellChannel = member.guild.channels.cache.get(serverCfg.events.farewell.channelId);
	if (!farewellChannel) {
		return console.warn(`EventR » Farewell channel ${serverCfg.events.farewell.channelId} not found in ${member.guild.name}`);
	}

	try {
		const memberCount = getMemberCount(member.guild);
		const farewellMessage = serverCfg.events.farewell.content(client, member, memberCount);
		await farewellChannel.send(farewellMessage);
	} catch (err) {
		console.warn(`EventR » Failed to send farewell message in ${farewellChannel.name}: ${err.message}`);
	}
};

const handleMemberCountChannel = async (member, serverCfg) => {
	if (!serverCfg.voiceChannels?.members?.enabled || !serverCfg.voiceChannels?.members?.channelId) return;

	const memberCountChannel = member.guild.channels.cache.get(serverCfg.voiceChannels.members.channelId);
	if (!memberCountChannel) {
		return console.warn(`EventR » Member count channel ${serverCfg.voiceChannels.members.channelId} not found`);
	}

	try {
		const memberCount = getMemberCount(member.guild);

		const nameWithArrow = typeof serverCfg.voiceChannels.members.name === 'function'
			? serverCfg.voiceChannels.members.name(memberCount, '⬇')
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
				console.warn(`EventR » Failed to reset member count channel name: ${err.message}`);
			}
		}, ARROW_RESET_DELAY);
	} catch (err) {
		console.warn(`EventR » Failed to update member count channel: ${err.message}`);
	}
};

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member, client) {
		// Skip bot users
		if (member.user.bot) return;

		// Get server configuration
		const serverCfg = guilds.getServerConfig(member.guild.id);
		if (!serverCfg) {
			if (guilds.shouldIgnoreGuild(member.guild.id)) return;
			return console.warn(`EventR » No server config found for guild ${member.guild.id}`);
		}

		// Execute all handlers concurrently for better performance
		const results = await Promise.allSettled([
			handleFarewellMessage(member, serverCfg, client),
			handleMemberCountChannel(member, serverCfg),
		]);

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