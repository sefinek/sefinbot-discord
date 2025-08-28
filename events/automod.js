const { Events, PermissionsBitField, EmbedBuilder } = require('discord.js');
const guilds = require('../config/guilds.js');
const checkMessage = require('../services/checkMessage.js');
const userBlacklist = require('../services/userBlacklist.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(msg, client) {
		if (!msg.guild || msg.author.bot) return;
		if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && userBlacklist(msg.author.username, msg.author.displayName)) {
			return msg.member.ban({ reason: 'Blacklist (userBlacklist)', deleteMessageSeconds: 604800 });
		}

		const serverCfg = guilds.getServerConfig(msg.guild.id);
		if (!serverCfg) return console.warn(`EventM » Server config for ${msg.guild.id} was not found`);

		// Bot trap channel logic
		if (msg.channel.id === serverCfg.botTrapChannelId && !msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			try {
				await msg.delete();
				await msg.member.ban({ reason: `Bot trap: ${msg.content}`, deleteMessageSeconds: 604800 });

				const automodChannel = msg.guild.channels.cache.get(serverCfg.automodChannelId);
				if (automodChannel) {
					await automodChannel.send({ embeds: [new EmbedBuilder()
						.setColor('#0012FF')
						.setAuthor({ name: `${msg.author.username} - ${msg.guild.name} (${msg.guild.id})`, iconURL: msg.author.displayAvatarURL() })
						.setDescription(`**Message sent by ${msg.author} deleted in ${msg.channel}**\n${msg.content}`)
						.addFields([{ name: 'Reason', value: 'Bot trap' }])
						.setTimestamp()
						.setFooter({ text: `ID: ${msg.author.id} • Tag: ${msg.author.tag}` }),
					] });
				}
			} catch (err) {
				console.error('EventM » Failed to handle bot trap message:', err.message);
			}

			return;
		}

		// Validate message
		const validationSuccess = await checkMessage(client, msg, 'create', serverCfg);
		if (!validationSuccess) return;

		if (validationSuccess.category)

		// Add reactions to messages with attachments
		{if (serverCfg.reactionAttachmentChannels?.includes(msg.channel.id) && msg.attachments.size > 0) {
			try {
				await Promise.all(serverCfg.attachmentReaction.map(reaction => msg.react(reaction)));
			} catch (err) {
				console.error(`EventM » Failed to add reactions to message in ${msg.channel.name}:`, err.message);
			}
			return;
		}}

		// Add approval reactions in specific channels
		if (serverCfg.reactionApproveChannels?.includes(msg.channel.id)) {
			try {
				await msg.react(serverCfg.approveReaction);
			} catch (err) {
				console.error(`EventM » Failed to add approval reaction to message in ${msg.channel.name}:`, err.message);
			}
		}
	},
};