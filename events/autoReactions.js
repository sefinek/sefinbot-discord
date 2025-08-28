const { Events } = require('discord.js');
const guilds = require('../config/guilds.js');
const heartHandlers = require('../scripts/reactionHandlers/heartChannels.js');
const likeDislikeHandlers = require('../scripts/reactionHandlers/suggestions.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(msg) {
		if (msg.author.bot || !msg.guild) return;

		const serverCfg = guilds.getServerConfig(msg.guild.id);
		if (!serverCfg) return;

		try {
			// Heart reaction channels with advanced logic
			if (serverCfg.reactionHeartChannels && serverCfg.reactionHeartChannels.includes(msg.channel.id)) {
				await handleHeartChannels(msg, serverCfg);
			}

			// Like/Dislike reaction channels with advanced logic
			if (serverCfg.reactionLikeDislikeChannels && serverCfg.reactionLikeDislikeChannels.includes(msg.channel.id)) {
				await handleLikeDislikeChannels(msg, serverCfg);
			}

			// Attachment reactions (existing Genshin Stella Mod functionality)
			if (serverCfg.reactionAttachmentChannels && serverCfg.reactionAttachmentChannels.includes(msg.channel.id) && msg.attachments.size > 0) {
				await handleAttachmentReaction(msg, serverCfg);
			}

		} catch (err) {
			console.warn(`Reaction » Failed to process reactions in channel ${msg.channel.name} (${msg.channel.id}):`, err.message);
		}
	},
};

async function handleHeartChannels(msg, serverCfg) {
	const channelHandlers = {
		'1122002450807804034': heartHandlers.handlePokazRyjek, // pokaz-ryjek
		'1122002428510863451': heartHandlers.handlePrzedstawSie, // przedstaw-sie
		'1122006125529792636': heartHandlers.handleWaszeZwierzaki, // wasze-zwierzaki
		'1122003124387848263': heartHandlers.handleLikeDislike, // pokaz-pulpit
	};

	const handler = channelHandlers[msg.channel.id];
	if (handler) {
		await handler(msg);
	} else {
		// Default heart reaction for other configured channels
		const heartEmoji = serverCfg.heartReaction || '❤️';
		await msg.react(heartEmoji);
	}
}

async function handleLikeDislikeChannels(msg, serverCfg) {
	const channelHandlers = {
		'1122002037731774464': likeDislikeHandlers.handlePropozycje, // propozycje
		'1122002472622379129': likeDislikeHandlers.handleMemy, // memy
	};

	const handler = channelHandlers[msg.channel.id];
	if (handler) {
		await handler(msg);
	} else {
		// Default like/dislike reactions for other configured channels
		const reactions = serverCfg.likeDislikeReactions || ['👍', '👎'];
		for (const reaction of reactions) {
			await msg.react(reaction);
		}
	}
}

async function handleAttachmentReaction(msg, serverCfg) {
	const reactions = serverCfg.attachmentReaction || ['👍', '👎'];

	for (const reaction of reactions) {
		await msg.react(reaction);
	}
}