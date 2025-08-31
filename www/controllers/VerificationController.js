const { getServerConfig } = require('../../config/guilds.js');
const { asyncHandler } = require('../middlewares/auth.js');
const { getPendingVerification, completePendingVerification, getPendingVerificationsCount } = require('../../scripts/verificationUtils.js');

const isValidTokenFormat = token => token && (/^[a-f0-9]{128}$/i).test(token);
const createErrorResponse = (status, message, error) => ({ success: false, status, message, error });
const createSuccessResponse = (status, message, data = null) => ({ success: true, status, message, ...(data && { data }) });

const getVerificationInfo = asyncHandler(async (req, res) => {
	const { token } = req.params;
	const client = req.bot;

	// Validate token format
	if (!isValidTokenFormat(token)) {
		return res.status(400).json(createErrorResponse(400, 'Invalid token format', 'INVALID_TOKEN_FORMAT'));
	}

	// Find verification record
	const verification = await getPendingVerification(token);
	if (!verification) {
		return res.status(404).json(createErrorResponse(404, 'Token not found or expired', 'TOKEN_NOT_FOUND'));
	}

	// Get Discord objects
	const guild = client.guilds.cache.get(verification.guildId);
	const member = guild?.members.cache.get(verification.userId);

	if (!guild || !member) {
		return res.status(404).json(createErrorResponse(404, 'Guild or member not found', 'GUILD_MEMBER_NOT_FOUND'));
	}

	// Check server configuration
	const serverConfig = getServerConfig(verification.guildId);
	if (!serverConfig?.verificationEnabled) {
		return res.status(400).json(createErrorResponse(400, 'Verification not enabled for this server', 'VERIFICATION_DISABLED'));
	}

	// Return verification data
	const responseData = {
		valid: true,
		guild: { name: guild.name, id: verification.guildId, icon: { small: guild.iconURL({ size: 128 }), large: guild.iconURL({ size: 256 }) } },
		user: { username: member.user.tag, id: member.id, displayName: member.displayName, avatar: { small: member.user.displayAvatarURL({ size: 128 }), large: member.user.displayAvatarURL({ size: 256 }) } },
		timestamp: verification.timestamp,
	};

	return res.json(createSuccessResponse(200, 'Verification token found', responseData));
});

const completeVerification = asyncHandler(async (req, res) => {
	const { token } = req.params;
	const client = req.bot;

	// Validate token format
	if (!isValidTokenFormat(token)) {
		return res.status(400).json(createErrorResponse(400, 'Invalid token format', 'INVALID_TOKEN_FORMAT'));
	}

	// Use and invalidate token
	const verification = await completePendingVerification(token);
	if (!verification) {
		return res.status(404).json(createErrorResponse(404, 'Verification token not found or expired', 'TOKEN_NOT_FOUND'));
	}

	// Get Discord objects
	const guild = client.guilds.cache.get(verification.guildId);
	const member = guild?.members.cache.get(verification.userId);

	if (!guild || !member) {
		return res.status(404).json(createErrorResponse(404, 'Server or member not found', 'GUILD_MEMBER_NOT_FOUND'));
	}

	// Check server configuration
	const serverConfig = getServerConfig(verification.guildId);
	if (!serverConfig?.verificationEnabled) {
		return res.status(400).json(createErrorResponse(400, 'Verification not enabled on this server', 'VERIFICATION_DISABLED'));
	}

	// Check if member still has unverified role
	if (!member.roles.cache.has(serverConfig.unverifiedRoleId)) {
		return res.status(400).json(createErrorResponse(400, 'User is already verified or does not have unverified role', 'ALREADY_VERIFIED'));
	}

	// Update roles efficiently
	const roleChanges = [];
	const unverifiedRole = guild.roles.cache.get(serverConfig.unverifiedRoleId);
	const verifiedRole = guild.roles.cache.get(serverConfig.verifiedRoleId);

	if (unverifiedRole && member.roles.cache.has(serverConfig.unverifiedRoleId)) {
		roleChanges.push(member.roles.remove(unverifiedRole));
	}

	if (verifiedRole && !member.roles.cache.has(serverConfig.verifiedRoleId)) {
		roleChanges.push(member.roles.add(verifiedRole));
	}

	// Execute role changes with error handling
	if (roleChanges.length > 0) {
		try {
			await Promise.all(roleChanges);
		} catch (roleErr) {
			console.error(`Verification » Role update error for ${member.user.tag}:`, roleErr);

			// Handle specific Discord API errors
			if (roleErr.code === 50013) {
				return res.status(403).json(createErrorResponse(403, 'Bot lacks permission to manage roles. Please contact an administrator.', 'INSUFFICIENT_PERMISSIONS'));
			}

			if (roleErr.code === 50001) {
				return res.status(403).json(createErrorResponse(403, 'Bot lacks access to the server or member. Please contact an administrator.', 'ACCESS_DENIED'));
			}

			return res.status(500).json(createErrorResponse(500, 'Failed to update roles. Please contact an administrator.', 'ROLE_UPDATE_FAILED'));
		}
	}

	// Send verification success DM (non-blocking)
	const sendVerificationSuccessDM = async () => {
		try {
			if (!serverConfig.verificationSuccessDM) {
				console.log(`Verification » Verification success DM disabled for guild ${guild.name}`);
				return;
			}

			const dmContent = serverConfig.verificationSuccessDMContent;
			if (!dmContent) {
				console.log(`Verification » No verification success DM content configured for guild ${guild.name}`);
				return;
			}

			const messageContent = dmContent(member, guild);
			await member.send(messageContent);
			console.log(`Verification » Sent verification success DM to ${member.user.tag}`);
		} catch (dmErr) {
			console.warn(`Verification » Could not send verification success DM to ${member.user.tag}:`, dmErr.message);
		}
	};

	// Send DM in background
	await sendVerificationSuccessDM();

	console.log(`Verification » Successfully verified ${member.user.tag} (${member.id}) in guild "${guild.name}"`);

	return res.json(createSuccessResponse(200, `Successfully verified ${member.user.tag} in ${guild.name}`, {
		user: {
			id: member.id,
			username: member.user.username,
			tag: member.user.tag,
		},
		guild: {
			id: guild.id,
			name: guild.name,
		},
	}));
});

const healthCheck = asyncHandler(async (req, res) => {
	const pendingCount = await getPendingVerificationsCount();
	return res.json(createSuccessResponse(200, 'Service healthy', {
		status: 'ok',
		timestamp: new Date().toISOString(),
		uptime: Math.floor(process.uptime()),
		memory: {
			used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
			total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
		},
		pendingVerifications: pendingCount,
	}));
});

const getServerStats = asyncHandler(async (req, res) => {
	const client = req.bot;

	const verificationEnabledServers = [];

	for (const guild of client.guilds.cache.values()) {
		const serverConfig = getServerConfig(guild.id);
		if (serverConfig?.verificationEnabled) {
			verificationEnabledServers.push({ id: guild.id, name: guild.name, memberCount: guild.memberCount });
		}
	}

	const stats = {
		guilds: client.guilds.cache.size,
		users: client.users.cache.size,
		uptime: Math.floor(process.uptime()),
		verificationEnabled: verificationEnabledServers,
	};

	return res.json(createSuccessResponse(200, 'Server stats retrieved successfully', stats));
});

module.exports = {
	getVerificationInfo,
	completeVerification,
	healthCheck,
	getServerStats,
};