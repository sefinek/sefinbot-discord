const { Events, EmbedBuilder } = require('discord.js');
const guilds = require('../config/guilds.js');

const sendErrorMessage = async (msg, description) => {
	try {
		const errorEmbed = new EmbedBuilder()
			.setColor('#FF6B6B')
			.setAuthor({
				name: `${msg.author.username}, ta akcja nie jest możliwa`,
				iconURL: msg.author.displayAvatarURL(),
			})
			.setDescription(description)
			.setThumbnail(msg.guild.iconURL());

		const [errorMsg] = await Promise.allSettled([
			msg.channel.send({ embeds: [errorEmbed] }),
			msg.delete(),
		]);

		if (errorMsg.status === 'fulfilled') {
			setTimeout(() => errorMsg.value.delete().catch(() => {}), 15 * 1000);
		}

		console.log(`Reaction » User ${msg.author.tag} tried invalid action in ${msg.channel.name}: ${msg.content.slice(0, 100)}`);
	} catch (err) {
		console.error('Reaction » Failed to send error message:', err.message);
	}
};

const validateMessageRequirements = async (msg, reactionConfig) => {
	if (reactionConfig.requiresAttachment && msg.attachments.size === 0) {
		if (reactionConfig.errorMessage) await sendErrorMessage(msg, reactionConfig.errorMessage);
		return false;
	}

	if (reactionConfig.minLength && msg.content.length < reactionConfig.minLength) {
		if (reactionConfig.errorMessage) {
			const errorMsg = typeof reactionConfig.errorMessage === 'function'
				? reactionConfig.errorMessage(reactionConfig.minLength)
				: reactionConfig.errorMessage;

			await sendErrorMessage(msg, errorMsg);
		}
		return false;
	}

	return true;
};

const addConfiguredReactions = async (msg, { emojis }) => {
	if (!emojis?.length) throw new Error(`Reaction enabled for channel ${msg.channel.id} but no emojis configured`);
	await Promise.allSettled(emojis.map(emoji => msg.react(emoji)));
};

const createConfiguredThread = async (msg, { nameTemplate, reason, autoArchiveDuration = 24 * 60, startMessage }) => {
	const threadName = nameTemplate(msg.author);
	const threadReason = typeof reason === 'function' ? reason(msg.author) : reason || 'Auto-created thread';
	const thread = await msg.startThread({
		name: threadName,
		autoArchiveDuration,
		reason: threadReason,
	});
	if (startMessage) await thread.send(startMessage);
	console.log(`Reactions » Created thread "${threadName}" for ${msg.author.tag} in ${msg.channel.name}`);
};

const handleReactionType = async (msg, reactionType, reactionConfig) => {
	try {
		if (!await validateMessageRequirements(msg, reactionConfig)) return;

		await addConfiguredReactions(msg, reactionConfig);

		if (reactionConfig.createThread && reactionConfig.threadConfig) await createConfiguredThread(msg, reactionConfig.threadConfig);
	} catch (err) {
		console.error(`Reactions » Failed to handle ${reactionType} reaction for ${msg.author.tag}:`, err.message);
	}
};

module.exports = {
	name: Events.MessageCreate,
	execute: async msg => {
		if (msg.author.bot || !msg.guild) return;

		const serverCfg = guilds.getServerConfig(msg.guild.id);
		if (!serverCfg?.reactions) return;

		const matchingReactions = Object.entries(serverCfg.reactions).filter(([, config]) => config.channels?.includes(msg.channel.id));
		if (!matchingReactions.length) return;

		await Promise.allSettled(matchingReactions.map(([type, config]) => handleReactionType(msg, type, config)));
	},
};