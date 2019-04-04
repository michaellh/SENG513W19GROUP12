// Setup the Node.JS Express server with Socket.io
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoClient = require('mongodb').MongoClient;
const mObjectId = require('mongodb').ObjectId;
const passport = require('passport');

// Serving Public Folder for Scripts
// app.use(express.static('public/dist'));
require('./config/authentication').initPassport();
app.use(express.static('public/dist'));
app.use(passport.initialize());

var controllers = require('./controllers');
controllers.createRoutes(app);
controllers.startListening(http);
// Connect to the MongoDB Atlas database
let dbClient;
const uri = "mongodb+srv://Michael:Test@demo-84yw9.mongodb.net/test?retryWrites=true";
mongoClient.connect(uri, (err, client) => {
    if (err) throw err;

    dbClient = client.db("SENG513");
    console.log("Connected to the database!");
    app.emit('db ready');
    controllers.initialize(io, dbClient);
});
// Connect to your local mongoDB
// var mongoDBURL = "mongodb://localhost:27017/seng513";
// var dbClient;
// mongoClient.connect(mongoDBURL, function(err, db) {
//     if (err) throw err;

//     console.log("If seng513 already exists then we're connected to it otherwise it's created");
//     dbClient = db;
//     app.emit('db ready');
// });

// Object.keys(io.sockets.sockets).forEach(d => {
