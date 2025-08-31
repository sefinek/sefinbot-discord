const { CronJob } = require('cron');
const { EmbedBuilder } = require('discord.js');
const VerificationStatus = require('../database/models/verification.model.js');
const { getServerConfig } = require('../config/guilds.js');

class VerificationJobs {
	constructor(client) {
		this.client = client;
		this.reminderJob = null;
		this.kickWarningJob = null;
		this.kickJob = null;
	}

	start() {
		this.reminderJob = new CronJob('0 */6 * * *', async () => {
			await this.sendVerificationReminders();
		}, null, true, 'Europe/Warsaw');

		this.kickWarningJob = new CronJob('0 */12 * * *', async () => {
			await this.sendKickWarnings();
		}, null, true, 'Europe/Warsaw');

		this.kickJob = new CronJob('0 0 * * *', async () => {
			await this.kickUnverifiedUsers();
		}, null, true, 'Europe/Warsaw');

		console.log('Verification » Cron jobs started');
	}

	stop() {
		if (this.reminderJob) this.reminderJob.stop();
		if (this.kickWarningJob) this.kickWarningJob.stop();
		if (this.kickJob) this.kickJob.stop();
		console.log('Verification » Cron jobs stopped');
	}

	async sendVerificationReminders() {
		try {
			const usersNeedingReminder = await VerificationStatus.findUsersNeedingReminder();
			console.log(`Verification » Found ${usersNeedingReminder.length} users needing reminder`);

			for (const userStatus of usersNeedingReminder) {
				try {
					const guild = this.client.guilds.cache.get(userStatus.guildId);
					if (!guild) continue;

					const serverConfig = getServerConfig(userStatus.guildId);
					if (!serverConfig?.verificationEnabled) continue;

					const member = await guild.members.fetch(userStatus.userId).catch(() => null);
					if (!member) {
						await VerificationStatus.deleteOne({ _id: userStatus._id });
						continue;
					}

					const embed = new EmbedBuilder()
						.setColor('#FF6B35')
						.setTitle('⚠️ Verification Required')
						.setDescription(`Hello ${member.user.username}!\n\nYour verification link for **${guild.name}** has expired. You need to verify your account to continue accessing the server.`)
						.addFields(
							{ name: '🔗 How to verify', value: 'Click the verification button in the server to get a new verification link.', inline: false },
							{ name: '⏰ Important', value: 'If you don\'t verify within 4 days of joining, you will be removed from the server.', inline: false }
						)
						.setFooter({ text: `${guild.name} • Verification Required`, iconURL: guild.iconURL() })
						.setTimestamp();

					await member.send({ embeds: [embed] });
					await userStatus.sendReminder();

					console.log(`Verification » Sent reminder to ${member.user.tag} in ${guild.name}`);
				} catch (err) {
					console.error(`Verification » Failed to send reminder to user ${userStatus.userId}:`, err.message);
				}
			}
		} catch (err) {
			console.error('Verification » Error in sendVerificationReminders:', err);
		}
	}

	async sendKickWarnings() {
		try {
			const usersForWarning = await VerificationStatus.findUsersForKickWarning();
			console.log(`Verification » Found ${usersForWarning.length} users needing kick warning`);

			for (const userStatus of usersForWarning) {
				try {
					const guild = this.client.guilds.cache.get(userStatus.guildId);
					if (!guild) continue;

					const serverConfig = getServerConfig(userStatus.guildId);
					if (!serverConfig?.verificationEnabled) continue;

					const member = await guild.members.fetch(userStatus.userId).catch(() => null);
					if (!member) {
						await VerificationStatus.deleteOne({ _id: userStatus._id });
						continue;
					}

					const embed = new EmbedBuilder()
						.setColor('#E74C3C')
						.setTitle('🚨 Final Warning - Account Removal')
						.setDescription(`**IMPORTANT NOTICE**\n\nHello ${member.user.username},\n\nYou have been on **${guild.name}** for over 3 days without completing verification. **You have 24 hours to verify your account or you will be removed from the server.**`)
						.addFields(
							{ name: '🔗 Verify NOW', value: 'Click the verification button in the server immediately to get your verification link.', inline: false },
							{ name: '⏰ Time Remaining', value: 'Less than 24 hours before automatic removal', inline: false },
							{ name: '❓ Need Help?', value: 'Contact server moderators if you\'re having trouble with verification.', inline: false }
						)
						.setFooter({ text: `${guild.name} • Final Warning`, iconURL: guild.iconURL() })
						.setTimestamp();

					await member.send({ embeds: [embed] });
					await userStatus.sendKickWarning();

					console.log(`Verification » Sent kick warning to ${member.user.tag} in ${guild.name}`);
				} catch (err) {
					console.error(`Verification » Failed to send kick warning to user ${userStatus.userId}:`, err.message);
				}
			}
		} catch (err) {
			console.error('Verification » Error in sendKickWarnings:', err);
		}
	}

	async kickUnverifiedUsers() {
		try {
			const usersToKick = await VerificationStatus.findUsersToKick();
			console.log(`Verification » Found ${usersToKick.length} users to kick`);

			for (const userStatus of usersToKick) {
				try {
					const guild = this.client.guilds.cache.get(userStatus.guildId);
					if (!guild) continue;

					const serverConfig = getServerConfig(userStatus.guildId);
					if (!serverConfig?.verificationEnabled) continue;

					const member = await guild.members.fetch(userStatus.userId).catch(() => null);
					if (!member) {
						await VerificationStatus.deleteOne({ _id: userStatus._id });
						continue;
					}

					const embed = new EmbedBuilder()
						.setColor('#992D22')
						.setTitle('👋 Removed from Server')
						.setDescription(`Hello ${member.user.username},\n\nYou have been removed from **${guild.name}** because you did not complete verification within the required 4-day period.`)
						.addFields(
							{ name: '🔄 Want to rejoin?', value: 'You can rejoin the server anytime, but you\'ll need to complete verification within 4 days.', inline: false },
							{ name: '❓ Questions?', value: 'Contact server moderators if you have any questions about this policy.', inline: false }
						)
						.setFooter({ text: `${guild.name} • Account Removed`, iconURL: guild.iconURL() })
						.setTimestamp();

					try {
						await member.send({ embeds: [embed] });
					} catch (dmErr) {
						console.warn(`Verification » Could not DM ${member.user.tag} before kick:`, dmErr.message);
					}

					await member.kick('Failed to complete verification within 4 days');
					await VerificationStatus.deleteOne({ _id: userStatus._id });

					console.log(`Verification » Kicked ${member.user.tag} from ${guild.name} for not verifying`);
				} catch (err) {
					console.error(`Verification » Failed to kick user ${userStatus.userId}:`, err.message);
				}
			}
		} catch (err) {
			console.error('Verification » Error in kickUnverifiedUsers:', err);
		}
	}
}

module.exports = VerificationJobs;