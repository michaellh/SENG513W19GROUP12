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

// Serving Public Folder for Scripts
app.use(express.static('public/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

var controllers = require('./controllers');
var auth = require('./config');

// Connect to the MongoDB Atlas database
let dbClient;
mongoClient.connect(mongoURI, (err, client) => {
    if (err) throw err;

    dbClient = client.db("SENG513");
    console.log("Connected to the database!");
    //app.emit('db ready');
    controllers.initialize(io, dbClient);
    controllers.initRoutes(app, dbClient);
    controllers.startListening(http);
    auth.initPassport(dbClient);
});
