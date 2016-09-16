var express = require('express');
var request = require('request');
var router = express.Router();

// couchdb server healtcheck
router.get('/healthcheck', function (req, res) {
	request.get('http://127.0.0.1:5985', function (error, response, body) {
		if (error) {
			res.status(500).send(error.message);
		} else {
			var statusCode = response.statusCode;
			res.json(body);
		}
	});
});

module.exports = router;
