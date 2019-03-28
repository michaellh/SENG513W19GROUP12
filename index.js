// Setup the Node.JS Express server with Socket.io
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const path = require('path');
const mongoClient = require('mongodb').MongoClient;

// Managing usernames
let usedUsers = [];
let availUsers = ["Danyell","Marjory","Nereida","Madie","Shavonda","Lucrecia","Dina","Jarvis","Paris","Euna","Michaela","Stefanie","Herminia","Arla","Rolland","Preston","Johnsie","Sunday","Alisia","Allyn"]

// Connected Users
let activeUsers = [];

let messageLog = [];

function styleName({username, color}){
    return `<span style='color:${color}'>${username}</span>`;
}

// Serving Public Folder for Scripts
app.use(express.static('public/dist'));
//app.use(express.static('public'));

app.get("*", function (req, res) {
    res.sendFile(__dirname + "/public/index.html")
})

// Connect to the MongoDB Atlas database
var dbClient;
const uri = "mongodb+srv://Michael:Test@demo-84yw9.mongodb.net/test?retryWrites=true";
mongoClient.connect(uri, (err, client) => {
    if (err) throw err;

    dbClient = client.db("SENG513");
    console.log("Connected to the database!");
    app.emit('db ready');
})

// Connect to your local mongoDB
// var mongoDBURL = "mongodb://localhost:27017/seng513";
// var dbClient;
// mongoClient.connect(mongoDBURL, function(err, db) {
//     if (err) throw err;

//     console.log("If seng513 already exists then we're connected to it otherwise it's created");
//     dbClient = db;
//     app.emit('db ready');
// });

// On Socket IO connection
io.on('connection', (socket) => {
    // Checking if user exist and assigning name
    const cookie = socket.client.request.headers.cookie;
    const userCookie =  cookie && cookie.split(';').find(cookie => cookie.includes('user='));
    const username = userCookie && userCookie.split('=')[1];
    let user = {username, color : '#000000'};
    
    // If there are users, Add it to the list
    if (username){
        // user = usedUsers.find(entry => entry.username == username);
        const oldUser = usedUsers.find(entry => entry.username == username);
        user = oldUser ? oldUser : user;
        
        // Only add to active user if he is not there
        if (!activeUsers.includes(user)){
            activeUsers.push(user);
        }
        socket.emit('setUser', user);
    }
    else{
        // Generating new name for the user
        user.username = availUsers[Math.floor(Math.random()*availUsers.length)];
        usedUsers.push(user);
        // Removing it from list of possible users
        availUsers.splice(availUsers.indexOf(user.username),1);
        activeUsers.push(user);
        socket.emit('setUser',user);
    }

    // Letting people know who connected
    socket.broadcast.emit('status', `${styleName(user)} has joined the chat`);

    // Updating userlist
    io.emit('userList', activeUsers);

    // Sending the Chat History
    socket.emit('history', messageLog);

    // Letting User know who they are
    socket.emit('status', `Welcome to the chat, you are ${styleName(user)}`);

    // Example MongoDB call
    // dbClient.collection("users").find({first_name: "Michael"}).toArray(function(err, result) {
    //     if(err) throw err;
    //     console.log(result);
    // });

    // Sending Messages
    socket.on('message', msg => {
        const message = {date : new Date(), ...msg};
        messageLog.push(message);
        io.emit('message', message);
    });

    // Changing Nickname
    socket.on('nickname', name => {
        if(activeUsers.find( user => user.username === name)){
            socket.emit('status', 'Name in use. Your name was not changed.')
        }else if(name === ''){
            socket.emit('status', 'Name cannot be empty. Your name was not changed.')
        }else{
            const updatedUser = {username: name, color: user.color};
            socket.emit('status', `Your name has been changed to ${styleName(updatedUser)}`);
            socket.broadcast.emit('status', `${styleName(user)} has changed their name to ${styleName(updatedUser)}`);
            user.username = name;
            socket.emit('setUser', user);
            io.emit('userList', activeUsers);
        }        
    });

    // Changing Color
    socket.on('color', color => {
        socket.emit('status', `Your username color has been changed: 
                                <span style='color:${user.color}'>${user.color}</span> -> <span style='color:#${color}'>#${color}</span>`);
        user.color = `#${color}`;
        socket.emit('setUser', user);
        io.emit('userList', activeUsers);
    });
    
    // On Disconnect
    socket.on('disconnect', () => {
        socket.broadcast.emit('status', `${styleName(user)} has left the chat`)
        activeUsers.splice(activeUsers.indexOf(user),1);
        io.emit('userList', activeUsers);
    });
});

app.on('db ready', function() {
    // Port # will be null/empty if run locally
    let port = process.env.PORT;
    if(port == null || port == "") {
        port = 3000;
    }
    http.listen(port);
    console.log('Listening on Port ' + port);
});