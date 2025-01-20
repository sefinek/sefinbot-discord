const axios = require('axios');
const { version, homepage } = require('../package.json');

axios.defaults.headers.common = {
	'User-Agent': `Mozilla/5.0 (compatible; SefiBot/${version}; +${homepage})`,
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'Cache-Control': 'no-cache',
	'Connection': 'keep-alive',
};

axios.defaults.timeout = 29000;

module.exports = axios;