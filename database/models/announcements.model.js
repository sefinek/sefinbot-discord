const { Schema, model } = require('mongoose');

const AnnouncementsModel = new Schema({
	authorId: { type: String, required: true },
	status: { type: Number, default: 201 }, // 201 = pending, 200 = approved, 500 = rejected
	adminId: { type: String, default: null },
	canceledStr: { type: String, default: null },
	announcement: {
		type: { type: String, default: '' },
		bio: { type: String, default: '' },
		desc: { type: String, default: '' },
		img: { type: String, default: null },
	},
	discord: {
		reviewId: { type: String, default: null },
		messageId: { type: String, default: null },
	},
}, { versionKey: false, timestamps: true });

module.exports = model('Announcement', AnnouncementsModel);