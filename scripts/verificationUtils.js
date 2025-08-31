const VerificationStatus = require('../database/models/verification.model.js');

const getPendingVerification = async token => {
	try {
		const verification = await VerificationStatus.findValidToken(token);
		return verification ? {
			userId: verification.userId,
			guildId: verification.guildId,
			timestamp: verification.createdAt.getTime(),
		} : null;
	} catch (err) {
		console.error('VerificationUtils » Error fetching verification token:', err);
		return null;
	}
};

const completePendingVerification = async token => {
	try {
		const verification = await VerificationStatus.useToken(token);
		return verification ? {
			userId: verification.userId,
			guildId: verification.guildId,
			timestamp: verification.createdAt.getTime(),
		} : null;
	} catch (err) {
		console.error('VerificationUtils » Error completing verification token:', err);
		return null;
	}
};

const getPendingVerificationsCount = async () => {
	try {
		return await VerificationStatus.countActive();
	} catch (err) {
		console.error('VerificationUtils » Error counting verification tokens:', err);
		return 0;
	}
};

module.exports = {
	getPendingVerification,
	completePendingVerification,
	getPendingVerificationsCount,
};