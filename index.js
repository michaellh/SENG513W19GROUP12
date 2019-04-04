// Setup the Node.JS Express server with Socket.io
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoClient = require('mongodb').MongoClient;
const mongoURI = require('./controllers/constants').MONGO_URI;
const mObjectId = require('mongodb').ObjectId;
const passport = require('passport');

// Serving Public Folder for Scripts
require('./config/authentication').initPassport();
app.use(express.static('public/dist'));
app.use(passport.initialize());

var controllers = require('./controllers');
controllers.createRoutes(app);
controllers.startListening(http);

// Connect to the MongoDB Atlas database
let dbClient;
mongoClient.connect(mongoURI, (err, client) => {
    if (err) throw err;

    dbClient = client.db("SENG513");
    console.log("Connected to the database!");
    app.emit('db ready');
    controllers.initialize(io, dbClient);
});
