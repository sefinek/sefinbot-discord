module.exports = x => {
	switch (x) {
	case 't':
		return new Date().toLocaleTimeString('pl-PL');
	case 'td':
		return `${new Date().toLocaleTimeString('pl-PL')}, ${new Date().toLocaleDateString('pl-PL')}`;
	default:
		throw new Error('time.js switch - invalid expression property');
	}
};