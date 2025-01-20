const { version } = require('./package.json');

const production = {
	// Sefinek
	'1305001399494377533': {
		// Main
		botTrapChannelId: null,
		automodChannelId: '1328500595908280421',

		// Stats
		vcMembers: true,
		vcMembersChannel: '1328500744361480192',
		vcMembersName: '👥・Members: {count}',

		vcOnline: true,
		vcOnlineChannel: '1328500785176252439',
		vcOnlineName: '🌍・Online: {count}',

		vcNew: true,
		vcNewChannel: '1328500800086999080',
		vcNewName: '👋・New: {user}',

		// Server logs
		welcomeChannelId: '1328500677944803358',
		welcomeTitle: '👋 Member {user} has joined the server',
		welcomeDescription: 'Welcome, {user}, to our server!',

		farewellChannelId: '1328500677944803358',
		farewellTitle: '😥 Member {user} has left the server',
		farewellDescription: 'Unfortunately, the user with the name {user} has left our server. We hope that you will come back to us soon.',

		banChannelId: '1328500677944803358',
		banTitle: '⚠️ User {user} has been banned from the server',
		banDescription: 'The user with the name {user} has been permanently banned from our server due to violations of our rules. We hope that the community remains safe and welcoming for all. Goodbye.',

		// DM
		joinMsgDM: true,
		joinMsgDMTitle: 'Welcome {userTag} on {guildName}!',
		joinMsgDMFields: [],
		joinMsgDMFooter: false,
		joinMsgDMFooterImage: null,

		// Reactions
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
		welcomeTitle: '👋 Użytkownik {user} dołączył do nas',
		welcomeDescription: 'Witaj {user} na naszym serwerze! Mamy wielką nadzieje, że zostaniesz u nas na dłuższy czas. Miłego pobytu.\nJesteś naszym {count} gościem. Dziękujemy Ci za dołączenie!',

		farewellChannelId: '1002327796468699218',
		farewellTitle: '😥 Użytkownik {user} opuścił serwer',
		farewellDescription: 'Niestety osoba {user} wyszła z naszego serwera.\nMamy nadzieję, że jeszcze wrócisz do nas. Wierzymy w Ciebie.\nPo stracie tego członka mamy w sumie {count} osób.',

		banChannelId: '1002327796468699218',
		banTitle: '⚠️ Użytkownik {user} otrzymał bana',
		banDescription: 'Osoba z nickiem {user} została zbanowana na naszym serwerze przez jednego z administratorów. Cóż, bywa...\nPo stracie tego osobnika mamy w sumie {count} ludzi.',

		// DM
		joinMsgDM: true,
		joinMsgDMTitle: 'Witaj {userTag} na naszym serwerze {guildName}',
		joinMsgDMFields: [],
		joinMsgDMFooter: true,
		joinMsgDMFooterImage: null,

		// Reactions
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
		welcomeTitle: '👋 Member {user} has joined the server',
		welcomeDescription: 'Welcome, {user}, to our server! We hope our project captures your interest and motivates you to dive into Genshin Impact. Have fun!',

		farewellChannelId: '1044714444393029722',
		farewellTitle: '😥 Member {user} has left the server',
		farewellDescription: 'Unfortunately, the user with the name {user} has left our server. We hope that you will come back to us soon.',

		banChannelId: '1044714444393029722',
		banTitle: '⚠️ User {user} has been banned from the server',
		banDescription: 'The user with the name {user} has been permanently banned from our server due to violations of our rules. We hope that the community remains safe and welcoming for all. Goodbye.',

		// DM
		joinMsgDM: true,
		joinMsgDMTitle: 'Welcome {userTag} to our server {guildName}',
		joinMsgDMFields: [{
			name: '😻 » What does Genshin Stella Mod offer?',
			value: `
1. **Enhanced graphics:** Enjoy improved visuals with shaders for a superior gaming experience.
2. **FPS unlock:** Remove the 60 FPS cap for smoother gameplay, especially on monitors with refresh rates above 60Hz.
3. **3DMigoto support:** Unlocks a wider range of mods, including character model swaps, all in a safe and stable environment.`,
		}, {
			name: '🐱 » Why should I use Genshin Stella Mod?',
			value: `
1. **Own launcher:** Simply click \`Start game\` in our app to jump right into action with exclusive enhancements!
2. **Regular updates:** Our software is continuously updated for compatibility with new game versions, shader improvements, security patches, and more.
3. **Safety guaranteed:** The application is completely safe and ensures security when injecting processes into the game. However, please remember not to cheat!`,
		}, {
			name: '😽 » What benefits will I get by supporting this project?',
			value: `
1. **Access to 3DMigoto:** Enjoy the benefits of using ReShade, FPS Unlock, and 3DMigoto together for a more immersive gaming experience.
2. A curated collection of optimized, **bug-free mods**.
3. **A shader pack with the latest versions**, all free of bugs. With Stella Plus, **shaders will no longer overlap with the game’s UI**, offering a cleaner, more polished visual experience.
4. **Enhanced security:** The mod is designed with safety in mind, ensuring privacy protection and a robust security system.
5. **And much more!** Discover all the benefits on the [**official website**](https://sefinek.net/genshin-stella-mod/subscription). Choose the tier that suits you best (we recommend the "\\🌍 Safety Kitten" tier).`,
		}, {
			name: '🙀 » We hope to see you in the Stella Mod launcher!',
			value: `If you have any questions, feel free to message <@${process.env.BOT_OWNER}> or visit the <#1056236234160214138> channel.\n\n>> [\`Click here to download now!\`](https://sefinek.net/genshin-stella-mod) <<`,
		}],
		joinMsgDMFooter: true,
		joinMsgDMFooterImage: `https://cdn.sefinek.net/discord/sefibot/images/guildMemberAdd.png?version=${version}`,

		// Reactions
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
		welcomeTitle: '👋 Member {user} has joined the server',
		welcomeDescription: 'Welcome, {user}, to our server!',

		farewellChannelId: '1328507335328661605',
		farewellTitle: '😥 Member {user} has left the server',
		farewellDescription: 'Unfortunately, the user with the name {user} has left our server. We hope that you will come back to us soon.',

		banChannelId: '1328507335328661605',
		banTitle: '⚠️ User {user} has been banned from the server',
		banDescription: 'The user with the name {user} has been permanently banned from our server due to violations of our rules. We hope that the community remains safe and welcoming for all. Goodbye.',

		// DM
		joinMsgDM: false,
		joinMsgDMTitle: 'Welcome {userTag} on {guildName}!',
		joinMsgDMFields: [],
		joinMsgDMFooter: false,
		joinMsgDMFooterImage: null,

		// Reactions
		reactionApproveChannels: [
			'1276628914697015337',
			'1276628998914576404',
		],
		approveReaction: '👍',
	},
};

const development = {
	'943910440520527873': {
		// Main
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
		farewellChannelId: '1150787924351254539',
		banChannelId: '1150787924351254539',

		// Misc
		cleverBot: true,
		cleverBotChannelId: '943910440990294021',

		// DM
		joinMsgDMFooter: true,
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
