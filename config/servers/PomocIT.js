const { EmbedBuilder } = require('discord.js');

const channels = {
	welcome: '1002327796468699218',
	automod: '1002371687746109490',
	support1: '1002327796468699220',
	support2: '1002327796468699226',
};

const roles = {
	verified: '1328449500000000000',
	unverified: '1328449400000000000',
};

module.exports = {
	id: '1002327795344621669',
	dev: false,

	automodChannelId: channels.automod,

	channels,
	roles,

	voiceChannels: {
		members: {
			enabled: true,
			channelId: '1328449218528022610',
			name: (count, arrow) => `👥・${count} ${arrow || ''}ludu`,
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
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#00D26A')
						.setAuthor({ name: `👋 Użytkownik ${member.user.tag} dołączył do nas`, iconURL: member.guild.iconURL() })
						.setDescription(`Witaj ${member} na naszym serwerze! Mamy wielką nadzieje, że zostaniesz u nas na dłuższy czas. Miłego pobytu.\nJesteś naszym **${memberCount}. gościem**. Dziękujemy Ci za dołączenie!`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		farewell: {
			channelId: channels.welcome,
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF6B6B')
						.setAuthor({ name: `😥 Użytkownik ${member.user.tag} opuścił serwer`, iconURL: member.guild.iconURL() })
						.setDescription(`Niestety osoba ${member} wyszła z naszego serwera.\nMamy nadzieję, że jeszcze wrócisz do nas. Wierzymy w Ciebie.\nPo stracie tego członka mamy w sumie **${memberCount} osób**.`)
						.setThumbnail(member.user.displayAvatarURL()),
				],
			}),
		},
		ban: {
			channelId: channels.welcome,
			content: (member, memberCount) => ({
				embeds: [
					new EmbedBuilder()
						.setColor('#FF4757')
						.setAuthor({ name: `⚠️ Użytkownik ${member.tag} otrzymał bana`, iconURL: member.guild.iconURL() })
						.setDescription(`Osoba z nickiem <@${member.id}> została zbanowana na naszym serwerze przez jednego z administratorów. Cóż, bywa...\nPo stracie tego osobnika mamy w sumie **${memberCount} ludzi**.`)
						.setThumbnail(member.displayAvatarURL()),
				],
			}),
		},
		directMessages: {
			welcome: {
				enabled: true,
				content: member => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#0078FF')
							.setAuthor({ name: `Witaj ${member.user.tag} na naszym serwerze ${member.guild.name}`, iconURL: member.guild.iconURL() })
							.setDescription('Dziękujemy za dołączenie do naszego serwera! Miłego pobytu.')
							.setThumbnail(member.user.displayAvatarURL()),
						new EmbedBuilder()
							.setColor('#15070C')
							.setFooter({ text: 'Copyright 2024-2025 © by Sefinek. All Rights Reserved.', iconURL: member.guild.iconURL() }),
					],
				}),
			},
		},
	},

	reactions: {
		approve: {
			channels: [
				channels.support1,
				channels.support2,
			],
			emoji: '✅',
		},
	},

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
					.setTitle('🔐 Weryfikacja na serwerze IT')
					.setDescription(`Witaj na **${guild.name}**!\n\nAby uzyskać dostęp do wszystkich kanałów i funkcji, ukończ proces weryfikacji klikając przycisk poniżej.`)
					.addFields([
						{ name: '🛡️ Dlaczego weryfikacja?', value: 'Weryfikacja pomaga utrzymać naszą społeczność IT bezpieczną przed botami i spamem.', inline: false },
						{ name: '⚡ Szybki proces', value: 'Ukończ weryfikację hCaptcha w przeglądarce - zajmie to tylko kilka sekund!', inline: false },
						{ name: '🔒 Bezpieczne i prywatne', value: 'Twoje dane są chronione, a proces jest całkowicie bezpieczny.', inline: false },
						{ name: '💻 Wsparcie IT', value: 'Po weryfikacji uzyskasz dostęp do kanałów pomocy technicznej i wsparcia IT.', inline: false },
					])
					.setFooter({ text: `${guild.name} • Kliknij przycisk poniżej aby się zweryfikować`, iconURL: guild.iconURL() })
					.setThumbnail(guild.iconURL())
					.setTimestamp(),
			],
		}),
		button: {
			label: 'Zweryfikuj się',
			emoji: '✅',
			style: 'Primary',
		},
		messages: {
			tokenMessage: {
				content: (guild, verificationUrl) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#00D26A')
							.setTitle('🔐 Weryfikacja Discord')
							.setDescription(`Aby uzyskać dostęp do **${guild.name}**, ukończ proces weryfikacji.`)
							.addFields([
								{ name: '🔗 Link weryfikacyjny', value: `[Kliknij tutaj aby się zweryfikować](${verificationUrl})`, inline: false },
								{ name: '⏰ Wygasa za', value: '24 godziny', inline: true },
								{ name: '🛡️ Bezpieczeństwo', value: 'Ukończ wyzwanie hCaptcha', inline: true },
							])
							.setFooter({ text: 'Zachowaj ten link w tajemnicy • Wymagana weryfikacja', iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			reminder: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#FF6B35')
							.setTitle('⚠️ Wymagana weryfikacja')
							.setDescription(`Cześć ${member.user.username}!\n\nTwój link weryfikacyjny dla **${guild.name}** wygasł. Musisz zweryfikować swoje konto, aby dalej korzystać z serwera.`)
							.addFields([
								{ name: '🔗 Jak się zweryfikować', value: 'Kliknij przycisk weryfikacji na serwerze, aby otrzymać nowy link weryfikacyjny.', inline: false },
								{ name: '⏰ Ważne', value: 'Jeśli nie zweryfikujesz się w ciągu 4 dni od dołączenia, zostaniesz usunięty z serwera.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Wymagana weryfikacja`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			kickWarning: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#E74C3C')
							.setTitle('🚨 Ostatnie ostrzeżenie - Usunięcie konta')
							.setDescription(`**WAŻNE POWIADOMIENIE**\n\nCześć ${member.user.username},\n\nJesteś na **${guild.name}** już ponad 3 dni bez ukończenia weryfikacji. **Masz 24 godziny na zweryfikowanie konta lub zostaniesz usunięty z serwera.**`)
							.addFields([
								{ name: '🔗 Zweryfikuj się TERAZ', value: 'Natychmiast kliknij przycisk weryfikacji na serwerze, aby otrzymać link weryfikacyjny.', inline: false },
								{ name: '⏰ Pozostały czas', value: 'Mniej niż 24 godziny do automatycznego usunięcia', inline: false },
								{ name: '❓ Potrzebujesz pomocy?', value: 'Skontaktuj się z moderatorami serwera, jeśli masz problem z weryfikacją.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Ostatnie ostrzeżenie`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			kickMessage: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#992D22')
							.setTitle('👋 Usunięto z serwera')
							.setDescription(`Cześć ${member.user.username},\n\nZostałeś usunięty z **${guild.name}**, ponieważ nie ukończyłeś weryfikacji w wymaganym 4-dniowym okresie.`)
							.addFields([
								{ name: '🔄 Chcesz wrócić?', value: 'Możesz dołączyć ponownie do serwera w każdej chwili, ale będziesz musiał ukończyć weryfikację w ciągu 4 dni.', inline: false },
								{ name: '❓ Pytania?', value: 'Skontaktuj się z moderatorami serwera, jeśli masz pytania dotyczące tej polityki.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Konto usunięte`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
			success: {
				content: (member, guild) => ({
					embeds: [
						new EmbedBuilder()
							.setColor('#27ae60')
							.setTitle('✅ Weryfikacja ukończona!')
							.setDescription(`Witaj na **${guild.name}**! Twoje konto zostało pomyślnie zweryfikowane.`)
							.addFields([
								{ name: '🎉 Dostęp przyznany', value: 'Masz teraz pełny dostęp do wszystkich kanałów serwera i funkcji wsparcia IT.', inline: false },
								{ name: '📝 Zasady serwera', value: 'Upewnij się, że przeczytałeś zasady serwera i wytyczne dotyczące wsparcia technicznego.', inline: false },
							])
							.setFooter({ text: `${guild.name} • Witamy!`, iconURL: guild.iconURL() })
							.setTimestamp(),
					],
				}),
			},
		},
	},

	cron: {
		enabled: false,
		timezone: 'Europe/Warsaw',
		minimumOnlineMembers: 0,
		schedules: {},
	},

	features: {
		isDatingServer: false,
		cleverBot: null,
		timeBasedModes: false,
		techSupport: true,
		botTrap: null,
	},
};