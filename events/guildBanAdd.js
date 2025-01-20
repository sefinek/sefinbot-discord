const { Events, EmbedBuilder } = require('discord.js');
const guilds = require('../guilds.js');

module.exports = {
	name: Events.GuildBanAdd,
	async execute(ban) {
		const { guild, user } = ban;
		if (user.bot) return;

		const serverCfg = guilds.getServerConfig(guild.id);
		if (!serverCfg) return console.warn(`EventB » Server config for ${guild.id} was not found`);

		// Handle ban notification
		const banNotificationChannel = guild.channels.cache.get(serverCfg.banChannelId);
		if (banNotificationChannel) {
			try {
				await banNotificationChannel.send({ embeds: [new EmbedBuilder()
					.setColor('#FF0000')
					.setAuthor({ name: serverCfg.banTitle.replace('{user}', user.tag), iconURL: user.displayAvatarURL() })
					.setDescription(serverCfg.banDescription.replace('{user}', user))
					.setThumbnail(user.displayAvatarURL()),
				] });
			} catch (err) {
				console.error(`EventB » Failed to send ban notification in channel ID ${serverCfg.banChannelId}:`, err.message);
			}
		}

		// Update voice channel member count
		if (serverCfg.vcMembers && serverCfg.vcMembersChannel) {
			const memberCountChannel = guild.channels.cache.get(serverCfg.vcMembersChannel);
			if (memberCountChannel) {
				try {
					const memberCount = guild.members.cache.filter(m => !m.user.bot).size;
					await memberCountChannel.setName(`${serverCfg.vcMembersName.replace('{count}', memberCount)} ⬆`);
				} catch (err) {
					console.warn(`EventB » Failed to update member count for guild ID ${guild.id}:`, err.message);
				}
			}
		}

		console.log(`EventB » User ${user.tag} (${user.id}) has been banned from the server "${guild.name}"`);
	},
};