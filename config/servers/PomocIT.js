const { EmbedBuilder } = require('discord.js');

const channels = {
	welcome: '1002327796468699218',
	automod: '1002371687746109490',
	ogloszenia: '1002327796468699220',
	podziekowania: '1002327796468699226',
};

const roles = {
	verified: '1002329878592499722',
	unverified: '1412492205704220692',
};

module.exports = {
	id: '1002327795344621669',
	dev: false,

	autoModChannel: channels.automod,

	channels,
	roles,

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1328449218528022610',
			name: (count, arrow) => `👥・${count} ludu ${arrow}`,
		},
		online: {
			enabled: true,
			channelId: '1328449298698076222',
			name: count => `🌍・Online: ${count}`,
		},
		newest: {
			enabled: true,
			channelId: '1328452652836716629',
			name: user => `👋・${user}`,
		},
	},

	events: {
		welcome: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#05ff81')
						.setAuthor({ name: `👋 Użytkownik ${member.user.tag} dołączył do nas`, iconURL: member.guild.iconURL() })
						.setDescription(`Witaj ${member} na naszym serwerze! Mamy wielką nadzieje, że zostaniesz u nas na dłuższy czas. Miłego pobytu.\nJesteś naszym **${memberCount}. gościem**. Dziękujemy Ci za dołączenie!`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#61d2ff')
						.setAuthor({ name: `😥 Użytkownik ${member.user.tag} opuścił serwer`, iconURL: member.guild.iconURL() })
						.setDescription(`Niestety osoba ${member} wyszła z naszego serwera.\nMamy nadzieję, że jeszcze wrócisz do nas. Wierzymy w Ciebie.\nPo stracie tego członka mamy w sumie **${memberCount} osób**.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.welcome,
			content: (client, member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#ff4f62')
						.setAuthor({ name: `⚠️ Użytkownik ${member.tag} otrzymał bana`, iconURL: member.guild.iconURL() })
						.setDescription(`Osoba z nickiem <@${member.id}> została zbanowana na naszym serwerze przez jednego z administratorów. Cóż, bywa...\nPo stracie tego osobnika mamy w sumie **${memberCount} ludzi**.`)
						.setThumbnail(member.displayAvatarURL()),
				],
			}),
		},
		directMessages: {
			welcome: {
				enabled: true,
				content: (client, member) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#1b87ff')
							.setAuthor({ name: `Witaj ${member.user.tag} na ${member.guild.name}`, iconURL: member.guild.iconURL() })
							.setDescription('Dziękujemy za dołączenie do naszego serwera! Miłego pobytu.')
							.setThumbnail(member.user.displayAvatarURL()),
					],
				}),
			},
		},
	},

	reactions: [
		{
			name: 'check-mark-button',
			enabled: true,
			channels: [channels.ogloszenia, channels.podziekowania],
			emojis: ['✅'],
			thread: { enabled: false },
			validation: {},
		},
	],

	verification: {
		enabled: true,
		unverifiedRoleId: roles.unverified,
		verifiedRoleId: roles.verified,
		timeouts: {
			tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
			tokenCooldown: 5 * 60 * 1000, // 5 minutes cooldown between token requests
			reminderInterval: 6 * 60 * 60 * 1000, // 6 hours between reminders
			kickWarningAfter: 3 * 24 * 60 * 60 * 1000, // 3 days before kick warning
			kickAfter: 4 * 24 * 60 * 60 * 1000, // 4 days before actual kick
		},
		content: guild => ({
			embeds: [
				new EmbedBuilder()
					.setColor('#00D26A')
					.setAuthor({ name: `🔐 Weryfikacja na serwerze ${guild.name}`, iconURL: guild.iconURL() })
					.setDescription('Witamy! Aby uzyskać dostęp do wszystkich kanałów i funkcji, ukończ proces weryfikacji klikając przycisk poniżej.')
					.addFields([
						{ name: '🛡️ Dlaczego weryfikacja?', value: 'Weryfikacja pomaga utrzymać naszą społeczność bezpieczną przed botami i spamem.', inline: false },
						{ name: '⚡ Szybki proces', value: 'Ukończ weryfikację hCaptcha w przeglądarce - zajmie to tylko kilka sekund!', inline: false },
						{ name: '🔒 Bezpieczne i prywatne', value: 'Twoje dane są chronione, a proces jest całkowicie bezpieczny.', inline: false },
						{ name: '💻 Wsparcie IT', value: 'Po weryfikacji uzyskasz dostęp do wszystkich kanałów pomocy technicznej i wsparcia IT.', inline: false },
					])
					.setThumbnail(guild.iconURL()),
			],
		}),
		button: {
			label: 'Zweryfikuj mnie',
			emoji: '🔎',
			style: 'Primary',
		},
		messages: {
			tokenMessage: {
				content: (guild, verificationUrl) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#5865F2')
							.setDescription(`Aby uzyskać dostęp do **${guild.name}**, ukończ proces weryfikacji. Zachowaj link w tajemnicy.`)
							.addFields([
								{ name: '🔗 Link weryfikacyjny', value: `[Kliknij tutaj aby się zweryfikować](${verificationUrl})`, inline: false },
								{ name: '⏰ Wygasa za', value: '24 godziny', inline: true },
								{ name: '🛡️ Bezpieczeństwo', value: 'Ukończ wyzwanie hCaptcha', inline: true },
							]),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#FF6B35')
							.setAuthor({ name: '⚠️ Wymagana weryfikacja', iconURL: guild.iconURL() })
							.setDescription(`Cześć ${member.user.username}!\n\nTwój link weryfikacyjny dla **${guild.name}** wygasł. Musisz zweryfikować swoje konto, aby dalej korzystać z serwera.`)
							.addFields([
								{ name: '🔗 Jak się zweryfikować', value: 'Kliknij przycisk weryfikacji na serwerze, aby otrzymać nowy link weryfikacyjny.', inline: false },
								{ name: '⏰ Ważne', value: 'Jeśli nie zweryfikujesz się w ciągu 4 dni od dołączenia, zostaniesz usunięty z serwera.', inline: false },
							]),
					],
				}),
			},
			kickWarning: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#E74C3C')
							.setAuthor({ name: '🚨 Ostatnie ostrzeżenie - Usunięcie konta', iconURL: guild.iconURL() })
							.setDescription(`**WAŻNE POWIADOMIENIE**\n\nCześć ${member.user.username},\n\nJesteś na **${guild.name}** już ponad 3 dni bez ukończenia weryfikacji. **Masz 24 godziny na zweryfikowanie konta lub zostaniesz usunięty z serwera.**`)
							.addFields([
								{ name: '🔗 Zweryfikuj się TERAZ', value: 'Natychmiast kliknij przycisk weryfikacji na serwerze, aby otrzymać link weryfikacyjny.', inline: false },
								{ name: '⏰ Pozostały czas', value: 'Mniej niż 24 godziny do automatycznego usunięcia', inline: false },
								{ name: '❓ Potrzebujesz pomocy?', value: 'Skontaktuj się z moderatorami serwera, jeśli masz problem z weryfikacją.', inline: false },
							]),
					],
				}),
			},
			kickMessage: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#992D22')
							.setAuthor({ name: '👋 Usunięto z serwera', iconURL: guild.iconURL() })
							.setDescription(`Cześć ${member.user.username},\n\nZostałeś usunięty z **${guild.name}**, ponieważ nie ukończyłeś weryfikacji w wymaganym 4-dniowym okresie.`)
							.addFields([
								{ name: '🔄 Chcesz wrócić?', value: 'Możesz dołączyć ponownie do serwera w każdej chwili, ale będziesz musiał ukończyć weryfikację w ciągu 4 dni.', inline: false },
								{ name: '❓ Pytania?', value: 'Skontaktuj się z moderatorami serwera, jeśli masz pytania dotyczące tej polityki.', inline: false },
							]),
					],
				}),
			},
			success: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#77B255')
							.setAuthor({ name: '✅ Weryfikacja ukończona', iconURL: guild.iconURL() })
							.setDescription(`Witaj na **${guild.name}**! Twoje konto zostało pomyślnie zweryfikowane. Dziękujemy!`)
							.addFields([
								{ name: '🎉 Dostęp przyznany', value: 'Masz teraz pełny dostęp do wszystkich kanałów i funkcji serwera!', inline: false },
								{ name: '📝 Zasady serwera', value: 'Upewnij się, że przeczytałeś zasady serwera i wytyczne dotyczące wsparcia technicznego.', inline: false },
							]),
					],
				}),
			},
		},
	},


	features: {
		isDatingServer: false,
		cleverBot: false,
		botTrap: null,
	},
};