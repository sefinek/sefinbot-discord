const { Events } = require('discord.js');
const guilds = require('../config/guilds.js');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		if (member.user.bot) return;

		const serverCfg = guilds.getServerConfig(member.guild.id);
		if (!serverCfg) return console.warn(`EventR » Server config for guild ID ${member.guild.id} was not found`);

		const farewellChannel = member.guild.channels.cache.get(serverCfg.events?.farewell?.channelId);
		if (farewellChannel && serverCfg.events?.farewell?.content) {
			const memberCount = member.guild.members.cache.filter(m => !m.user.bot).size;

			try {
				const farewellContent = serverCfg.events.farewell.content(member, memberCount);
				await farewellChannel.send(farewellContent);
			} catch (err) {
				console.warn(`EventR » Failed to send farewell message in channel ID ${serverCfg.events.farewell.channelId}:`, err.message);
			}
		}

		if (serverCfg.voiceChannels?.members?.enabled && serverCfg.voiceChannels?.members?.channelId) {
			const vcMembersChannel = member.guild.channels.cache.get(serverCfg.voiceChannels.members.channelId);
			if (vcMembersChannel) {
				try {
					const updatedCount = member.guild.members.cache.filter(m => !m.user.bot).size;
					const channelNameWithArrow = serverCfg.voiceChannels.members.name
						.replace('{count}', updatedCount)
						.replace('{arrow}', '⬇');
					await vcMembersChannel.setName(channelNameWithArrow);

					setTimeout(async () => {
						try {
							const currentCount = member.guild.members.cache.filter(m => !m.user.bot).size;
							const channelNameNoArrow = serverCfg.voiceChannels.members.name
								.replace('{count}', currentCount)
								.replace('{arrow}', '');
							await vcMembersChannel.setName(channelNameNoArrow);
						} catch (err) {
							console.warn('EventR » Failed to reset member count channel name:', err.message);
						}
					}, 30000);
				} catch (err) {
					console.warn(`EventR » Failed to update voice channel member count for guild ID ${member.guild.id}:`, err.message);
				}
			}
		}

		console.log(`EventR » User ${member.user.tag} (${member.id}) left the server "${member.guild.name}"`);
	},
};