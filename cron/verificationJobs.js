const { CronJob } = require('cron');
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

		console.log('Verifi » Cron jobs started');
	}

	stop() {
		if (this.reminderJob) this.reminderJob.stop();
		if (this.kickWarningJob) this.kickWarningJob.stop();
		if (this.kickJob) this.kickJob.stop();
		console.log('Verifi » Cron jobs stopped');
	}

	async processVerificationUsers(userStatuses, messageType, actionCallback) {
		for (const userStatus of userStatuses) {
			try {
				const { guild, serverConfig, member } = await this.getVerificationContext(userStatus);
				if (!guild || !serverConfig || !member) continue;

				await actionCallback(userStatus, member, guild, serverConfig);
			} catch (err) {
				console.error(`Verifi » Failed to process ${messageType} for user ${userStatus.userId}:`, err.message);
			}
		}
	}

	async getVerificationContext(userStatus) {
		const guild = this.client.guilds.cache.get(userStatus.guildId);
		if (!guild) return {};

		const serverConfig = getServerConfig(userStatus.guildId);
		if (!serverConfig?.verification?.enabled) return {};

		const member = await guild.members.fetch(userStatus.userId).catch(() => null);
		if (!member) {
			await VerificationStatus.deleteOne({ _id: userStatus._id });
			return {};
		}

		return { guild, serverConfig, member };
	}

	async sendVerificationReminders() {
		try {
			const usersNeedingReminder = await VerificationStatus.findUsersNeedingReminder();
			console.log(`Verifi » Found ${usersNeedingReminder.length} users needing reminder`);

			await this.processVerificationUsers(usersNeedingReminder, 'reminder', async (userStatus, member, guild, serverConfig) => {
				if (serverConfig.verification?.messages?.reminder?.content) {
					const reminderContent = serverConfig.verification.messages.reminder.content(member, guild);
					await member.send(reminderContent);
				}
				await userStatus.sendReminder();
				console.log(`Verifi » Sent reminder to ${member.user.tag} in ${guild.name}`);
			});
		} catch (err) {
			console.error('Verifi » Error in sendVerificationReminders:', err);
		}
	}

	async sendKickWarnings() {
		try {
			const usersForWarning = await VerificationStatus.findUsersForKickWarning();
			console.log(`Verifi » Found ${usersForWarning.length} users needing kick warning`);

			await this.processVerificationUsers(usersForWarning, 'kick warning', async (userStatus, member, guild, serverConfig) => {
				if (serverConfig.verification?.messages?.kickWarning?.content) {
					const warningContent = serverConfig.verification.messages.kickWarning.content(member, guild);
					await member.send(warningContent);
				}
				await userStatus.sendKickWarning();
				console.log(`Verifi » Sent kick warning to ${member.user.tag} in ${guild.name}`);
			});
		} catch (err) {
			console.error('Verifi » Error in sendKickWarnings:', err);
		}
	}

	async kickUnverifiedUsers() {
		try {
			const usersToKick = await VerificationStatus.findUsersToKick();
			console.log(`Verifi » Found ${usersToKick.length} users to kick`);

			await this.processVerificationUsers(usersToKick, 'kick', async (userStatus, member, guild, serverConfig) => {
				try {
					if (serverConfig.verification?.messages?.kickMessage?.content) {
						const kickContent = serverConfig.verification.messages.kickMessage.content(member, guild);
						await member.send(kickContent);
					}
				} catch (dmErr) {
					console.warn(`Verifi » Could not DM ${member.user.tag} before kick:`, dmErr.message);
				}

				await member.kick('Failed to complete verification within 4 days');
				await VerificationStatus.deleteOne({ _id: userStatus._id });
				console.log(`Verifi » Kicked ${member.user.tag} from ${guild.name} for not verifying`);
			});
		} catch (err) {
			console.error('Verifi » Error in kickUnverifiedUsers:', err);
		}
	}
}

module.exports = VerificationJobs;