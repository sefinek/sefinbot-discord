const { Events, EmbedBuilder } = require('discord.js');
const guilds = require('../guilds.js');
const userBlacklist = require('../services/userBlacklist.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		if (member.user.bot) return;
		if (userBlacklist(member.user.username, member.user.displayName)) return member.ban({ reason: 'Blacklist' });

		// Fetch server configuration
		const serverCfg = guilds.getServerConfig(member.guild.id);
		if (!serverCfg) return console.warn(`EventA » Server config for ${member.guild.id} was not found`);

		// Send welcome message to a designated channel
		const welcomeChannel = member.guild.channels.cache.get(serverCfg.welcomeChannelId);
		if (welcomeChannel) {
			const memberCount = member.guild.members.cache.filter(m => !m.user.bot).size;

			try {
				await welcomeChannel.send({ embeds: [new EmbedBuilder()
					.setColor('#2EE47B')
					.setAuthor({ name: serverCfg.welcomeTitle.replace('{user}', member.user.tag), iconURL: member.guild.iconURL() })
					.setDescription(
						serverCfg.welcomeDescription
							.replace('{user}', member)
							.replace('{count}', memberCount)
					)
					.setThumbnail(member.user.displayAvatarURL())],
				});
			} catch (err) {
				console.warn(`EventA » Failed to send welcome message in channel ID ${serverCfg.welcomeChannelId}:`, err.message);
			}
		}

		// Send direct message to the new member
		if (serverCfg.joinMsgDM) {
			try {
				const embeds = [new EmbedBuilder()
					.setColor('#67190A')
					.setAuthor({
						name: serverCfg.joinMsgDMTitle.replace('{userTag}', member.user.tag).replace('{guildName}', member.guild.name),
						iconURL: member.user.displayAvatarURL(),
					})
					.addFields(serverCfg.joinMsgDMFields)];

				if (serverCfg.joinMsgDMFooter) {
					embeds.push(
						new EmbedBuilder()
							.setColor('#15070C')
							.setImage(serverCfg.joinMsgDMFooterImage)
							.setFooter({ text: 'Copyright 2024-2025 © by Sefinek. All Rights Reserved.', iconURL: member.guild.iconURL() })
					);
				}

				await member.send({ embeds });
			} catch (err) {
				if (err.code === 50007) {
					console.log('EventA » Failed to send a direct message to the user. They may have disabled direct messages.', err);
				} else {
					console.warn('EventA » Failed to send a direct message to the user who recently joined the server.', err.message);
				}
			}
		}

		// Update server stats (voice channels)
		try {
			// Update member count channel
			if (serverCfg.vcMembers && serverCfg.vcMembersChannel) {
				const memberCountChannel = member.guild.channels.cache.get(serverCfg.vcMembersChannel);
				if (memberCountChannel) {
					const updatedMemberCount = member.guild.members.cache.filter(m => !m.user.bot).size;
					await memberCountChannel.setName(`${serverCfg.vcMembersName.replace('{count}', updatedMemberCount)} ⬆`);
				}
			}

			// Update new member channel
			if (serverCfg.vcNew && serverCfg.vcNewChannel) {
				const newMemberChannel = member.guild.channels.cache.get(serverCfg.vcNewChannel);
				if (newMemberChannel) await newMemberChannel.setName(`${serverCfg.vcNewName.replace('{user}', member.user.username)}`);
			}
		} catch (err) {
			console.warn('EventA » Failed to update voice channels when a new user joined the server:', err);
		}

		// Log new member
		console.log(`EventA » User ${member.user.tag} (${member.id}) has joined the server "${member.guild.name}"`);
	},
};