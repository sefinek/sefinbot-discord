const crypto = require('node:crypto');

const validateSefinekToken = (req, res, next) => {
	try {
		// Get API key from X-Secret-Key header
		const apiKey = req.headers['x-secret-key'];
		if (!apiKey) {
			console.log('Auth » Missing X-Secret-Key header');
			return res.status(401).json({ success: false, status: 401, message: 'X-Secret-Key header required', error: 'MISSING_SECRET_KEY' });
		}

		// Validate API key format (hex string) - temporarily disabled for testing
		if (!(/^[a-f0-9]+$/i).test(apiKey)) {
			return res.status(401).json({ success: false, status: 401, message: 'Invalid API key format', error: 'INVALID_TOKEN_FORMAT' });
		}

		// Verify against shared secret
		const expectedApiKey = process.env.SEFINEK_SECRET;
		if (!expectedApiKey) {
			console.error('Auth » SEFINEK_SECRET environment variable not configured');
			return res.status(500).json({ success: false, status: 500, message: 'Server configuration error', error: 'SERVER_CONFIG_ERROR' });
		}

		// Secure comparison to prevent timing attacks
		if (!crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(expectedApiKey))) {
			return res.status(403).json({ success: false, status: 403, message: 'Invalid API key', error: 'INVALID_TOKEN' });
		}

		// Token is valid, continue to next middleware/route
		next();
	} catch (err) {
		console.error('Auth » Token validation error:', err);
		return res.status(500).json({ success: false, status: 500, message: 'Authentication error', error: 'AUTH_ERROR' });
	}
};

const ensureBotClient = (req, res, next) => {
	if (!req.bot?.user) return res.status(503).json({ success: false, status: 503, message: 'Bot service unavailable', error: 'BOT_UNAVAILABLE' });
	next();
};

const asyncHandler = fn => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

module.exports = {
	validateSefinekToken,
	ensureBotClient,
	asyncHandler,
};