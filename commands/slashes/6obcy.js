const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, WebhookClient, PermissionsBitField, MessageFlags } = require('discord.js');
const { WebSocket } = require('ws');
const ObcySessions = require('../../database/models/obcy.model');
const DEBUG = false;

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('obcy')
		.setDescription('Nawiąż połączenie z losowym obcym ze strony 6obcy.org poprzez bota.'),
	async execute(client, inter, newSession) {
		const channel = inter.channel;
		const member = inter.member;
		const guildId = inter.guild.id;

		if (![process.env.CH_6OBCY].includes(channel.id) && !member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			return inter.reply(`<a:error:1127481079620718635> **Niepowodzenie**\nUdaj się na kanał <#${process.env.CH_6OBCY}>.`);
		}

		const chSession = await ObcySessions.findOne({ channelId: channel.id, closed: false });
		if (chSession && chSession.channelId === channel.id) {
			return inter.reply({ content: '<a:error:1127481079620718635> **Niepowodzenie**\nNa tym kanale jest już prowadzona jakaś rozmowa. Jeżeli nie o to chodzi, zgłoś nam ten błąd.', ephemeral: MessageFlags.Ephemeral });
		}

		if (!inter.replied) await inter.deferReply();

		const filter = m => m.author.id === inter.user.id;
		const captcha = channel.createMessageCollector({ filter, time: 25000 });
		const collector = channel.createMessageCollector();

		const session = await ObcySessions.create({ userId: inter.user.id, channelId: channel.id, attempts: 0 });

		const close = async ws => {
			ws.close();

			if (session && session.interval) {
				if (!session.loadingMsgId) return inter.channel.send(`Wartość session.loadingMsgId jest nieznana (${session.loadingMsgId}). Proszę spróbować ponownie. Ostatecznie zgłoś ten błąd.`);

				const loading = await channel.messages.fetch(session.loadingMsgId);
				await loading.edit({ components: [
					new ActionRowBuilder().addComponents([
						new ButtonBuilder().setCustomId('end').setLabel('Zakończ rozmowę').setStyle(3).setDisabled(true),
						new ButtonBuilder().setCustomId('topic').setLabel('Wylosuj temat').setStyle(1).setDisabled(true),
						new ButtonBuilder().setCustomId('debug').setLabel('Debug').setStyle(2).setDisabled(true)]
					)],
				});

				session.closed = true;
				session.ceId++;
				await session.updateOne({ closed: true, ceId: session.ceId });

				clearInterval(session.interval);
			}

			collector.stop();
		};

		const ws = new WebSocket(`wss://server.6obcy.pl:700${Math.floor(Math.random() * (9 - 1)) + 1}/6eio/?EIO=3&transport=websocket`, {
			origin: 'https://6obcy.org',
			headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' },
		});

		ws.on('message', async data => {
			data = data.toString();
			if (data === '3') return;

			let json;
			try {
				json = JSON.parse(data.slice(1));
			} catch (err) {
				return console.log('Odebrano niewłaściwe dane.', err.message);
			}

			await session.updateOne({ $push: { packets: json } });

			switch (true) {

			// 🤖 Przepisz kod z obrazka
			case json.ev_name === 'caprecvsas': {
				const editedMsg = await inter.editReply({
					embeds: [
						new EmbedBuilder()
							.setColor('#555555')
							.setAuthor({
								name: `⚪ Captcha ${newSession ? newSession.attempts : '1'} - ${inter.user.tag}`,
								iconURL: inter.user.displayAvatarURL(),
							})
							.setDescription('Przepisz kod z obrazka (7 liter). Masz na to 25 sekund.')
							.setImage('attachment://6obcy-bot_captcha_sefinek.jpeg'),
					],
					files: [
						{
							attachment: Buffer.from(json.ev_data.tlce.data.replace(/^data:image\/jpeg;base64,/, ''), 'base64'),
							name: '6obcy-bot_captcha_sefinek.jpeg',
						},
					],
				});

				session.loadingMsgId = editedMsg.id;
				await session.updateOne({ channelId: editedMsg.id });

				captcha.on('collect', m => {
					captcha.stop();

					const str = `4{"ev_name":"_capsol","ev_data":{"solution":"${m.content}"}}`;
					ws.send(str);

					if (DEBUG) console.log(str);
					m.delete();
				});
				break;
			}

			// 🔒 Kod z obrazka nie jest prawidłowy
			case json.ev_name === 'capissol' ? !json.ev_data.success : false: {
				captcha.stop();
				await close(ws);

				if (newSession) {
					if (newSession.attempts === 3) {
						return inter.editReply({
							content: '',
							embeds: [
								new EmbedBuilder()
									.setColor('#FF6723')
									.setAuthor({ name: `🟠 Captcha ${newSession.attempts} - ${inter.user.tag}`, iconURL: inter.user.displayAvatarURL() })
									.setDescription('Zbyt dużo nieudanych prób. Wpisz polecenie `/obcy` ponownie.'),
							],
							files: [],
						});
					}

					newSession.attempts++;
					await newSession.updateOne({ attempts: newSession.attempts });
				} else {
					await inter.editReply('<a:error:1127481079620718635> **Przepisano błędny kod. Spróbuj ponownie.**');

					session.attempts = 2;
					await session.updateOne({ attempts: 2 });
					newSession = session;
				}

				try {
					const cmd = client.interactions.get('obcy');
					await cmd.execute(client, inter, newSession);
				} catch (err) {
					require('../../scripts/6obcy/captchaError.js')(inter, newSession, EmbedBuilder, err);
				}
				return;
			}


			// 📝 Captcha pomyślnie została przepisana
			case json.ev_name === 'cn_acc': case json.ev_name === 'capissol' ? json.ev_data.success : false: {
				if (json.ev_name === 'capissol' && json.ev_data.success) {
					const msg = await channel.send({ embeds: [
						new EmbedBuilder()
							.setColor('#0074BA')
							.setAuthor({ name: `🔵 Captcha - ${inter.user.tag}`, iconURL: process.env.LOA })
							.setDescription('Captcha pomyślnie przepisana. Trwa szukanie rozmówcy...')],
					});

					session.loadingMsgId = msg.id;
					session.channelId = channel.id;
					await session.updateOne({ loadingMsgId: msg.id, channelId: channel.id });
				}

				session.ceId++;
				ws.send(`4{"ev_name":"_sas","ev_data":{"channel":"main","myself":{"sex":0,"loc":0},"preferences":{"sex":0,"loc":0}},"ceid":${session.ceId}}`);

				return session.updateOne({ ceId: session.ceId });
			}


			// ️️✔️ Obcy dołączył do rozmowy
			case json.ev_name === 'talk_s': {
				const loading = await channel.messages.fetch(session.loadingMsgId);

				await loading.edit({
					embeds: [
						new EmbedBuilder()
							.setColor('#00D26A')
							.setAuthor({ name: '✔️️ Obcy dołączył do rozmowy', iconURL: inter.user.displayAvatarURL() })
							.addFields([
								{
									name: '» Dostępne możliwości w trakcie rozmowy',
									value:
											'`.` - Dodaj kropkę z przodu, aby zapobiec dostarczeniu swojej wiadomości obcemu.\n' +
											'`.rozlacz` - Rozłącz się natychmiast z obcym.\n' +
											'`.temat` - Wylosuj temat do rozmowy.\n' +
											'`.bot` - Wprowadź, gdy cały czas łączysz się z botami.',
								},
								{
									name: '» Ostrzeżenie',
									value: 'Pamiętaj, że rozpoczęcie rozmowy oznacza akceptacje [regulaminu](https://6obcy.org/regulamin) 6obcy.',
								},
							]),
					],
					components: [
						new ActionRowBuilder().addComponents([
							new ButtonBuilder().setCustomId('end').setLabel('Zakończ rozmowę').setStyle(3),
							new ButtonBuilder().setCustomId('topic').setLabel('Wylosuj temat').setStyle(1),
							new ButtonBuilder().setCustomId('debug').setLabel('Debug').setStyle(2),
						]),
					],
				});

				const button = loading.createMessageComponentCollector();
				button.on('collect', async i => {
					switch (i.customId) {
					case 'end': {
						if (i.user.id !== inter.user.id) return i.reply({ content: `<a:error:1127481079620718635> Niestety nie możesz tego dokonać. Tylko użytkownik ${inter.user} może kliknąć ten przycisk.`, ephemeral: MessageFlags.Ephemeral });
						if (session.closed) return i.reply({ content: '<a:error:1127481079620718635> Ta rozmowa została już zakończona.', ephemeral: MessageFlags.Ephemeral });

						await close(ws);
						await i.reply({ embeds: [new EmbedBuilder().setColor('#00D26A').setAuthor({ name: `✔️️ ${i.user.username} rozłączył się`, iconURL: i.user.displayAvatarURL() })] });

						return button.stop();
					}

					case 'topic': {
						await i.reply({ content: '🔵 **Losowanie tematu do rozmowy...**\nPamiętaj, że temat można wylosować czasami dopiero po 1 minucie rozpoczęcia rozmowy i nie tylko.', ephemeral: MessageFlags.Ephemeral });

						session.ceId++;
						session.updateOne({ ceId: session.ceId });
						return ws.send(`4{"ev_name":"_randtopic","ev_data":{"ckey":"${json.ev_data.ckey}"},"ceid":${session.ceId}}`);
					}

					case 'debug': {
						return i.reply({ embeds: [
							new EmbedBuilder()
								.setColor('#0074BA')
								.setAuthor({ name: `🔵 Sesja - Debug (ceId ${session.ceId})`, iconURL: i.user.displayAvatarURL() })
								.setDescription(`\`\`\`json\n${session}\`\`\`\`\`\`Autor sesji: ${inter.user.tag}\nNazwa serwera: ${inter.guild.name}\`\`\``)
								.setFooter({ text: 'To są bieżące informacje o aktualnej sesji do wglądu.\nPrzydadzą się one administratorowi bota do debugowania ewentualnych problemów.' }),
						], ephemeral: MessageFlags.Ephemeral });
					}

					default: await i.reply({ content: '❌ Wybacz, ale coś poszło nie tak. Zgłoś ten błąd na naszym serwerze wsparcia.', ephemeral: MessageFlags.Ephemeral });
					}
				});

				await session.updateOne({ ckey: json.ev_data.ckey, channelId: channel.id });
				session.channelId = channel.id;
				session.interval = setInterval(() => ws.send('2'), 25000);

				console.log(`Rozpoczęto rozmowę z obcym na serwerze ${inter.guild.name} (${guildId}) przez ${inter.user.tag}`);
				break;
			}

			// 📝 Bot piszę na kanale
			case (json.ev_name === 'styp' && json.ev_data) || (json.ev_name === 'styp' && !json.ev_data): return channel.sendTyping();

			// 💭 Losowanie tematu do rozmowy
			case json.ev_name === 'rtopic': {
				channel.send({ embeds: [
					new EmbedBuilder()
						.setColor('#FFFFFF')
						.setAuthor({ name: '💭 Wylosowano temat do rozmowy', iconURL: inter.user.displayAvatarURL() })
						.setDescription(`> ${json.ev_data.topic}`)],
				});

				return await session.updateOne({ $push: { conversation: `Wylosowany temat do rozmowy: ${json.ev_data.topic}` } });
			}

			// 👋 Obcy rozłączył się
			case json.ev_name === 'sdis': {
				await close(ws);
				const disconnected = await channel.send({
					embeds: [new EmbedBuilder().setColor('#5865F2').setAuthor({ name: '👋 Niestety obcy rozłączył się', iconURL: inter.user.displayAvatarURL() })],
					components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId('newConnection').setLabel('Rozpocznij nową rozmowę').setStyle(1)])],
				});

				const button = disconnected.createMessageComponentCollector();
				button.on('collect', async i => {
					if (i.user.id !== inter.user.id) return i.reply({ content: '<a:error:1127481079620718635> Przepraszamy, ale niestety nie możesz tego dokonać.', ephemeral: MessageFlags.Ephemeral });

					try {
						const cmd = client.interactions.get('obcy');
						await cmd.execute(client, i);
					} catch (err) {
						require('../../scripts/6obcy/captchaError.js')(inter, newSession, EmbedBuilder, err);
					}

					disconnected.edit({ components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId('newConnection').setLabel('Rozpocznij nową rozmowę').setStyle(1).setDisabled(true)])] });
					button.stop();
				});

				return console.log(`Obcy rozłączył się na serwerze ${inter.guild.name} (${guildId})`);
			}
			}

			// ✍️ Obcy wysłał wiadomość na kanał
			if (json.ev_data && json.ev_data.msg) {
				channel.send(json.ev_data.msg.replace('@everyone', '**[Wykryto ping everyone]**').replace('@here', '**[Wykryto ping here]**'));
				return await session.updateOne({ $push: { conversation: `Obcy: ${json.ev_data.msg}` } });
			}

			collector.on('collect', async m => {
				if (m.author.bot) return;

				if (json.ev_data && json.ev_data.ckey) {

					switch (true) {
					case m.content.toLowerCase() === '.bot': return require('../../scripts/6obcy/report.js')(client, inter, EmbedBuilder, WebhookClient);
					case m.content.toLowerCase() === '.temat': return ws.send(`4{"ev_name":"_randtopic","ev_data":{"ckey":"${json.ev_data.ckey}"},"ceid":${session.ceId}}`);

					case ['.rozlacz', '.rozłącz', '.rozłacz', '.rozłacz', '.wyjdź', '.wyjdz'].includes(m.content.toLowerCase()): {
						await close(ws);

						const mainMsg = await channel.messages.fetch(session.loadingMsgId);
						return mainMsg.reply({ embeds: [new EmbedBuilder()
							.setColor('#FFF641')
							.setAuthor({ name: `👋 ${m.author.username} rozłączył się`, iconURL: m.author.displayAvatarURL() })],
						});
					}

					case m.content.startsWith('.') && m.content.length > 1: return m.react('1127481079620718635');

					default: {
						if (!m.content || !m.content.length) return;
						m.attachments.size > 0 ? m.content = m.attachments.first().url : m.content = m.content.replace(/"/g, '\\"').trim();

						ws.send(`4{"ev_name":"_pmsg","ev_data":{"ckey":"${json.ev_data.ckey}","msg":"${m.content}","idn":${session.idn++}},"ceid":${session.ceId++}}`);
						await session.updateOne({ ceId: session.ceId, idn: session.idn, $push: { conversation: `${m.author.username} (${m.author.id}): ${m.content}` } });

						if (DEBUG) console.log(`4{"ev_name":"_pmsg","ev_data":{"ckey":"${json.ev_data.ckey}","msg":"${m.content}","idn":${session.idn}},"ceid":${session.ceId}}`);
					}
					}

				}
			});
		});

		ws.on('error', err => {
			switch (err.code) {
			case 'ETIMEDOUT': {
				inter.followUp({ embeds: [
					new EmbedBuilder()
						.setColor('#F92F60')
						.setAuthor({ name: `❌ WebSocket - ${err.code}`, iconURL: inter.user.displayAvatarURL() })
						.setDescription('Nie można ustanowić połączenia, ponieważ upłynął jego limit czasu próby.\nByć może serwis 6obcy.org jest w tej chwili niedostępny.')],
				});
				break;
			}
			case 'ECONNREFUSED': {
				inter.followUp({ embeds: [
					new EmbedBuilder()
						.setColor('#F92F60')
						.setAuthor({ name: '❌ Połączenie zostało odmówione przez serwer 6obcy', iconURL: inter.user.displayAvatarURL() })],
				});
				break;
			}
			default: {
				inter.followUp({ embeds: [
					new EmbedBuilder()
						.setColor('#F92F60')
						.setAuthor({ name: '❌ Wystąpił błąd w połączeniu z WebSocket', iconURL: inter.user.displayAvatarURL() })],
				});
			}
			}

			return console.log(err);
		});

		collector.on('end', collected => {
			console.log(`Kolektor zakończył swoją prace na serwerze ${inter.guild.name}. Autor kolekcji: ${inter.user.tag} (${inter.user.id}). Zebrano ${collected.size} wiadomości.`);
		});
	},
};