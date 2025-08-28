const express = require('express');
const helmet = require('helmet');
const timeout = require('./middlewares/timeout.js');
const logger = require('./middlewares/morgan.js');
const { notFound, internalError } = require('./scripts/errors.js');

// Run express instance
const app = express();

// Set
app.set('trust proxy', 1);

// Use
app.use(helmet());
app.use(express.json({ limit: '8kb' }));
app.use(express.urlencoded({ limit: '8kb', extended: true }));

app.use(timeout());
app.use(logger);


module.exports = client => {
	// Discord
	app.post(/(.*)/, (req, res, next) => {
		req.bot = client;
		next();
	});

	// Endpoints
	const MainRouter = require('./routes/Main.js');
	app.use(MainRouter);

	// Errors
	app.use(notFound);
	app.use(internalError);

	// Start the server
	const { PORT } = process.env;
	app.listen(PORT, () => process.send ? process.send('ready') : console.log(`Web    » API running on http://127.0.0.1:${PORT}`));
};