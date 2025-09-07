const { Events, EmbedBuilder } = require('discord.js');
const guilds = require('../config/guilds.js');

const sendErrorMessage = async (msg, description) => {
	try {
		const errorEmbed = new EmbedBuilder()
			.setColor('#FF6B6B')
			.setAuthor({ name: `${msg.author.username}, ta akcja nie jest możliwa`, iconURL: msg.author.displayAvatarURL() })
			.setDescription(description)
			.setThumbnail(msg.guild.iconURL());

		const [errorMsg] = await Promise.allSettled([
			msg.channel.send({ embeds: [errorEmbed] }),
			msg.delete(),
		]);

		if (errorMsg.status === 'fulfilled') {
			setTimeout(() => errorMsg.value.delete().catch(() => null), 15 * 1000);
		}

		console.log(`React  » User ${msg.author.username} (${msg.author.id}) tried invalid action in ${msg.channel.name} (${msg.channel.id}): ${description}\n${msg.content.slice(0, 100)}`);
	} catch (err) {
		console.error('React  » Failed to send error message:', err.message);
	}
};

const validateMessage = async (msg, validation) => {
	if (!validation) return true;

	// Image validation
	if (validation.onlyImages && msg.attachments.size === 0) {
		await sendErrorMessage(msg, validation.onlyImages.message);
		return false;
	}

	// Text length validation
	if (validation.textLength) {
		const { min, max, message } = validation.textLength;
		const textLength = msg.content.length;

		if (min && textLength < min) {
			const errorMsg = typeof message === 'function' ? message(min) : message;
			await sendErrorMessage(msg, errorMsg);
			return false;
		}

		if (max && textLength > max) {
			const errorMsg = typeof message === 'function' ? message(max) : message;
			await sendErrorMessage(msg, errorMsg);
			return false;
		}
	}

	return true;
};

const addReactions = async (msg, emojis) => {
	if (!emojis?.length) return;

	try {
		await Promise.allSettled(emojis.map(emoji => msg.react(emoji)));
	} catch (err) {
		console.error('React  » Failed to add reactions:', err.message);
	}
};

const createThread = async (msg, threadConfig) => {
	if (!threadConfig.enabled) return null;

	try {
		const threadName = typeof threadConfig.nameTemplate === 'function'
			? threadConfig.nameTemplate(msg.author)
			: threadConfig.nameTemplate || `${msg.author.username}: Thread`;

		const threadReason = typeof threadConfig.reason === 'function'
			? threadConfig.reason(msg.author)
			: threadConfig.reason || 'Auto-created thread';

		const thread = await msg.startThread({
			name: threadName,
			autoArchiveDuration: threadConfig.autoArchiveDuration || 24 * 60,
			reason: threadReason,
		});

		if (threadConfig.startMessage) {
			await thread.send(threadConfig.startMessage);
		}

		return threadName;
	} catch (err) {
		console.error(`React  » Failed to create thread for ${msg.author.username}:`, err.message);
		return null;
	}
};

const handleReactionConfig = async (msg, reactionConfig) => {
	try {
		// Validate message requirements
		if (!await validateMessage(msg, reactionConfig.validation)) return;

		let createdThreadName = null;

		// Add emoji reactions
		if (reactionConfig.emojis?.length) {
			await addReactions(msg, reactionConfig.emojis);
		}

		// Create thread if configured
		if (reactionConfig.thread?.enabled) {
			createdThreadName = await createThread(msg, reactionConfig.thread);
		}

		// Build log message
		const emojis = reactionConfig.emojis?.join(' ') || 'no emojis';
		const threadInfo = createdThreadName ? `, thread: "${createdThreadName}"` : '';

		console.log(
			`React  » Applied "${reactionConfig.name}" (${emojis}${threadInfo}) ` +
			`for ${msg.author.username} (${msg.author.id}) ` +
			`in #${msg.channel.name} (${msg.channel.id}) ` +
			`on ${msg.guild.name} (${msg.guild.id})`
		);
	} catch (err) {
		console.error(`React  » Failed to handle reaction config "${reactionConfig.name}":`, err.message);
	}
};

module.exports = {
	name: Events.MessageCreate,
	execute: async msg => {
		if (msg.author.bot || !msg.guild) return;

		const serverCfg = guilds.getServerConfig(msg.guild.id);
		if (!serverCfg?.reactions || !Array.isArray(serverCfg.reactions)) return;

		const matchingReactions = serverCfg.reactions.filter(reaction =>
			reaction.enabled !== false && reaction.channels?.includes(msg.channel.id)
		);

		if (matchingReactions.length) {
			await Promise.allSettled(
				matchingReactions.map(reaction => handleReactionConfig(msg, reaction))
			);
		}
	},
};