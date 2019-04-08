// Setup the Node.JS Express server with Socket.io
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoClient = require('mongodb').MongoClient;
const mongoURI = require('./controllers/constants').MONGO_URI;
const mObjectId = require('mongodb').ObjectId;
const passport = require('passport');
const cookieParser = require('cookie-parser');
const path = require('path');

// Serving Public Folder for Scripts
app.use(express.static('public/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cookieParser());

var controllers = require('./controllers');
var auth = require('./config');

// Connect to the MongoDB Atlas database
let dbClient;

var dbConnectPromise = new Promise(function(resolve, reject) {
    mongoClient.connect(mongoURI, (err, client) => {
        if (err) throw err;
    
        dbClient = client.db("SENG513");
        console.log("Connected to the database!");
        //app.emit('db ready');
        controllers.initialize(io, dbClient);
        controllers.initRoutes(app, dbClient);
        controllers.startListening(http);
        auth.initPassport(dbClient);
        resolve();
    });
});

dbConnectPromise.then(function() {
    console.log("bullshit");
    // Catch all other GET requests and return our app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/dist/index.html'));
    });
});

// mongoClient.connect(mongoURI, (err, client) => {
//     if (err) throw err;

//     dbClient = client.db("SENG513");
//     console.log("Connected to the database!");
//     //app.emit('db ready');
//     controllers.initialize(io, dbClient);
//     controllers.initRoutes(app, dbClient);
//     controllers.startListening(http);
//     auth.initPassport(dbClient);
// });
