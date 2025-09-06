const { Schema, model } = require('mongoose');

const VerificationStatusSchema = new Schema({
	// User & Guild identification
	userId: { type: String, required: true, index: true },
	guildId: { type: String, required: true, index: true },
	country: { type: String, default: null, maxlength: 2 },

	// User data (cached from Discord)
	user: {
		displayName: { type: String, default: null },
		username: { type: String, default: null },
		avatar: { type: String, default: null },
	},

	// Server data (cached from Discord)
	server: {
		name: { type: String, default: null },
		icon: { type: String, default: null },
	},

	// Verification status
	verified: { type: Boolean, default: false, index: true },
	verifiedAt: { type: Date, default: null },
	joinedAt: { type: Date, required: true, default: Date.now, index: true },

	// Token management
	token: {
		type: String,
		minlength: 128,
		maxlength: 128,
		match: /^[a-f0-9]{128}$/i,
	},
	tokenExpiresAt: { type: Date },
	tokenUsed: { type: Boolean, default: false },
	firstTokenGeneratedAt: { type: Date, default: null },

	// Reminder system
	lastReminderSentAt: { type: Date, default: null },
	reminderCount: { type: Number, default: 0 },
	kickWarningAt: { type: Date, default: null },
}, { versionKey: false, timestamps: true });

// Optimized compound indexes
VerificationStatusSchema.index({ userId: 1, guildId: 1 }, { unique: true });
VerificationStatusSchema.index({ token: 1 }, { unique: true, sparse: true });
VerificationStatusSchema.index({ verified: 1, tokenExpiresAt: 1 });
VerificationStatusSchema.index({ verified: 1, joinedAt: 1 });
VerificationStatusSchema.index({ guildId: 1, verified: 1, joinedAt: 1 });
VerificationStatusSchema.index({ tokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

// Static methods
VerificationStatusSchema.statics.findValidToken = function(token) {
	return this.findOne({
		token,
		tokenUsed: false,
		verified: false,
		$or: [
			{ tokenExpiresAt: null },
			{ tokenExpiresAt: { $gt: new Date() } },
		],
	}).lean();
};

VerificationStatusSchema.statics.useToken = function(token) {
	return this.findOneAndUpdate(
		{
			token,
			tokenUsed: false,
			verified: false,
			$or: [
				{ tokenExpiresAt: null },
				{ tokenExpiresAt: { $gt: new Date() } },
			],
		},
		{ tokenUsed: true, verified: true, verifiedAt: new Date() },
		{ new: true }
	);
};

VerificationStatusSchema.statics.countActive = function() {
	return this.countDocuments({
		verified: false,
		$or: [
			{ tokenExpiresAt: null },
			{ tokenExpiresAt: { $gt: new Date() } },
		],
	}).hint({ verified: 1, tokenExpiresAt: 1 });
};

VerificationStatusSchema.statics.findUsersNeedingReminder = function() {
	const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
	return this.find({
		verified: false,
		joinedAt: { $lt: twoDaysAgo },
		$and: [
			{
				$or: [
					{ tokenExpiresAt: null },
					{ tokenExpiresAt: { $gt: new Date() } },
				],
			},
			{
				$or: [
					{ lastReminderSentAt: null },
					{ lastReminderSentAt: { $lt: oneDayAgo } },
				],
			},
		],
	}).lean().hint({ verified: 1, joinedAt: 1 });
};

VerificationStatusSchema.statics.findUsersForKickWarning = function() {
	const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
	return this.find({
		verified: false,
		joinedAt: { $lt: threeDaysAgo },
		kickWarningAt: null,
		$or: [
			{ tokenExpiresAt: null },
			{ tokenExpiresAt: { $gt: new Date() } },
		],
	}).lean().hint({ verified: 1, joinedAt: 1 });
};

VerificationStatusSchema.statics.findUsersToKick = function() {
	const fourDaysAgo = new Date(Date.now() - 96 * 60 * 60 * 1000);
	return this.find({
		verified: false,
		joinedAt: { $lt: fourDaysAgo },
	}).lean().hint({ verified: 1, joinedAt: 1 });
};

VerificationStatusSchema.statics.cleanUserTokens = function(userId, guildId) {
	return this.updateMany(
		{ userId, guildId, verified: false },
		{ $unset: { token: 1, tokenExpiresAt: 1 }, $set: { tokenUsed: false } }
	);
};

VerificationStatusSchema.statics.cleanExpiredTokens = function() {
	return this.updateMany(
		{
			tokenExpiresAt: { $lt: new Date() },
			verified: false,
			tokenUsed: false,
		},
		{ $unset: { token: 1, tokenExpiresAt: 1 }, $set: { tokenUsed: false } },
		{ hint: { tokenExpiresAt: 1 } }
	);
};

// Instance methods
VerificationStatusSchema.methods.sendReminder = function() {
	this.lastReminderSentAt = new Date();
	this.reminderCount += 1;
	return this.save();
};

VerificationStatusSchema.methods.sendKickWarning = function() {
	this.kickWarningAt = new Date();
	return this.save();
};

module.exports = model('VerificationStatus', VerificationStatusSchema, 'sefibot-verifications');