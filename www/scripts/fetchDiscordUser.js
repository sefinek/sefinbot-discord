const StellaSubscription = require('../../database/models/sm_subscription.model');

module.exports = async (req, res, guildId, subscriberId) => {
	const db = await StellaSubscription.findOne({ userId: subscriberId });
	if (!db) return { success: false, status: 500, message: `User ${subscriberId} was not found in the database` };

	const dcUserId = db.discord ? db.discord.dcUserId : null;
	if (!dcUserId || isNaN(dcUserId)) return { success: false, status: 200, message: `Discord user ID was not found in the database collection. Found: ${dcUserId}` };

	if (!guildId) return { success: false, status: 500, message: `Missing guild ID, received ${guildId}` };

	try {
		const guild = await req.bot.guilds.fetch(guildId);
		if (!guild) return { success: false, status: 500, message: `Guild ${guildId} was not found` };

		await guild.members.fetch();

		const member = guild.members.cache.get(dcUserId);
		if (!member) {
			return { success: false, status: 200, message: 'User was not found' };
		}

		if (!guild.members.cache.has(member.user.id)) {
			return { success: false, status: 200, message: `User ${member.user.username} was not found on the Discord server ${guild.name}` };
		}

		// console.log(`[CheckDiscordUser]: Found member ${member.user.username} (${member.user.id}) on ${guild.name} (${guild.id})`);
		return { success: true, status: 200, message: null, guild, member };
	} catch (err) {
		return { success: false, status: 500, message: err };
	}
};