const { Events, Collection, EmbedBuilder, MessageFlags } = require('discord.js');
const { getServerConfig } = require('../config/guilds.js');
const crypto = require('crypto');
const VerificationStatus = require('../database/models/verification.model.js');
const DEFAULT_COOLDOWN = 3;

module.exports = {
	name: Events.InteractionCreate,
	async execute(inter, client) {
		// Handle button interactions
		if (inter.isButton()) {
			if (inter.customId === 'verify_account') {
				const serverConfig = getServerConfig(inter.guild.id);

				if (!serverConfig || !serverConfig.verificationEnabled) {
					return inter.reply({
						content: '❌ Verification is not enabled on this server.',
						flags: MessageFlags.Ephemeral,
					});
				}

				const member = inter.member;

				if (!member.roles.cache.has(serverConfig.unverifiedRoleId)) {
					return inter.reply({
						content: '✅ You are already verified on this server.',
						flags: MessageFlags.Ephemeral,
					});
				}

				try {
					// Check if user is not generating tokens too frequently
					const existingStatus = await VerificationStatus.findOne({
						userId: member.id,
						guildId: inter.guild.id,
						updatedAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) }, // 5 minutes cooldown
					}).lean();

					if (existingStatus && existingStatus.token && !existingStatus.tokenUsed) {
						return inter.reply({
							content: '⏱️ Please wait 5 minutes before requesting a new verification link.',
							flags: MessageFlags.Ephemeral,
						});
					}

					// Clean old tokens for this user on this server
					await VerificationStatus.cleanUserTokens(member.id, inter.guild.id);

					const verificationToken = crypto.randomBytes(64).toString('hex');
					const verificationUrl = `http${process.env.NODE_ENV === 'production' ? 's://sefinek.net' : '://127.0.0.1:4030'}/verify/${verificationToken}`;
					const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

					// Update verification status with token
					await VerificationStatus.findOneAndUpdate(
						{ userId: member.id, guildId: inter.guild.id },
						{
							$setOnInsert: {
								joinedAt: member.joinedAt || new Date(),
								firstTokenGeneratedAt: new Date(),
							},
							$set: {
								token: verificationToken,
								tokenExpiresAt: expiresAt,
								tokenUsed: false,
							},
						},
						{ upsert: true, new: true }
					);

					const embed = new EmbedBuilder()
						.setColor('#3498DB')
						.setTitle('🔐 Discord Server Verification')
						.setDescription(`To gain access to **${inter.guild.name}**, please complete the verification process.`)
						.addFields(
							{ name: '🔗 Verification Link', value: `[Click here to verify](${verificationUrl})`, inline: false },
							{ name: '⏰ Expires in', value: '24 hours', inline: true },
							{ name: '🛡️ Security', value: 'Complete hCaptcha challenge', inline: true }
						)
						.setFooter({ text: 'Keep this link private • Verification required for server access', iconURL: inter.guild.iconURL() })
						.setTimestamp();

					await inter.reply({
						embeds: [embed],
						flags: MessageFlags.Ephemeral,
					});

					console.log(`Verification » Generated verification link for ${member.user.tag} (${member.id}) in guild ${inter.guild.id}`);
				} catch (err) {
					console.error('Verification » Error generating verification token:', err);
					return inter.reply({
						content: '❌ An error occurred while generating your verification link. Please try again later.',
						flags: MessageFlags.Ephemeral,
					});
				}
			}
			return;
		}

		// Handle slash commands
		if (!inter.isChatInputCommand()) return;

		const command = client.interactions.get(inter.commandName);
		if (!command) return;

		const { cooldowns } = inter.client;
		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const cooldownAmount = (command.cooldown ?? DEFAULT_COOLDOWN) * 1000;

		if (timestamps.has(inter.user.id)) {
			const expirationTime = timestamps.get(inter.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1000);
				inter.reply({ content: `⏳ **Zwolnij!**\nPosiadasz aktywne ograniczenie czasowe dla komendy \`${command.data.name}\`. Możesz jej ponownie użyć <t:${expiredTimestamp}:R>.`, ephemeral: true });

				return console.log(`SlCMD  » Interaction '${inter.commandName}' (cooldown ${expiredTimestamp}) was triggered by ${inter.user.tag} (${inter.id}) on the server ${inter.guild.name} (${inter.guild.id})`);
			}
		}

		timestamps.set(inter.user.id, now);
		setTimeout(() => timestamps.delete(inter.user.id), cooldownAmount);

		try {
			await command.execute(client, inter);
		} catch (err) {
			require('../scripts/error.js')(EmbedBuilder, inter, err);
		}

		console.log(`SlCMD  » Interaction '${inter.commandName}' was triggered by ${inter.user.tag} (${inter.id}) on the server ${inter.guild.name} (${inter.guild.id})`);
	},
};