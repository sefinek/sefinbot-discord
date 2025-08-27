const { Events, Collection, EmbedBuilder } = require('discord.js');
const DEFAULT_COOLDOWN = 3;

module.exports = {
	name: Events.InteractionCreate,
	async execute(inter, client) {
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

				return console.log(`SlashC » Interaction '${inter.commandName}' (cooldown ${expiredTimestamp}) was triggered by ${inter.user.tag} (${inter.id}) on the server ${inter.guild.name} (${inter.guild.id})`);
			}
		}

		timestamps.set(inter.user.id, now);
		setTimeout(() => timestamps.delete(inter.user.id), cooldownAmount);

		try {
			await command.execute(client, inter);
		} catch (err) {
			require('../scripts/error.js')(EmbedBuilder, inter, err);
		}

		console.log(`SlashC » Interaction '${inter.commandName}' was triggered by ${inter.user.tag} (${inter.id}) on the server ${inter.guild.name} (${inter.guild.id})`);
	},
};