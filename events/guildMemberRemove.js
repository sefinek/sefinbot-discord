const { Events, EmbedBuilder } = require('discord.js');
const guilds = require('../guilds.js');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		if (member.user.bot) return;

		// Fetch server configuration
		const serverCfg = guilds.getServerConfig(member.guild.id);
		if (!serverCfg) return console.warn(`EventR » Server config for guild ID ${member.guild.id} was not found`);

		// Send farewell message
		const farewellChannel = member.guild.channels.cache.get(serverCfg.farewellChannelId);
		if (farewellChannel) {
			const memberCount = member.guild.members.cache.filter(m => !m.user.bot).size;

			try {
				await farewellChannel.send({ embeds: [new EmbedBuilder()
					.setColor('#29A6F9')
					.setAuthor({ name: serverCfg.farewellTitle.replace('{user}', member.user.tag), iconURL: member.guild.iconURL() })
					.setDescription(
						serverCfg.farewellDescription
							.replace('{user}', member)
							.replace('{count}', memberCount)
					)
					.setThumbnail(member.user.displayAvatarURL())],
				});
			} catch (err) {
				console.warn(`EventR » Failed to send farewell message in channel ID ${serverCfg.farewellChannelId}:`, err.message);
			}
		}

		// Update voice channel member count
		if (serverCfg.vcMembers && serverCfg.vcMembersChannel) {
			const vcMembersChannel = member.guild.channels.cache.get(serverCfg.vcMembersChannel);
			if (vcMembersChannel) {
				try {
					const updatedCount = member.guild.members.cache.filter(m => !m.user.bot).size;
					await vcMembersChannel.setName(`${serverCfg.vcMembersName.replace('{count}', updatedCount)} ⬇`);
					console.log(`EventR » Updated voice channel member count for guild "${member.guild.name}" to: ${updatedCount}`);
				} catch (err) {
					console.warn(`EventR » Failed to update voice channel member count for guild ID ${member.guild.id}:`, err.message);
				}
			}
		}

		// Log user departure
		console.log(`EventR » User ${member.user.tag} (${member.id}) left the server "${member.guild.name}"`);
	},
};