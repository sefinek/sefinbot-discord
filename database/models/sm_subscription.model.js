const { Schema, model } = require('mongoose');

const MailHistory = new Schema({
	from: { type: String, required: true },
	to: { type: String, required: true },
	subject: { type: String, required: true },
	content: { type: String, required: true },
	date: { type: Date, required: true },
	queue: { type: String, required: true },
	status: { type: String, required: true, enum: ['unread', 'read'], default: 'unread' },
	discord: Boolean,
});

const SubscriptionSchema = new Schema({
	userId: { type: String, required: true, unique: true, index: true },
	patreonId: { type: String, unique: true, sparse: true, index: true },

	username: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: true,
		index: true,
		lowercase: true,
		trim: true,
		match: [
			/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
			'Please fill a valid email address',
		],
	},
	password: String,
	verificationCode: String,
	verificationCodeFull: String,
	activeAccount: { type: Boolean, default: false },
	position: { type: Number, default: 0, enum: [0, 1, 2, 3, 4, 5] },
	banned: { type: Boolean, default: false },

	avatar: { type: String, default: 'https://patrons.sefinek.net/images/stella/256x256.jpg' },
	customAvatar: { type: Boolean, default: false },
	lastAvatarUpdate: Date,
	lastGravatarUpdate: Date,
	profileIsPrivate: { type: Boolean, default: false },

	stats: {
		numberOfLogins: { type: Number, default: 0 },
		lastLogin: { type: Date, default: Date.now },
	},

	authProvider: {
		type: String,
		required: true,
		enum: ['local', 'discord', 'google', 'twitter', 'twitch', 'microsoft'],
	},
	dscAccountLinked: { type: Boolean, default: false },
	dscAccount: { type: Boolean, default: false },
	discordAccountNotify: { type: Boolean, default: false },
	subscriptionType: {
		type: String,
		enum: ['patreon', 'stripe'],
	},
	benefitId: {
		type: Number,
		required: true,
		validate: {
			validator: Number.isInteger,
			message: '{VALUE} is not an integer',
		},
	},
	isActive: { type: Boolean, required: true, default: false },
	subscriptionDate: Date,
	stripe: {
		customerId: { type: String, unique: true, sparse: true },
		subscriptionId: { type: String, unique: true, sparse: true },
		priceId: String,
	},
	google: {
		id: { type: String, required: true },
		username: { type: String, required: true },
		emailVerified: { type: Boolean, required: true },
	},
	verification: {
		id: { type: String, required: true, unique: true, sparse: true },
		required: { type: Boolean, default: false },
		status: { type: String, default: null },
		url: String,
		finishedAt: Date,
	},
	discord: {
		dcUserId: {
			type: String,
			required: true,
			unique: true,
			sparse: true,
		},
		username: { type: String, default: null, required: true },
		globalName: { type: String, default: null },
		accessToken: { type: String, default: null },

		roles: {
			status: {
				type: String,
				default: null,
				enum: ['zero', 'joining', 'waitingForRoles', 'updatingRoles', 'updatedRoles', 'accountIsCurrentlyLinked'],
			},

			lastUpdate: Date,
			lastFail: Date,
			lastFailMessage: String,
			success: Number,
			realized: { type: Boolean, default: false },
		},
	},
	twitter: {
		id: { type: String, required: true },
		displayName: { type: String, required: true },
		username: { type: String, required: true },
	},
	github: {
		id: { type: String, required: true },
		nodeId: { type: String, required: true },
		username: { type: String, required: true },
		profileUrl: { type: String, required: true },
		accType: { type: String, required: true },
		location: { type: String, required: true },
	},
	twitch: {
		id: { type: String, required: true },
		username: { type: String, required: true },
		displayName: { type: String, required: true },
	},
	microsoft: {
		id: { type: String, required: true },
		displayName: { type: String, required: true },
		preferredLanguage: { type: String, required: true },
	},
	mirror: {
		selectedServer: { type: Number, default: 0, required: true },
		previousServer: { type: Number, default: null },
	},
	correspondence: {
		email: { type: Boolean, default: true },
		discord: { type: Boolean, default: true },
	},
	mails: {
		type: [MailHistory],
		default: [],
	},
}, { versionKey: false, timestamps: true });

module.exports = model('SmSubscription', SubscriptionSchema, 'sm_subscriptions');