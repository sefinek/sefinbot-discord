const { Events, PermissionsBitField } = require('discord.js');
const guilds = require('../config/guilds.js');
const userBlacklist = require('../services/userBlacklist.js');
const VerificationStatus = require('../database/models/verification.model.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		if (member.user.bot) return;
		if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages) && userBlacklist(member.user.username, member.user.displayName)) return member.ban({ reason: 'Blacklist' });

		const serverCfg = guilds.getServerConfig(member.guild.id);
		if (!serverCfg) return console.warn(`EventA » Server config for ${member.guild.id} was not found`);

		const welcomeChannel = member.guild.channels.cache.get(serverCfg.events?.welcome?.channelId);
		if (welcomeChannel && serverCfg.events?.welcome?.content) {
			const memberCount = member.guild.members.cache.filter(m => !m.user.bot).size;

			try {
				const welcomeContent = serverCfg.events.welcome.content(member, memberCount);
				await welcomeChannel.send(welcomeContent);
			} catch (err) {
				console.warn(`EventA » Failed to send welcome message in channel ID ${serverCfg.events.welcome.channelId}:`, err.message);
			}
		}

		if (serverCfg.events?.directMessages?.welcome?.enabled && serverCfg.events?.directMessages?.welcome?.content) {
			try {
				const dmContent = serverCfg.events.directMessages.welcome.content(member);
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
			if (serverCfg.voiceChannels?.members?.enabled && serverCfg.voiceChannels?.members?.channelId) {
				const memberCountChannel = member.guild.channels.cache.get(serverCfg.voiceChannels.members.channelId);
				if (memberCountChannel) {
					const updatedMemberCount = member.guild.members.cache.filter(m => !m.user.bot).size;
					const channelNameWithArrow = typeof serverCfg.voiceChannels.members.name === 'function'
						? serverCfg.voiceChannels.members.name(updatedMemberCount, '⬆')
						: serverCfg.voiceChannels.members.name;
					await memberCountChannel.setName(channelNameWithArrow);
					setTimeout(async () => {
						try {
							const currentCount = member.guild.members.cache.filter(m => !m.user.bot).size;
							const channelNameNoArrow = typeof serverCfg.voiceChannels.members.name === 'function'
								? serverCfg.voiceChannels.members.name(currentCount, '')
								: serverCfg.voiceChannels.members.name;
							await memberCountChannel.setName(channelNameNoArrow);
						} catch (err) {
							console.warn('EventA » Failed to reset member count channel name:', err.message);
						}
					}, 30000);
				}
			}

			if (serverCfg.voiceChannels?.newest?.enabled && serverCfg.voiceChannels?.newest?.channelId) {
				const newMemberChannel = member.guild.channels.cache.get(serverCfg.voiceChannels.newest.channelId);
				if (newMemberChannel) {
					const channelName = typeof serverCfg.voiceChannels.newest.name === 'function'
						? serverCfg.voiceChannels.newest.name(member.user.username)
						: serverCfg.voiceChannels.newest.name;
					await newMemberChannel.setName(channelName);
				}
			}
		} catch (err) {
			console.warn('EventA » Failed to update voice channels when a new user joined the server:', err);
		}

		if (serverCfg.verification?.enabled && serverCfg.verification.unverifiedRoleId) {
			try {
				const unverifiedRole = member.guild.roles.cache.get(serverCfg.verification.unverifiedRoleId);
				if (unverifiedRole) {
					await member.roles.add(unverifiedRole);

					await VerificationStatus.create({
						userId: member.id,
						guildId: member.guild.id,
						joinedAt: member.joinedAt || new Date(),
					});

					console.log(`EventA » Added unverified role and created verification status for ${member.user.tag} (${member.id})`);
				}
			} catch (err) {
				console.warn(`EventA » Failed to add unverified role to ${member.user.tag}:`, err.message);
			}
		}

		console.log(`EventA » User ${member.user.tag} (${member.id}) has joined the server "${member.guild.name}"`);
	},
};