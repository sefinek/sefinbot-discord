const { Events, Collection, EmbedBuilder, MessageFlags } = require('discord.js');
const { getServerConfig } = require('../config/guilds.js');
const crypto = require('crypto');
const VerificationStatus = require('../database/models/verification.model.js');
const { clearVerificationCache } = require('../scripts/verificationUtils.js');
const DEFAULT_COOLDOWN = 3;


module.exports = {
	name: Events.InteractionCreate,
	async execute(inter, client) {
		// Handle button interactions
		if (inter.isButton()) {
			if (inter.customId === 'verify_account') {
				const serverConfig = getServerConfig(inter.guild.id);
				if (!serverConfig?.verification?.enabled) return inter.reply({ content: '❌ Verification is not enabled on this server.', flags: MessageFlags.Ephemeral });

				// Check if user has unverified role (required for verification process)
				const member = inter.member;
				if (!member.roles.cache.has(serverConfig.verification.unverifiedRoleId)) return inter.reply({ content: '✅ You are already verified on this server.', flags: MessageFlags.Ephemeral });

				// Check if verified role exists
				const verifiedRole = inter.guild.roles.cache.get(serverConfig.verification.verifiedRoleId);
				if (!verifiedRole) return inter.reply({ content: '❌ Server verification roles are not properly configured. Please contact an administrator.', flags: MessageFlags.Ephemeral });

				try {
					// Check cooldown - database only
					const cooldownTime = serverConfig.verification?.timeouts?.tokenCooldown || (5 * 60 * 1000);
					const now = Date.now();

					const existingStatus = await VerificationStatus.findOne({
						userId: member.id,
						guildId: inter.guild.id,
						updatedAt: { $gt: new Date(now - cooldownTime) },
						verified: false,
					}, { token: 1, tokenUsed: 1, updatedAt: 1 }).lean();

					if (existingStatus?.token && !existingStatus.tokenUsed) {
						return inter.reply({ content: `⏱️ Please wait ${Math.ceil(cooldownTime / 60000)} minutes before requesting a new verification link.`, flags: MessageFlags.Ephemeral });
					}

					// Generate token and URL
					const verificationToken = crypto.randomBytes(64).toString('hex');
					const tokenExpiryTime = serverConfig.verification?.timeouts?.tokenExpiry || (24 * 60 * 60 * 1000);
					const verificationUrl = `http${process.env.NODE_ENV === 'production' ? 's://sefinek.net' : '://127.0.0.1:4030'}/verify/${verificationToken}`;

					// Atomic database operation to prevent race conditions
					const updateResult = await VerificationStatus.findOneAndUpdate(
						{
							userId: member.id,
							guildId: inter.guild.id,
							$or: [
								{ updatedAt: { $lte: new Date(now - cooldownTime) } },
								{ token: { $exists: false } },
								{ tokenUsed: true },
							],
						},
						{
							$setOnInsert: {
								joinedAt: member.joinedAt,
								firstTokenGeneratedAt: new Date(),
							},
							$set: {
								token: verificationToken,
								tokenExpiresAt: new Date(now + tokenExpiryTime),
								tokenUsed: false,
								verified: false,
							},
						},
						{ upsert: true, new: true }
					);

					// Double-check if update was successful (race condition protection)
					if (!updateResult || updateResult.token !== verificationToken) {
						return inter.reply({ content: '⏱️ Please wait a moment before requesting a new verification link.', flags: MessageFlags.Ephemeral });
					}

					// Clear verification cache and send response
					clearVerificationCache(verificationToken);

					const tokenContent = serverConfig.verification?.messages?.tokenMessage?.content?.(inter.guild, verificationUrl);

					await inter.reply({
						...(tokenContent || {
							content: `🔗 Your verification link: ${verificationUrl}\n⏰ Expires in ${Math.ceil(tokenExpiryTime / (60 * 60 * 1000))} hours`,
						}),
						flags: MessageFlags.Ephemeral,
					});

					console.log(`Verifi » Generated verification link for ${member.user.tag} (${member.id}) in guild ${inter.guild.id}`);
				} catch (err) {
					console.error('Verifi » Error generating verification token:', err);

					const errorMessage = err.code === 11000 ?
						'❌ A verification request is already being processed. Please wait a moment and try again.' :
						'❌ An error occurred while generating your verification link. Please try again later.';
					return inter.reply({ content: errorMessage, flags: MessageFlags.Ephemeral });
				}
			}

			return;
		}

		// Handle slash commands
		if (!inter.isChatInputCommand()) return;

		const command = client.interactions.get(inter.commandName);
		if (!command) return;

		const { cooldowns } = inter.client;
		if (!cooldowns.has(command.data.name)) cooldowns.set(command.data.name, new Collection());

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const cooldownAmount = (command.cooldown ?? DEFAULT_COOLDOWN) * 1000;

		if (timestamps.has(inter.user.id)) {
			const expirationTime = timestamps.get(inter.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1000);
				inter.reply({ content: `⏳ **Slow down!**\nYou have an active cooldown for the \`${command.data.name}\` command. You can use it again <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral });

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