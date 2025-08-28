const { Events, PermissionsBitField } = require('discord.js');
const guilds = require('../config/guilds.js');
const userBlacklist = require('../services/userBlacklist.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		if (member.user.bot) return;
		if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages) && userBlacklist(member.user.username, member.user.displayName)) return member.ban({ reason: 'Blacklist' });

		const serverCfg = guilds.getServerConfig(member.guild.id);
		if (!serverCfg) return console.warn(`EventA » Server config for ${member.guild.id} was not found`);

		const welcomeChannel = member.guild.channels.cache.get(serverCfg.welcomeChannelId);
		if (welcomeChannel && serverCfg.welcomeContent) {
			const memberCount = member.guild.members.cache.filter(m => !m.user.bot).size;

			try {
				const welcomeContent = serverCfg.welcomeContent(member, memberCount);
				await welcomeChannel.send(welcomeContent);
			} catch (err) {
				console.warn(`EventA » Failed to send welcome message in channel ID ${serverCfg.welcomeChannelId}:`, err.message);
			}
		}

		if (serverCfg.joinMsgDM && serverCfg.joinMsgDMContent) {
			try {
				const dmContent = serverCfg.joinMsgDMContent(member);
				await member.send(dmContent);
			} catch (err) {
				if (err.code === 50007) {
					console.log('EventA » Failed to send a direct message to the user. They may have disabled direct messages.', err);
				} else {
					console.warn('EventA » Failed to send a direct message to the user who recently joined the server.', err.message);
				}
			}
		}

		try {
			if (serverCfg.vcMembers && serverCfg.vcMembersChannel) {
				const memberCountChannel = member.guild.channels.cache.get(serverCfg.vcMembersChannel);
				if (memberCountChannel) {
					const updatedMemberCount = member.guild.members.cache.filter(m => !m.user.bot).size;
					const channelNameWithArrow = serverCfg.vcMembersName
						.replace('{count}', updatedMemberCount)
						.replace('{arrow}', '⬆');
					await memberCountChannel.setName(channelNameWithArrow);
					setTimeout(async () => {
						try {
							const currentCount = member.guild.members.cache.filter(m => !m.user.bot).size;
							const channelNameNoArrow = serverCfg.vcMembersName
								.replace('{count}', currentCount)
								.replace('{arrow}', '');
							await memberCountChannel.setName(channelNameNoArrow);
						} catch (err) {
							console.warn('EventA » Failed to reset member count channel name:', err.message);
						}
					}, 30000);
				}
			}

			if (serverCfg.vcNew && serverCfg.vcNewChannel) {
				const newMemberChannel = member.guild.channels.cache.get(serverCfg.vcNewChannel);
				if (newMemberChannel) await newMemberChannel.setName(`${serverCfg.vcNewName.replace('{user}', member.user.username)}`);
			}
		} catch (err) {
			console.warn('EventA » Failed to update voice channels when a new user joined the server:', err);
		}

		console.log(`EventA » User ${member.user.tag} (${member.id}) has joined the server "${member.guild.name}"`);
	},
};