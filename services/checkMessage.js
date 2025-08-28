const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const isInvitation = require('is-discord-invite');
const { randomBytes } = require('node:crypto');
const guilds = require('../config/guilds.js');

const PATTERNS = [
	// grex "50$ gift" "e.vg" "u.to" "is.gd" "steamncommunity" "steanmecomrmunity" "casumonster.top"
	{ regex: /stea(?:nmecomr|mncom)munity|casumonster\.top|50\$ gift|is\.gd|e\.vg|u\.to/i, category: 'Scam', reaction: '🕵️' },

	// grex "kutas" "penis" "chujem" "cipa" "cipka" "cipsko" "cipska" "wagin" "p0rn" "porno" "sex" "seks" "ruchanie" "ruchania" "ruchać" "ruchac" "ruhać" "ruchasz" "ruhasz" "ruhac" "ruchańsko" "ruchansko" "ruchał" "ruchal" "ruchali" "cum" "gangbang" "gengbeng" "hentai" "hentaj" "zboczony" "zboczone" "zboczoną" "zboczona" "dick" "pussy" "porn" "nudes" "nudle" "huj" "naplet" "pedo" "pedofil" "masturbacja" "masturbuje" "masturbowanie" "spuszczanie" "spuszczają" "obciąganie" "obciągasz" "obciaganie" "obciagasz" "ssać" "ssiesz" "berło" "berlo" "berła" "berla"
	{ regex: /masturb(?:owanie|acja|uje)|(?:spuszczan|obci[aą]gan)ie|s(?:puszczają|sać|ex)|ru(?:cha(?:nsko|ńsko|ni[ae]|li|[cćł])|ha[cć])|obci[aą]gasz|g(?:angba|engbe)ng|zboczon[aeyą]|p(?:edofil|orno|ussy)|(?:ruc?has|ssies)z|ruchal|c(?:hujem|ipa|um)|h(?:enta[ij]|uj)|cipsk[ao]|n(?:aplet|udes)|ber[lł][ao]|(?:peni|kuta|sek)s|wagin|cipka|nudle|p(?:edo|orn)|dick|p0rn/i, category: 'NSFW content', reaction: '😿' },

	// grex "gwalt" "gwałt" "gwałcenie" "gwalcenie" "zgwalcic" "zgwałcic" "zgwałcić" "gwalciciel" "gwałciciel" "zgwalcono" "zgwałcono" "gwalcona" "gwałcona" "zgwałce" "zgwalce" "zgwałcę" "gwalcac" "gwałcąc" "gwalcic" "gwałcić"
	{ regex: /gwa(?:l(?:(?:(?:ciciel|t)|cona)|cenie)|ł(?:c(?:i(?:ciel|ć)|enie|ona)|t))|zgwa(?:lc(?:ono|(?:ic|e))|łc(?:ono|i[cć]|[eę]))|gwalcic|gwa(?:lca|łcą)c/i, category: 'Degenerate', reaction: '😿' },

	// grex "zdechnij" "zabij" "zajeb" "kys" "zakurw"
	{ regex: /z(?:dechnij|a(?:(?:kurw|jeb)|bij))|kys/i, category: 'Kys', reaction: '💩' },

	// grex "sieg heil" "siegheil" "sieg hail" "sieghail" "heil hitler" "heilhitler" "hail hitler" "hailhitler" "hail hitla" "hailhitla" "white power" "whitepower" "wchite power" "wchitepower" "atom waffen" "atomwaffen" "swastyka" "swastyki" "swastyczki" "nazi" "wermacht" "schutzstaffel" "auschwitz" "aushwitz" "gestapo" "luftwaffe" "holokaust" "nsdap" "reichsführer" "reichsfuhrer" "żyd" "jews" "adolf" "hitler"
	{ regex: /s(?:chutzstaffel|wasty(?:czki|k[ai])|ieg(?: h[ae]i|h[ae]i)l)|(?:w(?:chite ?pow|hite ?pow)|h(?:eil ?hitl|itl))er|reichsf[uü]hrer|a(?:tom ?waffen|usc?hwitz|dolf)|hail ?hitler|hail ?hitla|holokaust|luftwaffe|wermacht|gestapo|nsdap|jews|nazi|żyd/i, category: 'Nazi word / other', reaction: '😶‍🌫️' },

	// grex "pedał" "pedal" "pedau" "gej" "gay" "faggot"
	{ regex: /faggot|peda[luł]|g(?:ay|ej)/i, category: 'Gay', reaction: '😥' },

	// grex "jebać lgbt" "jebac lgbt" "palić lgbt" "palic lgbt" "jebane lgbt" "fuck lgbt"
	{ regex: /(?:jeba(?:ne|[cć])|fuck) lgbt|pali[cć] lgbt/i, category: 'Fk LGBT', reaction: '😥' },

	// grex "niger" "nigger" "niggęr" "niggeł" "nlgger" "niga" "nigga" "nyger" "nygger" "nyga" "nygga" "nyguch" "nygguch" "murzyn" "mudzin" "czarnuch" "czarnuh" "czarnuszek"
	{ regex: /czarnu(?:szek|c?h)|nygg?uch|n(?:ig(?:g(?:e[rł]|a)|a)|(?:ig(?:gę|e)|ygg?e)r|lgger|ygg?a)|mu(?:dzi|rzy)n/i, category: 'N-word', reaction: '🤡' },

	// grex "liga" "lige" "ligi" "lola" "ligusia" "ligusie" "ligusi" "ligunie" "league of legends"
	{ regex: /l(?:eague of legends|ig(?:u(?:si[ae]|nie)|[aei])|igusi|ola)/i, category: 'League of Legends', reaction: '🤓' },

	// grex "9 lat" "10 lat" "11 lat" "12 lat" "13 lat" "14 lat" "15 lat" "10lat" "11lat" "12lat" "13lat" "14lat" "15lat" "9 yo" "10 yo" "11 yo" "12 yo" "13 yo" "14 yo" "15 yo" "10yo" "11yo" "12yo" "13yo" "14yo" "15yo"
	{ regex: /1[0-5] (?:lat|yo)|1[0-5]lat|9 (?:lat|yo)|1[0-5]yo/i, category: 'Underage' },
];

const AutoModSendBan = async (client, msg, event, serverCfg, category, { perms, reaction } = {}) => {
	const msgId = randomBytes(3).toString('hex');
	const amChannel = msg.guild.channels.cache.get(serverCfg.automodChannelId);
	if (!amChannel) return console.error(`AutoMD » [${msgId}] Channel with ID ${serverCfg.automodChannelId} not found`);

	let infoMsg;
	try {
		infoMsg = await amChannel.send({ embeds: [
			new EmbedBuilder()
				.setColor('#006CFF')
				.setAuthor({ name: `${msg.author.globalName} / ${msg.author.username} / ${msg.author.id}`, iconURL: msg.author.displayAvatarURL() })
				.setDescription(`**Message from ${msg.author} flagged for deletion in ${msg.channel}**\n${msg.content}`)
				.addFields({ name: `Details (case: ${msgId})`, value: `${category} || [View this message](${msg.url})` })],
		});
	} catch (err) {
		return console.warn(`AutoMD » [${msgId}] Failed to send message to channel ${amChannel.name}:`, err.message);
	}

	if (category === 'Scam') {
		await msg.member.ban({ reason: `Scam: ${msg.content}`, deleteMessageSeconds: 604800 });
	}

	if (category === 'Discord invitation') return;

	console.log(`AutoMD » Message by ${msg.author.tag} (${msg.author.id}) in ${msg.channel.name} (${msg.channel.id}) ready for deletion; ${category}; ${event.toUpperCase()}; ${msgId}\n\n${msg.author.globalName || msg.author.tag} — ${new Date(msg.createdTimestamp).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw', hour12: false })}\n${msg.content}\n`);

	if (reaction && msg.member && !msg.member.permissions.has(perms)) {
		try {
			await msg.react(reaction);
		} catch (err) {
			console.log(`AutoMD » [${msgId}] Failed to add reaction to message ${msg.id}:`, err.message);
		}
	}

	setTimeout(async () => {
		if (!infoMsg) return;

		try {
			await msg.delete();
			await infoMsg.react('🗑️');
			console.log(`AutoMD » [${msgId}] Deleted message sent by ${msg.author.tag} in ${msg.channel.name}`);
		} catch (err) {
			if (err.status === 404) {
				await infoMsg.react('❓');
				console.log(`AutoMD » [${msgId}] Message already deleted`);
			} else {
				await infoMsg.react('⚠️');
				console.warn(`AutoMD » [${msgId}] Failed to delete message:`, err.message);
			}
		}
	}, 540000);
};

module.exports = async (client, msg, event, serverCfg) => {
	const result = await isInvitation.online(msg.content);

	if (result.isInvitation) {
		if (msg.member.permissions.has(PermissionsBitField.Flags.Administrator) && process.env.NODE_ENV === 'production') return false;

		const serverId = result.guild.id;
		const existingServers = new Set([...Object.keys(guilds.data[process.env.NODE_ENV] || {}), ...Object.keys(guilds.data.production || {})]);
		console.log(`AutoMD » Number of trusted servers: ${existingServers.size}`);

		if (serverId === msg.guild.id || existingServers.has(serverId)) {
			console.log(`AutoMD » Trusted server invitation detected (server ID: ${serverId}) from user ${msg.author.tag}. No action taken.`);
			return false;
		}

		try {
			await msg.delete();
			console.log(`AutoMD » Deleted invitation from ${msg.author.tag} to server ${result.guild.name} (${serverId}). Full message: ${msg.content}`);
		} catch (err) {
			console.warn('AutoMD » Failed to delete invitation:', err.message);
		}

		const serverName = result.guild.name;
		if (!msg.member.bannable) {
			console.warn(`AutoMD » Unable to ban user ${msg.author.tag} for inviting to server: ${serverName}`);
			return false;
		}

		try {
			await msg.author.send({ embeds: [
				new EmbedBuilder()
					.setColor('#FFB02E')
					.setAuthor({ name: `⚠️ You have been banned from ${msg.guild.name}`, iconURL: msg.author.displayAvatarURL() })
					.setDescription(`You have been banned for sending an invitation to **${serverName}**.`),
			] });
		} catch (err) {
			console.log('AutoMD » Failed to notify user of ban:', err.message);
		}

		if (process.env.NODE_ENV === 'production') {
			await msg.member.ban({ reason: `Invitation to ${serverName}; Channel: ${msg.channel.name}; User ID: ${msg.author.id}` });
		}

		const infoMsg = await msg.channel.send({ embeds: [
			new EmbedBuilder()
				.setColor('#F8312F')
				.setAuthor({ name: `Banned ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL() })
				.setDescription(`This user invited to **${serverName}** and has been banned.`)
				.setThumbnail(`https://cdn.discordapp.com/icons/${serverId}/${result.guild.icon}`)],
		});

		setTimeout(async () => {
			if (infoMsg) await infoMsg.delete();
		}, 25000);

		await AutoModSendBan(client, msg, event, serverCfg, 'Discord invitation');
		return true;
	}

	for (const pattern of PATTERNS) {
		if (pattern.regex.test(msg.content)) {
			await AutoModSendBan(client, msg, event, serverCfg, pattern.category, { perms: PermissionsBitField.Flags.ManageMessages, reaction: pattern.reaction });
			return true;
		}
	}
};