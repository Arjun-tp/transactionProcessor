'use strict'
let req = require("express");
let express = req();
let mongoose = require('mongoose');
let router = req.Router();
let config    = require('./config/development'); //change db to developmentConsumer

let registerUser = require('./api/registerUser')
let db = config.db;


let app = {
    config : config
}

//Authenticate the headers middleware
express.use(function(req,res,next) {
    if (req.headers.authorization != 'transactionHead') {
        return res.status(403).send({ error: 'API Authentication Failed'})
    }
    next();
});



mongoose.connection.on('connected', function () {
    console.log('channel connected -----');
    let port = process.env.PORT || 6020;
    // express.use('/api', router);
    express.listen(port);
    console.log('Server started successfully.. !!! PORT - ' + port + '\n\n\n');    
});

mongoose.connection.on('error', function (mongoError) {
    console.log(new Date() + ' @ MongoDB: ERROR connecting to: ' + 'mongodb://' + db.mongo.host + '/' + db.mongo.db + ' - ' + mongoError);
});

mongoose.connection.on('close', function () {
    console.log(new Date() + ' @ MongoDB: Connection Closed');
    console.log('DataBase down!! Please restart your DB and Server!!');
});

console.log('db.mongo : '+JSON.stringify(db.mongo));
mongoose.connect('mongodb://' + db.mongo.host + ':' + db.mongo.port + '/' + db.mongo.db);


express.use("/api/registerUser", registerUser);




module.exports.default = app;