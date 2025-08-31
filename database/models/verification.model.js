const { Schema, model } = require('mongoose');

const VerificationStatusSchema = new Schema({
	userId: { type: String, required: true, unique: true },
	guildId: { type: String, required: true },

	joinedAt: { type: Date, required: true, default: Date.now, index: true },

	token: {
		type: String,
		minlength: 128,
		maxlength: 128,
		unique: true,
		sparse: true,
		match: /^[a-f0-9]{128}$/i,
	},
	tokenExpiresAt: { type: Date },
	tokenUsed: { type: Boolean, default: false },

	firstTokenGeneratedAt: { type: Date, default: null },
	lastReminderSentAt: { type: Date, default: null },
	reminderCount: { type: Number, default: 0 },

	verified: { type: Boolean, default: false, index: true },
	verifiedAt: { type: Date, default: null },

	kickWarningAt: { type: Date, default: null },
}, { versionKey: false, timestamps: true });

// Static methods
VerificationStatusSchema.statics.findValidToken = function(token) {
	return this.findOne({ token, tokenUsed: false, verified: false });
};

VerificationStatusSchema.statics.useToken = function(token) {
	return this.findOneAndUpdate(
		{ token, tokenUsed: false, verified: false },
		{ tokenUsed: true, verified: true, verifiedAt: new Date() },
		{ new: true }
	);
};

VerificationStatusSchema.statics.countActive = function() {
	return this.countDocuments({ verified: false });
};

VerificationStatusSchema.statics.findUsersNeedingReminder = function() {
	const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
	return this.find({
		verified: false,
		joinedAt: { $lt: twoDaysAgo },
		$or: [
			{ lastReminderSentAt: null },
			{ lastReminderSentAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
		],
	});
};

VerificationStatusSchema.statics.findUsersForKickWarning = function() {
	const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
	return this.find({
		verified: false,
		joinedAt: { $lt: threeDaysAgo },
		kickWarningAt: null,
	});
};

VerificationStatusSchema.statics.findUsersToKick = function() {
	const fourDaysAgo = new Date(Date.now() - 96 * 60 * 60 * 1000);
	return this.find({
		verified: false,
		joinedAt: { $lt: fourDaysAgo },
	});
};

VerificationStatusSchema.statics.cleanUserTokens = function(userId, guildId) {
	return this.deleteMany({ userId, guildId, verified: false });
};

// Instance methods
VerificationStatusSchema.methods.sendReminder = function() {
	return this.model('VerificationStatus').updateOne(
		{ _id: this._id },
		{
			lastReminderSentAt: new Date(),
			$inc: { reminderCount: 1 },
		}
	);
};

VerificationStatusSchema.methods.sendKickWarning = function() {
	return this.model('VerificationStatus').updateOne(
		{ _id: this._id },
		{ kickWarningAt: new Date() }
	);
};

module.exports = model('VerificationStatus', VerificationStatusSchema, 'sefibot-verifications');
