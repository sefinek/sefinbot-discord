const VerificationStatus = require('../database/models/verification.model.js');

// Cache for frequently accessed verification data
const verificationCache = new Map();
const CACHE_TTL = 60000; // 1 minute

const getPendingVerification = async token => {
	try {
		// Check cache first
		const cacheKey = `pending_${token}`;
		const cached = verificationCache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return cached.data;
		}

		const verification = await VerificationStatus.findValidToken(token);
		const result = verification ? {
			userId: verification.userId,
			guildId: verification.guildId,
			timestamp: verification.createdAt.getTime(),
		} : null;

		// Cache the result
		verificationCache.set(cacheKey, {
			data: result,
			timestamp: Date.now(),
		});

		return result;
	} catch (err) {
		console.error('VerificationUtils » Error fetching verification token:', err);
		return null;
	}
};

const completePendingVerification = async token => {
	try {
		const verification = await VerificationStatus.useToken(token);
		const result = verification ? {
			userId: verification.userId,
			guildId: verification.guildId,
			timestamp: verification.createdAt.getTime(),
		} : null;

		// Clear cache entries for this token
		verificationCache.delete(`pending_${token}`);

		return result;
	} catch (err) {
		console.error('VerificationUtils » Error completing verification token:', err);
		return null;
	}
};

// Clean expired cache entries every 5 minutes
setInterval(() => {
	const now = Date.now();
	for (const [key, value] of verificationCache.entries()) {
		if (now - value.timestamp > CACHE_TTL * 2) verificationCache.delete(key);
	}
}, 300000);

const clearVerificationCache = token => {
	if (token) {
		verificationCache.delete(`pending_${token}`);
	} else {
		verificationCache.clear();
	}
};

module.exports = {
	getPendingVerification,
	completePendingVerification,
	clearVerificationCache,
};