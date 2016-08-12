var settings = require('./settings');
//var Db = require('mongodb').Db;
//var Connection = require('mongodb').Connection;
//var Server = require('mongodb').Server;
//module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}));

var mongodb =require('mongodb');
var server = new mongodb.Server(settings.host, settings.port, {auto_reconnect:true});
module.exports = new mongodb.Db(settings.db, server, {safe:true});

//var db = new mongodb.Db('aluan', server, {safe:true});
//db.open(function(err, db){
//    if(!err){
//        console.log('connect');
//    }else{
//        console.log(err);
//    }
//});




url = 'mongodb://brotec:350602@101.200.174.136:27017/aluan';

var MongoClient = require('mongodb').MongoClient,
    test = require('assert');
MongoClient.connect(url, function(err, db) {
    test.equal(null, err);

    // Grab a collection without a callback no safe mode
    var col1 = db.collection('test_correctly_access_collections');

    // Grab a collection with a callback but no safe operation
    db.collection('test_correctly_access_collections', function(err, col2) {
        test.equal(null, err);

        // Grab a collection with a callback in safe mode, ensuring it exists (should fail as it's not created)
        db.collection('test_correctly_access_collections', {strict:true}, function(err, col3) {
            console.log(err);
            //test.ok(err != null);

            db.collection('userinfo', function(err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
// 查找 name 属性为 username 的文档
                collection.findOne({name: username}, function(err, doc) {
                    mongodb.close();
                    if (doc) {
// 封装文档为 User 对象
                        var user = new User(doc);
                        callback(err, user);
                    } else {
                        console.log('error message from db ' +err);
                        callback(err, null);
                    }
                });
            });

            // Create the collection
//            db.createCollection('test_correctly_access_collections', function(err, result) {
//
//                // Retry to get the collection, should work as it's now created
//                db.collection('test_correctly_access_collections', {strict:true}, function(err, col3) {
//                    test.equal(null, err);
//
//                    db.close();
//                });
//            });
        });
    });
});

