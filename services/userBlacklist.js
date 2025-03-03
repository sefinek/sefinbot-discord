// grex "manekin" "kajser" "delightful_cheetah" "hitler" "sefinek"
const regex = /delightful_cheetah|manekin|sefinek|(?:hitl|kajs)er/i;

module.exports = (displayUsername, username) => {
	const isValid = regex.test(displayUsername) || regex.test(username);
	if (isValid) console.log('Username detected on the blacklist');
	return isValid;
};
