const blacklist = ['manekin', 'kajser23', 'Kaiser', 'delightful_cheetah', 'hitler', 'sefinek'];
const blacklistRegex = new RegExp(blacklist.map(name => `\b${name}\b`).join('|'), 'i');

module.exports = (displayUsername, username) => {
	const isValid = blacklistRegex.test(displayUsername) || blacklistRegex.test(username);
	if (isValid) console.log('Username detected on the blacklist');
	return isValid;
};
