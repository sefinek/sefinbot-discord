const { Schema, model } = require('mongoose');

const ObcySessions = new Schema({
	userId: { type: String, required: true, index: true },
	channelId: { type: String },
	ckey: { type: String },
	loadingMsgId: { type: String, default: null },
	closed: { type: Boolean, default: false },
	attempts: { type: Number, default: 0 },
	ceId: { type: Number, default: 0 }, // Wszystkie pakiety wysłane przez użytkownika (bieżąca sesja)
	idn: { type: Number, default: 0 }, // Pakiety wysłane tylko w konwersacji
	conversation: { type: Array, default: [] },
	packets: { type: Array, default: [] },
}, { versionKey: false });

module.exports = model('ObcySession', ObcySessions, '6obcy-sessions');