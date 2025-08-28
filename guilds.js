const { EmbedBuilder } = require('discord.js');
const { version } = require('./package.json');

const production = {
	'1305001399494377533': {
		// Main Configuration
		botTrapChannelId: null,
		automodChannelId: '1328500595908280421',

		// Voice Channel Stats
		vcMembers: true,
		vcMembersChannel: '1328500744361480192',
		vcMembersName: '👥・Members: {count}',

		vcOnline: true,
		vcOnlineChannel: '1328500785176252439',
		vcOnlineName: '🌍・Online: {count}',

		vcNew: true,
		vcNewChannel: '1328500800086999080',
		vcNewName: '👋・New: {user}',

		// Server Event Logs
		welcomeChannelId: '1328500677944803358',
		welcomeContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#2ECC71')
					.setAuthor({
						name: `👋 Member ${member.user.tag} has joined the server`,
						iconURL: member.user.displayAvatarURL(),
					})
					.setDescription(`Welcome, ${member}, to our server!`)
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		farewellChannelId: '1328500677944803358',
		farewellContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#E74C3C')
					.setAuthor({
						name: `😥 Member ${member.user.tag} has left the server`,
						iconURL: member.user.displayAvatarURL(),
					})
					.setDescription(`Unfortunately, the user with the name ${member} has left our server. We hope that you will come back to us soon.`)
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		banChannelId: '1328500677944803358',
		banContent: (user, guild, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#992D22')
					.setAuthor({
						name: `⚠️ User ${user.tag} has been banned from the server`,
						iconURL: user.displayAvatarURL(),
					})
					.setDescription(`The user with the name <@${user.id}> has been permanently banned from our server due to violations of our rules. We hope that the community remains safe and welcoming for all. Goodbye.`)
					.setThumbnail(user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		// Direct Messages
		joinMsgDM: true,
		joinMsgDMContent: (member) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#3498DB')
					.setAuthor({
						name: `Welcome ${member.user.tag} on ${member.guild.name}!`,
						iconURL: member.guild.iconURL() || undefined,
					})
					.setDescription('Welcome to our server! We\'re glad to have you here.')
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		// Reaction Configuration
		reactionApproveChannels: [
			'1305011381959004282',
			'1305011521855819847',
		],
		approveReaction: '✅',
	},


	// Pomoc IT - Sefinek
	'1002327795344621669': {
		// Main
		botTrapChannelId: null,
		automodChannelId: '1002371687746109490',

		// Stats
		vcMembers: true,
		vcMembersChannel: '1328449218528022610',
		vcMembersName: '👥・{count} ludu',

		vcOnline: true,
		vcOnlineChannel: '1328449298698076222',
		vcOnlineName: '🌍・Online: {count}',

		vcNew: true,
		vcNewChannel: '1328452652836716629',
		vcNewName: '👋・{user}',

		// Server logs
		welcomeChannelId: '1002327796468699218',
		welcomeContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#00D26A')
					.setAuthor({
						name: `👋 Użytkownik ${member.user.tag} dołączył do nas`,
						iconURL: member.user.displayAvatarURL(),
					})
					.setDescription(`Witaj ${member} na naszym serwerze! Mamy wielką nadzieje, że zostaniesz u nas na dłuższy czas. Miłego pobytu.\nJesteś naszym **${memberCount}. gościem**. Dziękujemy Ci za dołączenie!`)
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		farewellChannelId: '1002327796468699218',
		farewellContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#FF6B6B')
					.setAuthor({
						name: `😥 Użytkownik ${member.user.tag} opuścił serwer`,
						iconURL: member.user.displayAvatarURL(),
					})
					.setDescription(`Niestety osoba ${member} wyszła z naszego serwera.\nMamy nadzieję, że jeszcze wrócisz do nas. Wierzymy w Ciebie.\nPo stracie tego członka mamy w sumie **${memberCount} osób**.`)
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		banChannelId: '1002327796468699218',
		banContent: (user, guild, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#FF4757')
					.setAuthor({
						name: `⚠️ Użytkownik ${user.tag} otrzymał bana`,
						iconURL: user.displayAvatarURL(),
					})
					.setDescription(`Osoba z nickiem <@${user.id}> została zbanowana na naszym serwerze przez jednego z administratorów. Cóż, bywa...\nPo stracie tego osobnika mamy w sumie **${memberCount} ludzi**.`)
					.setThumbnail(user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		// Direct Messages
		joinMsgDM: true,
		joinMsgDMContent: (member) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#0078FF')
					.setAuthor({
						name: `Witaj ${member.user.tag} na naszym serwerze ${member.guild.name}`,
						iconURL: member.guild.iconURL() || undefined,
					})
					.setDescription('Dziękujemy za dołączenie do naszego serwera! Miłego pobytu.')
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
				new EmbedBuilder()
					.setColor('#15070C')
					.setFooter({
						text: 'Copyright 2024-2025 © by Sefinek. All Rights Reserved.',
						iconURL: member.guild.iconURL() || undefined,
					}),
			],
		}),

		// Reaction Configuration
		reactionApproveChannels: [
			'1002327796468699220',
			'1002327796468699226',
		],
		approveReaction: '✅',
	},


	// Genshin Stella Mod
	'1044713077125435492': {
		// Main
		botTrapChannelId: '1224420495710228540',
		automodChannelId: '1044721563628482560',

		// Stats
		vcMembers: true,
		vcMembersChannel: '1044714427263500288',
		vcMembersName: '👥・Members: {count}',

		vcOnline: true,
		vcOnlineChannel: '1056239296367034509',
		vcOnlineName: '🌍・Online: {count}',

		vcNew: true,
		vcNewChannel: '1044714728674557992',
		vcNewName: '🆕・New: {user}',

		// Server logs
		welcomeChannelId: '1044714444393029722',
		welcomeContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#9B59B6')
					.setAuthor({
						name: `👋 Member ${member.user.tag} has joined the server`,
						iconURL: member.user.displayAvatarURL(),
					})
					.setDescription(`Welcome, ${member}, to our server! We hope our project captures your interest and motivates you to dive into Genshin Impact. Have fun!`)
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		farewellChannelId: '1044714444393029722',
		farewellContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#E67E22')
					.setAuthor({
						name: `😥 Member ${member.user.tag} has left the server`,
						iconURL: member.user.displayAvatarURL(),
					})
					.setDescription(`Unfortunately, the user with the name ${member} has left our server. We hope that you will come back to us soon.`)
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		banChannelId: '1044714444393029722',
		banContent: (user, guild, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#C0392B')
					.setAuthor({
						name: `⚠️ User ${user.tag} has been banned from the server`,
						iconURL: user.displayAvatarURL(),
					})
					.setDescription(`The user with the name <@${user.id}> has been permanently banned from our server due to violations of our rules. We hope that the community remains safe and welcoming for all. Goodbye.`)
					.setThumbnail(user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		// Direct Messages
		joinMsgDM: true,
		joinMsgDMContent: (member) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#8E44AD')
					.setAuthor({
						name: `Welcome ${member.user.tag} to our server ${member.guild.name}`,
						iconURL: member.guild.iconURL() || undefined,
					})
					.addFields([
						{
							name: '😻 » What does Genshin Stella Mod offer?',
							value: `1. **Enhanced graphics:** Enjoy improved visuals with shaders for a superior gaming experience.
2. **FPS unlock:** Remove the 60 FPS cap for smoother gameplay, especially on monitors with refresh rates above 60Hz.
3. **3DMigoto support:** Unlocks a wider range of mods, including character model swaps, all in a safe and stable environment.`,
						},
						{
							name: '🐱 » Why should I use Genshin Stella Mod?',
							value: `1. **Own launcher:** Simply click \`Start game\` in our app to jump right into action with exclusive enhancements!
2. **Regular updates:** Our software is continuously updated for compatibility with new game versions, shader improvements, security patches, and more.
3. **Safety guaranteed:** The application is completely safe and ensures security when injecting processes into the game. However, please remember not to cheat!`,
						},
						{
							name: '😽 » What benefits will I get by supporting this project?',
							value: `1. **Access to 3DMigoto:** Enjoy the benefits of using ReShade, FPS Unlock, and 3DMigoto together for a more immersive gaming experience.
2. A curated collection of optimized, **bug-free mods**.
3. **A shader pack with the latest versions**, all free of bugs. With Stella Plus, **shaders will no longer overlap with the game's UI**, offering a cleaner, more polished visual experience.
4. **Enhanced security:** The mod is designed with safety in mind, ensuring privacy protection and a robust security system.
5. **And much more!** Discover all the benefits on the [**official website**](https://sefinek.net/genshin-stella-mod/subscription). Choose the tier that suits you best (we recommend the "🌍 Safety Kitten" tier).`,
						},
						{
							name: '🙀 » We hope to see you in the Stella Mod launcher!',
							value: `If you have any questions, feel free to message <@${process.env.OWNER}> or visit the <#1056236234160214138> channel.\n\n>> [\`Click here to download now!\`](https://sefinek.net/genshin-stella-mod) <<`,
						},
					]),
				new EmbedBuilder()
					.setColor('#15070C')
					.setImage(`https://cdn.sefinek.net/discord/sefibot/images/guildMemberAdd.png?version=${version}`)
					.setFooter({
						text: 'Copyright 2024-2025 © by Sefinek. All Rights Reserved.',
						iconURL: member.guild.iconURL() || undefined,
					}),
			],
		}),

		// Reaction Configuration
		reactionAttachmentChannels: [
			'1290859071066341507',
			'1153034136529932369',
			'1153020585413193799',
			'1105553290093138100',
		],
		attachmentReaction: ['👍', '👎'],

		reactionApproveChannels: [
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
		approveReaction: '✅',
	},


	// Nekosia API
	'1242596950428094536': {
		// Main
		botTrapChannelId: null,
		automodChannelId: '1328507486101045340',

		// Stats
		vcMembers: false,
		vcOnline: false,
		vcNew: false,

		// Server logs
		welcomeChannelId: '1328507335328661605',
		welcomeContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#1ABC9C')
					.setAuthor({
						name: `👋 Member ${member.user.tag} has joined the server`,
						iconURL: member.user.displayAvatarURL(),
					})
					.setDescription(`Welcome, ${member}, to our server!`)
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		farewellChannelId: '1328507335328661605',
		farewellContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#F39C12')
					.setAuthor({
						name: `😥 Member ${member.user.tag} has left the server`,
						iconURL: member.user.displayAvatarURL(),
					})
					.setDescription(`Unfortunately, the user with the name ${member} has left our server. We hope that you will come back to us soon.`)
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		banChannelId: '1328507335328661605',
		banContent: (user, guild, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#E74C3C')
					.setAuthor({
						name: `⚠️ User ${user.tag} has been banned from the server`,
						iconURL: user.displayAvatarURL(),
					})
					.setDescription(`The user with the name <@${user.id}> has been permanently banned from our server due to violations of our rules. We hope that the community remains safe and welcoming for all. Goodbye.`)
					.setThumbnail(user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		// DM
		joinMsgDM: false,

		// Reaction Configuration
		reactionApproveChannels: [
			'1276628914697015337',
			'1276628998914576404',
		],
		approveReaction: '👍',
	},


	// Masne Teściki Botów™
	'943910440520527873': {
		// Main
		automodChannelId: '1188578816310906890',

		// Stats
		vcMembers: false,
		vcNew: false,
		vcOnline: false,

		// Server logs
		welcomeChannelId: '1150787924351254539',
		farewellChannelId: '1150787924351254539',
		banChannelId: '1150787924351254539',

		// Misc
		cleverBot: true,
		cleverBotChannelId: '1162955264467669022',
	},

	// Miłosna Grota
	'1052610210189037598': {
		// Main
		botTrapChannelId: null,
		automodChannelId: '1122003945653547038',

		// Stats
		vcMembers: true,
		vcMembersChannel: '1122001070877581373',
		vcMembersName: '👥・Osoby: {count}',

		vcOnline: true,
		vcOnlineChannel: '1122001107577737286',
		vcOnlineName: '🌍・Online: {count}',

		vcNew: true,
		vcNewChannel: '1122001176444010568',
		vcNewName: '👋・Nowy: {user}',

		// Server logs
		welcomeChannelId: '1122001039336423435',
		welcomeContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#00D26A')
					.setAuthor({
						name: `👋 Użytkownik ${member.user.tag} dołączył do nas`,
						iconURL: member.user.displayAvatarURL(),
					})
					.setDescription(`Witaj ${member} na naszym serwerze! Mamy wielką nadzieje, że zostaniesz u nas na dłuższy czas. Miłego pobytu.\nJesteś naszym **${memberCount}. gościem**. Dziękujemy Ci za dołączenie!`)
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		farewellChannelId: '1122001039336423435',
		farewellContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#FF6B6B')
					.setAuthor({
						name: `😥 Użytkownik ${member.user.tag} opuścił serwer`,
						iconURL: member.user.displayAvatarURL(),
					})
					.setDescription(`Niestety osoba ${member} wyszła z naszego serwera.\nMamy nadzieję, że jeszcze wrócisz do nas. Wierzymy w Ciebie.\nPo stracie tego członka mamy w sumie **${memberCount} osób**.`)
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		banChannelId: '1122001039336423435',
		banContent: (user, guild, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#FF4757')
					.setAuthor({
						name: `⚠️ Użytkownik ${user.tag} otrzymał bana`,
						iconURL: user.displayAvatarURL(),
					})
					.setDescription(`Osoba z nickiem <@${user.id}> została zbanowana na naszym serwerze przez jednego z administratorów. Bywa...\nPo stracie tego osobnika mamy w sumie **${memberCount} ludzi**.`)
					.setThumbnail(user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		// Direct Messages
		joinMsgDM: true,
		joinMsgDMContent: (member) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#0078FF')
					.setAuthor({ name: `Witamy serdecznie na ${member.guild.name}`, iconURL: member.guild.iconURL() })
					.setDescription(`Dziękujemy za dołączenie! Po zweryfikowaniu zapoznaj się z [regulaminem](https://github.com/sefinek/Milosna_Grota/blob/main/Rules.md) serwera.\nNastępnie zachęcam do przywitania się z nami na kanale <#${process.env.CH_GENERALY}>!`)
					.addFields([
						{
							name: '💗 » Czy naprawdę jest to serwer randkowy?',
							value:
								'Cóż, otóż tak! Jest to serwer stworzony z myślą o randkach. Dlaczego akurat taka tematyka? Na tego typu serwerach zwykle jest dużo kontekstu do rozmowy. Macie szansę poznać tu swoją drugą połówkę lub przyjaźń na długie lata.',
						},
						{
							name: '😍 » Jesteś może graczem Genshin Impact?',
							value: 'Jeśli tak, odwiedź projekt [Genshin Stella Mod](https://stella.sefinek.net).\nW zupełności nie pożałujesz, a nawet zyskasz - lepszą grafikę w grze i nie tylko! Zapoznaj się z dostępnymi informacjami na stronie.',
						},
						{
							name: '🎶 » Lubisz może słuchać muzyki?',
							value: 'Jeśli interesują Cię kanały na których można znaleźć pełno sped upów przeróżnych piosenek, odwiedź: [www.youtube.com/@sefinek](https://www.youtube.com/@sefinek)',
						},
						{
							name: '🤖 » Polecamy godnego zaufania bota Noel. Dodaj go na swój serwer!',
							value: `> **Oficjalna strona:** ${process.env.URL_NOEL}\n`,
						},
						{
							name: '👋 » Zakończenie',
							value:
								`W razie jakichkolwiek pytań, skontaktuj się z <@${process.env.BOT_OWNER}>. Jeśli chcesz miło pogadać lub po prostu się przywitać - również pisz!\n\n` +
								'~ Życzymy Ci miłego pobytu! Pozdrawiamy.',
						},
					]),
				new EmbedBuilder()
					.setColor('#15070C')
					.setImage(`https://cdn.sefinek.net/discord/sefibot/images/guildMemberAdd.png?version=${version}`)
					.setFooter({ text: 'Copyright 2024-2025 © by Sefinek. All Rights Reserved.', iconURL: member.guild.iconURL() || undefined }),
			],
		}),

		// Reaction Configuration
		reactionApproveChannels: [
			'1002327796468699220',
			'1002327796468699226',
		],
		approveReaction: '✅',
	},

};

const development = {
	'943910440520527873': {
		// Main
		isDatingServer: true,
		automodChannelId: '1188578816310906890',

		// Stats
		vcMembers: true,
		vcMembersChannel: '1296966242439266377',
		vcMembersName: '👥・Members: {count}',

		vcNew: true,
		vcNewChannel: '1305020387104395365',
		vcNewName: '🆕・New: {user}',

		vcOnline: true,
		vcOnlineChannel: '1305027263997415485',
		vcOnlineName: '🌍・Online: ${count}',

		// Server logs
		welcomeChannelId: '1150787924351254539',
		welcomeContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#FF69B4')
					.setAuthor({
						name: `🎉 DEV: ${member.user.tag} dołączył do testów!`,
						iconURL: member.user.displayAvatarURL(),
					})
					.setDescription(`Witaj na serwerze testowym ${member}! 🚀 To jest środowisko deweloperskie dla testowania funkcji bota.\nJesteś **${memberCount} testerem**!`)
					.addFields([
						{
							name: '🔧 Development Mode',
							value: 'Ta wiadomość pojawia się tylko w trybie deweloperskim.',
							inline: true,
						},
						{
							name: '🎯 Test Features',
							value: 'Możesz testować wszystkie funkcje randkowe!',
							inline: true,
						},
					])
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		farewellChannelId: '1150787924351254539',
		farewellContent: (member, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#FFA500')
					.setAuthor({ name: `👋 DEV: ${member.user.tag} opuścił testy`, iconURL: member.user.displayAvatarURL() })
					.setDescription(`Tester ${member} opuścił serwer deweloperski.\nDziękujemy za pomoc w testowaniu! 🧪\nZostało **${memberCount} testerów**.`)
					.setFooter({ text: 'Development Environment' })
					.setThumbnail(member.user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		banChannelId: '1150787924351254539',
		banContent: (user, guild, memberCount) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#DC143C')
					.setAuthor({ name: `⚠️ DEV: ${user.tag} został zbanowany`, iconURL: user.displayAvatarURL() })
					.setDescription(`Użytkownik <@${user.id}> został zbanowany na serwerze testowym.\nTest funkcji banowania zakończony pomyślnie ✅\nZostało **${memberCount} testerów**.`)
					.addFields([{
						name: '🔧 Debug Info',
						value: `User ID: ${user.id}\nGuild: ${guild.name}`,
					}])
					.setThumbnail(user.displayAvatarURL())
					.setTimestamp(),
			],
		}),

		// Misc
		cleverBot: true,
		cleverBotChannelId: '943910440990294021',

		// Direct Messages
		joinMsgDM: true,
		joinMsgDMContent: (member) => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#00FFFF')
					.setAuthor({
						name: `🔧 Dev Mode: Witaj na ${member.guild.name}!`,
						iconURL: member.guild.iconURL() || undefined,
					})
					.setDescription(`Hej ${member.user.tag}! 👋\n\nJesteś na **serwerze deweloperskim** - tutaj testujemy nowe funkcje bota przed wdrożeniem na główne serwery.`)
					.addFields([
						{
							name: '🚀 Co możesz tutaj testować?',
							value: '• Komendy randkowe\n• System Choroszczy\n• Dark web\n• Wszystkie funkcje dating serwera',
						},
						{
							name: '⚡ Development Features',
							value: 'Niektóre funkcje mogą być niestabilne - to normalne w środowisku testowym!',
						},
					])
					.setFooter({
						text: 'Development Environment | Test Server',
						iconURL: member.guild.iconURL() || undefined,
					})
					.setTimestamp(),
			],
		}),
	},
};

exports.data = { production, development };

const { NODE_ENV } = process.env;
exports.getServerConfig = guildId => {
	const environmentConfig = exports.data[NODE_ENV]?.[guildId] || {};
	if (NODE_ENV === 'development' && Object.keys(environmentConfig).length === 0) {
		console.warn(`Configuration for guildId: ${guildId} not found in "development". Using configuration from "production".`);
	}

	const productionConfig = exports.data.production?.[guildId] || {};
	const mergedConfig = Object.assign({}, productionConfig, environmentConfig);
	return Object.keys(mergedConfig).length > 0 ? mergedConfig : null;
};
