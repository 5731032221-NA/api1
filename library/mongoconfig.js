var mongojs = require('mongojs');


//var databaseUrl = 'mongodb://admin:admin@192.168.0.103:27017/scb';
var databaseUrl = 'mongodb://admin:admin@192.168.0.88:27017/queue';
var collections = ['transaction'];

var connect = mongojs(databaseUrl, collections);



 
module.exports = {
    connect: connect
};

