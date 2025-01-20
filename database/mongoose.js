const { connect, connection } = require('mongoose');

connect(process.env.MONGODB_URL).catch(err => {
	console.error('DataBS » Failed to connect to the database', err);
	process.exit(1);
});

connection.on('connected', () => console.log('DataBS » Successfully connected to the database'));
connection.on('disconnected', () => console.warn('DataBS » MongoDB disconnected!'));

connection.on('error', err => {
	console.error('DataBS » MongoDB connection error:', err);
	process.exit(1);
});