var PouchDB = require('pouchdb');
var express = require('express'),
    app     = express();

////http://pouchdb.com/api.html#create_database
//var db = new PouchDB('tmpdb', {
//    db : require('leveldown')
//    //'cacheSize' (number, default: 8 * 1024 * 1024)
//    //'compression': true
//});


//https://github.com/pouchdb/express-pouchdb#contributing
var InMemPouchDB = PouchDB.defaults({db: require('memdown')});

app.use('/db', require('express-pouchdb')(InMemPouchDB));

var myPouch = new InMemPouchDB('foo');

app.listen(3000);
