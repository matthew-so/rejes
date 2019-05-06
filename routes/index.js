var express      = require('express');
var router       = express.Router();
var fs           = require('fs');
var xml2js       = require('xml2js');
var parser       = new xml2js.Parser();
const request = require('request');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true}));
/* GET home page. */

function curateSelection (result) {
    var array = result['files']['attributes'];
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

router.get('/', function(req, res, next) {
    var ip = req.connection.remoteAddress;

    let db = new sqlite3.Database('./db/chinook.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the SQlite database.');
    });

    let actionstaken = [];

    db.all(`SELECT move movements FROM actions WHERE ip = ?`, [ip], (err, row) => {
        if (err) {
            throw err;
        }
        if (row.length == 0) {
            db.all(`INSERT INTO actions (ip, move) VALUES(?, ?)`, [ip, JSON.stringify([])], (err, row) => {
                if (err) {
                    throw err;
                }
                actionstaken = [];
            })
        } else {
            actionstaken = JSON.stringify(row[0].movements);
        }
    });

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
    });

    var xmlfile = __dirname + "/../research_papers/test.xml";
    fs.readFile(xmlfile, "utf-8", function (error, text) {
        if (error) {
            throw error;
        } else {
            parser.parseString(text, function (err, result) {
                var books = curateSelection(result);
                res.render('index', { title:  books, ip: ip});
            });
        }
    });
});

router.post('/', function(req, res, next) {
    var ip = req.connection.remoteAddress;

    let db = new sqlite3.Database('./db/chinook.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the SQlite database.');
    });

    let actionstaken = [];

    db.all(`SELECT move movements FROM actions WHERE ip = ?`, [ip], (err, row) => {
        if (err) {
            throw err;
        }
        actionstaken = JSON.parse(row[0].movements);

        console.log(actionstaken);

        actionstaken.push(req.body.click);

        db.all(`UPDATE actions SET move = ? WHERE ip = ?`, [JSON.stringify(actionstaken), ip], (err, row) => {
            if (err) {
                throw err;
            }
        });
    });

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
});

module.exports = router;