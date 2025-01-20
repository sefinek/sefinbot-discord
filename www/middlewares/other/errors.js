exports.notFound = (req, res) => {
	res.status(404).json({ success: false, status: 404 });
};

exports.internalError = (err, req, res, _next) => {
	if (err) console.error(err);
	res.status(500).json({ success: false, status: 500 });
};