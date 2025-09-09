const { getServerConfig } = require('../../config/guilds.js');
const { asyncHandler } = require('../middlewares/auth.js');
const { getPendingVerification, completePendingVerification } = require('../../scripts/verificationUtils.js');

const isValidTokenFormat = token => token && (/^[a-f0-9]{128}$/i).test(token);

const getVerificationInfo = asyncHandler(async (req, res) => {
	const { token } = req.params;
	if (!isValidTokenFormat(token)) return res.status(400).json({ success: false, status: 400, message: 'Invalid verification link format. Please request a new verification link.' });

	const verification = await getPendingVerification(token);
	if (!verification) return res.status(404).json({ success: false, status: 404, message: 'Token not found or expired' });

	const guild = req.bot.guilds.cache.get(verification.guildId);
	const member = guild?.members.cache.get(verification.userId);
	if (!guild || !member) return res.status(404).json({ success: false, status: 404, message: 'Guild or member not found' });

	const serverConfig = getServerConfig(verification.guildId);
	if (!serverConfig?.verification?.enabled) {
		return res.status(400).json({ success: false, status: 400, message: 'Verification not enabled for this server' });
	}

	const responseData = {
		valid: true,
		guild: { name: guild.name, id: verification.guildId, icon: { small: guild.iconURL({ size: 128 }), large: guild.iconURL({ size: 256 }) } },
		user: { username: member.user.username, id: member.id, displayName: member.displayName, avatar: { small: member.user.displayAvatarURL({ size: 128 }), large: member.user.displayAvatarURL({ size: 256 }) } },
		timestamp: verification.timestamp,
	};

	return res.json({ success: true, status: 200, message: 'Verification token found', data: responseData });
});

const completeVerification = asyncHandler(async (req, res) => {
	const { token } = req.params;
	if (!isValidTokenFormat(token)) return res.status(400).json({ success: false, status: 400, message: 'Invalid verification link format. Please request a new verification link.' });

	const verification = await completePendingVerification(token);
	if (!verification) {
		return res.status(404).json({ success: false, status: 404, message: 'Your verification link has expired. Please request a new verification link.' });
	}

	const guild = req.bot.guilds.cache.get(verification.guildId);
	const member = guild?.members.cache.get(verification.userId);
	if (!guild || !member) return res.status(404).json({ success: false, status: 404, message: 'Discord server or member not found. Please ensure you are still a member of the server.' });

	const serverConfig = getServerConfig(verification.guildId);
	if (!serverConfig?.verification?.enabled) return res.status(400).json({ success: false, status: 400, message: 'Verification is currently disabled on this server. Please contact an administrator.' });

	if (!member.roles.cache.has(serverConfig.verification.unverifiedRoleId)) {
		return res.status(400).json({ success: false, status: 400, message: 'You are already verified or do not have the unverified role. Please check your permissions.' });
	}

	const roleChanges = [];
	const unverifiedRole = guild.roles.cache.get(serverConfig.verification.unverifiedRoleId);
	const verifiedRole = guild.roles.cache.get(serverConfig.verification.verifiedRoleId);
	if (unverifiedRole && member.roles.cache.has(serverConfig.verification.unverifiedRoleId)) roleChanges.push(member.roles.remove(unverifiedRole));
	if (verifiedRole && !member.roles.cache.has(serverConfig.verification.verifiedRoleId)) roleChanges.push(member.roles.add(verifiedRole));

	if (roleChanges.length > 0) {
		try {
			await Promise.all(roleChanges);
		} catch (roleErr) {
			console.error(`Verification » Role update error for ${member.user.username}:`, roleErr);

			if (roleErr.code === 50013) return res.status(403).json({ success: false, status: 403, message: 'Bot lacks permission to assign roles. Please contact a server administrator.' });
			if (roleErr.code === 50001) return res.status(403).json({ success: false, status: 403, message: 'Bot lacks access to the server. Please contact a server administrator.' });

			return res.status(500).json({ success: false, status: 500, message: 'Failed to update your roles. Please try again or contact an administrator.' });
		}
	}

	const sendVerificationSuccessDM = async () => {
		try {
			if (!serverConfig.verification?.messages?.success?.content) {
				console.log(`Verification » No verification success DM configured for guild ${guild.name}`);
				return;
			}

			const messageContent = serverConfig.verification.messages.success.content(member, guild);
			await member.send(messageContent);
			console.log(`Verification » Sent verification success DM to ${member.user.username}`);
		} catch (dmErr) {
			console.warn(`Verification » Could not send verification success DM to ${member.user.username}:`, dmErr.message);
		}
	};

	await sendVerificationSuccessDM();

	console.log(`Verification » Successfully verified ${member.user.username} (${member.id}) in '${guild.name}'`);

	return res.json({
		success: true,
		status: 200,
		message: `Successfully verified ${member.user.username} in ${guild.name}`,
		data: {
			user: {
				id: member.id,
				username: member.user.username,
				tag: member.user.username,
			},
			guild: {
				id: guild.id,
				name: guild.name,
			},
		},
	});
});

const getServerStats = asyncHandler(async (req, res) => {
	const verificationEnabledServers = [];

	for (const guild of req.bot.guilds.cache.values()) {
		const serverConfig = getServerConfig(guild.id);
		if (serverConfig?.verification?.enabled) verificationEnabledServers.push({ id: guild.id, name: guild.name, memberCount: guild.memberCount });
	}

	const stats = {
		guilds: req.bot.guilds.cache.size,
		users: req.bot.users.cache.size,
		uptime: Math.floor(process.uptime()),
		verificationEnabled: verificationEnabledServers,
	};

	return res.json({ success: true, status: 200, message: 'Server stats retrieved successfully', data: stats });
});

module.exports = {
	getVerificationInfo,
	completeVerification,
	getServerStats,
};