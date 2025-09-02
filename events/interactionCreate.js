const { Events, Collection, EmbedBuilder, MessageFlags } = require('discord.js');
const { getServerConfig } = require('../config/guilds.js');
const crypto = require('crypto');
const VerificationStatus = require('../database/models/verification.model.js');
const { clearVerificationCache } = require('../scripts/verificationUtils.js');
const DEFAULT_COOLDOWN = 3;

// Cache for recent verification status checks
const statusCache = new Map();
const STATUS_CACHE_TTL = 30000; // 30 seconds

// Clean expired status cache entries every 5 minutes
setInterval(() => {
	const now = Date.now();
	for (const [key, value] of statusCache.entries()) {
		if (now - value.timestamp > STATUS_CACHE_TTL * 2) statusCache.delete(key);
	}
}, 300000);

module.exports = {
	name: Events.InteractionCreate,
	async execute(inter, client) {
		// Handle button interactions
		if (inter.isButton()) {
			if (inter.customId === 'verify_account') {
				const serverConfig = getServerConfig(inter.guild.id);

				if (!serverConfig?.verification?.enabled) {
					return inter.reply({
						content: '❌ Verification is not enabled on this server.',
						flags: MessageFlags.Ephemeral,
					});
				}

				const member = inter.member;
				const cacheKey = `${member.id}_${inter.guild.id}`;

				// Quick role check - no need to hit database
				if (!member.roles.cache.has(serverConfig.verification.unverifiedRoleId)) {
					return inter.reply({
						content: '✅ You are already verified on this server.',
						flags: MessageFlags.Ephemeral,
					});
				}

				try {
					// Check cooldown with cache first
					const cooldownTime = serverConfig.verification?.timeouts?.tokenCooldown || (5 * 60 * 1000);
					const now = Date.now();

					// Check cache for recent status
					const cachedStatus = statusCache.get(cacheKey);
					if (cachedStatus && (now - cachedStatus.timestamp < STATUS_CACHE_TTL)) {
						if (cachedStatus.hasValidToken && (now - cachedStatus.lastUpdate < cooldownTime)) {
							return inter.reply({
								content: `⏱️ Please wait ${Math.ceil(cooldownTime / 60000)} minutes before requesting a new verification link.`,
								flags: MessageFlags.Ephemeral,
							});
						}
					}

					// Database check for cooldown
					const existingStatus = await VerificationStatus.findOne({
						userId: member.id,
						guildId: inter.guild.id,
						updatedAt: { $gt: new Date(now - cooldownTime) },
					}).lean().hint({ userId: 1, guildId: 1 });

					if (existingStatus?.token && !existingStatus.tokenUsed) {
						// Update cache
						statusCache.set(cacheKey, {
							hasValidToken: true,
							lastUpdate: existingStatus.updatedAt.getTime(),
							timestamp: now,
						});

						return inter.reply({
							content: `⏱️ Please wait ${Math.ceil(cooldownTime / 60000)} minutes before requesting a new verification link.`,
							flags: MessageFlags.Ephemeral,
						});
					}

					// Generate token and URL
					const verificationToken = crypto.randomBytes(64).toString('hex');
					const verificationUrl = `http${process.env.NODE_ENV === 'production' ? 's://sefinek.net' : '://127.0.0.1:4030'}/verify/${verificationToken}`;
					const tokenExpiryTime = serverConfig.verification?.timeouts?.tokenExpiry || (24 * 60 * 60 * 1000);
					const expiresAt = new Date(now + tokenExpiryTime);

					// Batch database operation
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
								verified: false,
							},
						},
						{ upsert: true }
					);

					// Update status cache
					statusCache.set(cacheKey, {
						hasValidToken: true,
						lastUpdate: now,
						timestamp: now,
					});

					// Clear verification cache for this token
					clearVerificationCache(verificationToken);

					if (serverConfig.verification?.messages?.tokenMessage?.content) {
						const tokenContent = serverConfig.verification.messages.tokenMessage.content(inter.guild, verificationUrl);
						await inter.reply({
							...tokenContent,
							flags: MessageFlags.Ephemeral,
						});
					} else {
						await inter.reply({
							content: `🔗 Your verification link: ${verificationUrl}\n⏰ Expires in ${Math.ceil(tokenExpiryTime / (60 * 60 * 1000))} hours`,
							flags: MessageFlags.Ephemeral,
						});
					}

					console.log(`Verifi » Generated verification link for ${member.user.tag} (${member.id}) in guild ${inter.guild.id}`);
				} catch (err) {
					console.error('Verifi » Error generating verification token:', err);
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
				inter.reply({ content: `⏳ **Zwolnij!**\nPosiadasz aktywne ograniczenie czasowe dla komendy \`${command.data.name}\`. Możesz jej ponownie użyć <t:${expiredTimestamp}:R>.`, ephemeral: MessageFlags.Ephemeral });

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