const { Schema, model } = require('mongoose');

const MembersModel = new Schema({
	userId: { type: String, required: true, unique: true },
	bydgoszcz: { type: Boolean, default: false },
	miner: {
		wood: { type: Number, default: 0 },
		stick: { type: Number, default: 0 },
		stone: { type: Number, default: 0 },
		gold: { type: Number, default: 0 },
		iron: { type: Number, default: 0 },
		diamond: { type: Number, default: 0 },
	},
}, { versionKey: false, timestamps: true });

module.exports = model('Member', MembersModel);