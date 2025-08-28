const { EmbedBuilder } = require('discord.js');
const { version } = require('../../package.json');

module.exports = {
	id: '1044713077125435492',

	main: {
		botTrapChannelId: '1224420495710228540',
		automodChannelId: '1044721563628482560',
	},

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1044714427263500288',
			name: '👥・Members: {count} {arrow}',
		},
		online: {
			enabled: true,
			channelId: '1056239296367034509',
			name: '🌍・Online: {count}',
		},
		newest: {
			enabled: true,
			channelId: '1044714728674557992',
			name: '🆕・New: {user}',
		},
	},

	events: {
		welcome: {
			channelId: '1044714444393029722',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#9B59B6')
						.setAuthor({ name: `👋 Member ${member.user.tag} has joined the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Welcome ${member} to our server! We hope our project grabs your interest and gets you hyped to dive into Genshin Impact. Have fun! You are our ${memberCount}th member.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: '1044714444393029722',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#E67E22')
						.setAuthor({ name: `😥 Member ${member.user.tag} has left the server`, iconURL: member.guild.iconURL() })
						.setDescription(`Unfortunately, the user ${member} has left our server. We hope you'll come back soon.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: '1044714444393029722',
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#C0392B')
						.setAuthor({ name: `⚠️ User ${member.tag} has been banned from the server`, iconURL: member.guild.iconURL() })
						.setDescription(`The user <@${member.id}> has been permanently banned from our server due to rule violations. We hope the community continues to be a safe and welcoming place for everyone. Goodbye.`)
						.setThumbnail(member.displayAvatarURL()),
				],
			}),
		},
	},

	directMessages: {
		welcome: {
			enabled: true,
			content: member => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#8E44AD')
						.setAuthor({
							name: `Welcome ${member.user.tag} to our server ${member.guild.name}`,
							iconURL: member.guild.iconURL(),
						})
						.addFields([
							{
								name: '😻 » What does Genshin Stella Mod offer?',
								value: '1. **Enhanced graphics:** Enjoy improved visuals with shaders for a superior gaming experience.\n2. **FPS unlock:** Remove the 60 FPS cap for smoother gameplay, especially on monitors with refresh rates above 60Hz.\n3. **3DMigoto support:** Unlocks a wider range of mods, including character model swaps, all in a safe and stable environment.',
							},
							{
								name: '🐱 » Why should I use Genshin Stella Mod?',
								value: '1. **Own launcher:** Simply click `Start game` in our app to jump right into action with exclusive enhancements!\n2. **Regular updates:** Our software is continuously updated for compatibility with new game versions, shader improvements, security patches, and more.\n3. **Safety guaranteed:** The application is completely safe and ensures security when injecting processes into the game. However, please remember not to cheat!',
							},
							{
								name: '😽 » What benefits will I get by supporting this project?',
								value: '1. **Access to 3DMigoto:** Enjoy the benefits of using ReShade, FPS Unlock, and 3DMigoto together for a more immersive gaming experience.\n2. A curated collection of optimized, **bug-free mods**.\n3. **A shader pack with the latest versions**, all free of bugs. With Stella Plus, **shaders will no longer overlap with the game\'s UI**, offering a cleaner, more polished visual experience.\n4. **Enhanced security:** The mod is designed with safety in mind, ensuring privacy protection and a robust security system.\n5. **And much more!** Discover all the benefits on the [**official website**](https://sefinek.net/genshin-stella-mod/subscription). Choose the tier that suits you best (we recommend the "🌍 Safety Kitten" tier).',
							},
							{
								name: '🙀 » We hope to see you in the Stella Mod Launcher!',
								value: `If you have any questions, feel free to message <@${process.env.OWNER}> or visit the <#1056236234160214138> channel.\n\n>> [\`Click here to download now!\`](https://sefinek.net/genshin-stella-mod) <<`,
							},
						]),
					new EmbedBuilder()
						.setColor('#15070C')
						.setImage(`https://cdn.sefinek.net/discord/sefibot/images/guildMemberAdd.png?version=${version}`)
						.setFooter({
							text: 'Copyright 2024-2025 © by Sefinek. All Rights Reserved.',
							iconURL: member.guild.iconURL(),
						}),
				],
			}),
		},
	},

	reactions: {
		attachment: {
			channels: [
				'1290859071066341507',
				'1153034136529932369',
				'1153020585413193799',
				'1105553290093138100',
			],
			emojis: ['👍', '👎'],
		},
		approve: {
			channels: [
				'1065275114687570011',
				'1099221153622528010',
				'1181323568794063110',
				'1176188888339984405',
				'1155636598684270592',
				'1100031120600481842',
				'1044714926104653844',
				'1044715003783168030',
				'1044715895081156639',
			],
			emoji: '✅',
		},
	},

	features: {
		isDatingServer: false,
		cleverBot: false,
		timeBasedModes: false,
		stellaMod: true,
	},
};