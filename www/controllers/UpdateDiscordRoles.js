const fetchDiscordUser = require('./scripts/fetchDiscordUser.js');

const prefix = '[UpdateDscRoles]:';

module.exports = async (req, res) => {
	const { guildId, stellaPlusRole, patreonRole, tierRoles, newRoleId, subscriberId } = req.body;
	if (!subscriberId) {
		return res.status(400).send({ success: false, status: 400, message: 'Subscriber ID was not provided.' });
	}

	if (!guildId) {
		return res.send({ success: false, status: 400, message: 'Guild ID was not provided in the POST request.' });
	}

	if (!stellaPlusRole || !patreonRole || !tierRoles) {
		return res.send({ success: false, status: 400, message: '`stellaPlusRole`, `patreonRole` or `tierRoles` was not found.' });
	}

	if (!newRoleId) {
		return res.send({ success: false, status: 200, message: 'New role ID was not provided.' });
	}

	try {
		// Get Discord user
		const data = await fetchDiscordUser(req, res, guildId, subscriberId);
		if (!data.success) return res.status(data.status).send(data);

		// Remove old roles
		const roles = data.member.roles.cache.map(r => r);
		for (const role of roles) {
			if (tierRoles.includes(role.id) && role.id !== newRoleId) {
				await data.member.roles.remove(role.id);
				console.log(prefix, `Removed role ${role.name} (${role.id})`);
			}
		}

		// Add new role
		if (!data.member.roles.cache.has(newRoleId)) {
			await data.member.roles.add(newRoleId);

			console.log(prefix, `Added role ${data.guild.roles.cache.get(newRoleId).name}`);
		}

		// Add 'Stella Mod Plus' role
		if (!data.member.roles.cache.has(stellaPlusRole)) {
			await data.member.roles.add(stellaPlusRole);

			console.log(prefix, `Added role ${data.guild.roles.cache.get(stellaPlusRole).name}`);
		}

		// Remove 'Patron' role
		if (data.member.roles.cache.has(patreonRole)) {
			await data.member.roles.remove(patreonRole);

			console.log(prefix, `Removed role ${data.guild.roles.cache.get(stellaPlusRole).name}`);
		}

		res.send({ success: true, status: 200 });
	} catch (err) {
		res.status(500).send({ success: false, status: 500, message: err });
	}
};