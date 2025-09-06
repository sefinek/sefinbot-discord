const crypto = require('node:crypto');
const expectedApiKey = process.env.SEFINEK_SECRET;

const validateSefinekToken = (req, res, next) => {
	try {
		// Get API key from X-Secret-Key header
		const apiKey = req.headers['x-secret-key'];
		if (!apiKey) {
			console.log('Auth » Missing X-Secret-Key header');
			return res.status(401).json({ success: false, status: 401, message: 'X-Secret-Key header required' });
		}

		// Verify against shared secret
		if (!expectedApiKey) {
			console.error('Auth » SEFINEK_SECRET environment variable not configured');
			return res.status(500).json({ success: false, status: 500, message: 'Server configuration error' });
		}

		// Secure comparison to prevent timing attacks
		if (!crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(expectedApiKey))) {
			return res.status(403).json({ success: false, status: 403, message: 'Invalid API key' });
		}

		// Token is valid, continue to next middleware/route
		next();
	} catch (err) {
		console.error('Auth » Token validation error:', err);
		return res.status(500).json({ success: false, status: 500, message: 'Authentication error' });
	}
};

const ensureBotClient = (req, res, next) => {
	if (!req.bot?.user) return res.status(503).json({ success: false, status: 503, message: 'Discord bot service is currently unavailable. Please try again later.' });
	next();
};

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
	validateSefinekToken,
	ensureBotClient,
	asyncHandler,
};