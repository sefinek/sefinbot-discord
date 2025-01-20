const fetchDiscordUser = require('./scripts/fetchDiscordUser.js');

const prefix = '[RemoveDscRoles]:';

module.exports = async (req, res) => {
	const { guildId, stellaPlusRole, patreonRole, tierRoles, subscriberId } = req.body;
	if (!subscriberId) {
		res.status(400).send({ success: false, status: 400, message: 'Subscriber ID was not provided' });
		return console.warn(prefix, 'Unknown user ID of subscriber; Received:', subscriberId);
	}

	try {
		// Get Discord user
		const data = await fetchDiscordUser(req, res, guildId, subscriberId);
		if (!data.success) return res.status(data.status).send(data);

		// Remove all roles
		const roles = data.member.roles.cache.map(r => r);
		for (const role of roles) {
			if (tierRoles.includes(role.id)) {
				await data.member.roles.remove(role.id);
				console.log(prefix, `Removed role ${role.name} (${role.id})`);
			}
		}

		// Remove 'Stella Mod Plus' role
		if (data.member.roles.cache.has(stellaPlusRole)) {
			await data.member.roles.remove(stellaPlusRole);
			console.log(prefix, `Removed role ${data.guild.roles.cache.get(stellaPlusRole).name}`);
		}

		// Remove 'Patron' role
		if (data.member.roles.cache.has(patreonRole)) {
			await data.member.roles.remove(patreonRole);
			console.log(prefix, `Removed role ${data.guild.roles.cache.get(patreonRole).name}`);
		}

		res.send({ success: true, status: 200 });
	} catch (err) {
		res.status(500).send({ success: false, status: 500, message: err });
	}
};