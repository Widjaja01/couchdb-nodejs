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

/**
 * This is sample API to get list of games
 *
 * The Map function
 * function(doc) {
 *   emit(null, {'title': doc.title, 'publisher': doc.publisher});
 * }
 *
 */

router.get('/games', function (req, res) {
  
  // API http://docs.couchdb.org/en/stable/api/ddoc/views.html#
  var apiUrl = [dbUri, '/', dbConfig.dbName, '/_design/', 
    dbConfig.designDocumentName, '/_view/', dbConfig.viewName].join('');

  request.get(apiUrl, function (error, response, body) {
    if (error) {
        res.status(500).send(error.message);
    } else {
      var statusCode = response.statusCode;
      var resultJSON = null;

      try {
        resultJSON = JSON.parse(body);
      } catch (ex) {
        resultJSON = null;
      }

      if (resultJSON === null) {
        res.status(500).send({'error': 'Error parsing the JSON string from couchDB'});
      } else if (statusCode !== 200 && resultJSON.error) {
        res.status(response.statusCode).send(resultJSON);
      } else {
        var allGames = [];

        resultJSON.rows.forEach(function (row) {
          var gameId = row.id;
          var gameTitle = (row.value && row.value.title) || '';
          var gamePublisher = (row.value && row.value.publisher) || '';
          allGames.push( {'id': gameId, 'title': gameTitle, 'publisher': gamePublisher} );
        });
        
        res.json(allGames);
      }
    }
  });
});

module.exports = router;
