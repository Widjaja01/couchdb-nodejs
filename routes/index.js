var express = require('express');
var request = require('request');
var dbConfig = require('../configs/dbconf');
var router = express.Router();

var dbUri = dbConfig.dbHost + ':' + dbConfig.dbPort;

// couchdb server healtcheck
router.get('/healthcheck', function (req, res) {
  request.get(dbUri, function (error, response, body) {
    if (error) {
      res.status(500).send(error.message);
    } else {
      var statusCode = response.statusCode;
      res.json(body);
    }
  });
});

module.exports = router;
