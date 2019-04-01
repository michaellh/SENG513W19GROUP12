// Setup the Node.JS Express server with Socket.io
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const path = require('path');
const mongoClient = require('mongodb').MongoClient;
const mObjectId = require('mongodb').ObjectId;

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
// app.use(express.static('public/dist'));
app.use(express.static('public/dist'));

// Connect to the MongoDB Atlas database
let dbClient;
const uri = "mongodb+srv://Michael:Test@demo-84yw9.mongodb.net/test?retryWrites=true";
mongoClient.connect(uri, (err, client) => {
    if (err) throw err;

    dbClient = client.db("SENG513");
    console.log("Connected to the database!");
    app.emit('db ready');

    // dbClient.collection('users').find({name:'user'}, (err, res) => {
    //     res.forEach(d => {
    //         console.log(d);
    //     });
    // });
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

let chat = {};
chat.Chat1 = [];
chat.Chat2 = [];

mID = id => new mObjectId(id);

io.on('connect', socket => {
    // Checking if user exist and assigning name
    const cookie = socket.client.request.headers.cookie;
    const userCookie =  cookie && cookie.split(';').find(cookie => cookie.includes('user='));
    // username being used below as the username from the database
    const username = userCookie && userCookie.split('=')[1];
    let userID;
    let inDB = true;
    // console.log(username);
    
    dbClient.collection('users').findOneAndUpdate({name:username}, {$set:{socketID: socket.id}}, {returnOriginal: false}, (err, res) => {
        let user = res.value;
        console.log(res);
        // console.log(user);
        if (user){
            userID = user._id;
            console.log(userID);
            // console.log(user.socketID, socket.id);
            socket.emit('startInfo', {chats:user.chats, friends:user.friends});
            // socket.emit('chatlist', user.chats);
            // socket.emit('friendlist', user.friends);
        }else{
            inDB = false;
            // Enroll new user
            socket.emit('startInfo', {chats:['Chat1', 'Chat2'], friends: ['Friend1', 'Friend2', 'Friend3']});            
        }
    });

    sendback = (message) => {
        socket.emit('debug', message);
    }
    // console.log('Connected');
    // To send message back and forth
    socket.on('debug', msg => {
       eval(msg); 
    });

    socket.on('joinRoom', chat => {
        console.log('Joined' + chat.name, chat.id);
        socket.join(chat.id);
    });

    socket.on('leaveRoom', chat => {
        console.log('Left' + chat.name, chat.id);
        socket.leave(chat.id);
    });

    socket.on('message', msg => {
        // console.log(msg);
        if(inDB) {
            dbClient.collection('chats').update({_id:mID(msg.chat.id)}, {$push : {messages: msg.msg}});
            io.to(msg.chat.id).emit('message', msg.msg);
        }else{
            chat[msg.chat.id].push(msg.msg);
            io.to(msg.chat.id).emit('message', msg.msg);
        }
    });

    socket.on('reqHistory', id => {
        if(inDB){
            dbClient.collection('chats').findOne({_id:mID(id)}, (err, res) => {
                // console.log(res);
                socket.emit('loadHistory', res.messages);
            });
        }else{
            socket.emit('loadHistory', chat[id]);
        }
    });

    socket.on('createGroupChat', name => {
        if(inDB){
            let groupChatObj = {
                name,
                group: true,
                messages:[],
                members:[
                    {id : userID, name: username}
                ]
            };
            // Adding to Chats Table
            dbClient.collection('chats').insertOne(groupChatObj, (err,res) => {
                const {_id:id, name, group} = res.ops[0];
                // Adding Chats name and ID to user table
                dbClient.collection('users').findOneAndUpdate({_id:mID(userID)},{$push : {chats: {id,name, group}}}, {returnOriginal:false}, (err, res) => {
                    // console.log(res, err);
                    let user = res.value;
                    sendback(user);
                    // Updating user chatlist and friends.
                    socket.emit('startInfo', {chats:user.chats, friends:user.friends});
                });
                // dbClient.collection('users').findOne({_id:mID(userID)}, (err, res) => {
                //     console.log(res, err);
                // });
            });
            
        }
    });

    socket.on('createSingleChat', name => {
        if(inDB){
            // Find user in DB, res is null if not found
            dbClient.collection('users').findOne({name}, (err, res) => {
                if(res){
                    // Found Users id, and name
                    const {_id:clientID, name:clientName} = res;
                    let chatObj = {
                        name : 'OneOnOne',
                        group : false,
                        messages : [],
                        members : [
                            // Self
                            {id : userID, name: username},
                            // res user
                            {id : clientID, name: clientName},
                        ]
                    };
                    // Adding to chats table
                    dbClient.collection('chats').insertOne(chatObj, (err,res) => {
                        // Getting group condition, and id back from result
                        const {_id:id, group} = res.ops[0];
                        
                        // Update Self Chat Table
                        dbClient.collection('users').findOneAndUpdate({_id:mID(userID)},{$push : {chats: {id, name: clientName, group}}}, {returnOriginal:false}, (err, res) => {
                            let user = res.value;
                            sendback(['Self',user]);
                            // Updating user chatlist and friends.
                            socket.emit('startInfo', {chats:user.chats, friends:user.friends});
                        });

                         // Update Client Chat Table, id is clients, but name is self name
                         dbClient.collection('users').findOneAndUpdate({_id:mID(clientID)},{$push : {chats: {id, name: username, group}}}, {returnOriginal:false}, (err, res) => {
                            let user = res.value;
                            sendback(['Client',user]);
                            // Updating client's chatlist and friends.
                            io.to(user.socketID).emit('startInfo', {chats:user.chats, friends:user.friends});
                        });
                    });
                }else{
                    // Cannot Find User
                    console.log(`no user: ${name}`);
                }
            });
        }
        else{
            //Not in DB
        }
    });

    socket.on('deleteChat', chatID => {
        // Find the Chat and delete it
        dbClient.collection('chats').findOneAndDelete({_id:mID(chatID)}, (err, res) => {
            let deletedChat = res.value;
            // deletedChat.value.members
            sendback(['DeletedChat', deletedChat]);
            // For each deleted member
            deletedChat.members.forEach(({id, name}) => {
                // Setting up query parameters
                const query = {_id:mID(id)};
                const update = {$pull:{chats:{id:deletedChat._id}}};
                // Remove the chat from their list
                dbClient.collection('users').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                    const user = res.value;
                    // Update their chatlist
                    io.to(user.socketID).emit('startInfo', {chats:user.chats, friends:user.friends});
                })
            });
            // console.log(deletedChat.members);
        });
    });
});


// Object.keys(io.sockets.sockets).forEach(d => {
    
// });
// // On Socket IO connection
// io.on('connection', (socket) => {
//     // Checking if user exist and assigning name
//     const cookie = socket.client.request.headers.cookie;
//     const userCookie =  cookie && cookie.split(';').find(cookie => cookie.includes('user='));
//     const username = userCookie && userCookie.split('=')[1];
//     let user = {username, color : '#000000'};
    
//     // If there are users, Add it to the list
//     if (username){
//         // user = usedUsers.find(entry => entry.username == username);
//         const oldUser = usedUsers.find(entry => entry.username == username);
//         user = oldUser ? oldUser : user;
        
//         // Only add to active user if he is not there
//         if (!activeUsers.includes(user)){
//             activeUsers.push(user);
//         }
//         socket.emit('setUser', user);
//     }
//     else{
//         // Generating new name for the user
//         user.username = availUsers[Math.floor(Math.random()*availUsers.length)];
//         usedUsers.push(user);
//         // Removing it from list of possible users
//         availUsers.splice(availUsers.indexOf(user.username),1);
//         activeUsers.push(user);
//         socket.emit('setUser',user);
//     }

//     // Letting people know who connected
//     socket.broadcast.emit('status', `${styleName(user)} has joined the chat`);

//     // Updating userlist
//     io.emit('userList', activeUsers);

//     // Sending the Chat History
//     socket.emit('history', messageLog);

//     // Letting User know who they are
//     socket.emit('status', `Welcome to the chat, you are ${styleName(user)}`);

//     // Example MongoDB call
//     // dbClient.collection("users").find({first_name: "Michael"}).toArray(function(err, result) {
//     //     if(err) throw err;
//     //     console.log(result);
//     // });

//     // Sending Messages
//     socket.on('message', msg => {
//         const message = {date : new Date(), ...msg};
//         messageLog.push(message);
//         io.emit('message', message);
//     });

//     // Changing Nickname
//     socket.on('nickname', name => {
//         if(activeUsers.find( user => user.username === name)){
//             socket.emit('status', 'Name in use. Your name was not changed.')
//         }else if(name === ''){
//             socket.emit('status', 'Name cannot be empty. Your name was not changed.')
//         }else{
//             const updatedUser = {username: name, color: user.color};
//             socket.emit('status', `Your name has been changed to ${styleName(updatedUser)}`);
//             socket.broadcast.emit('status', `${styleName(user)} has changed their name to ${styleName(updatedUser)}`);
//             user.username = name;
//             socket.emit('setUser', user);
//             io.emit('userList', activeUsers);
//         }        
//     });

//     // Changing Color
//     socket.on('color', color => {
//         socket.emit('status', `Your username color has been changed: 
//                                 <span style='color:${user.color}'>${user.color}</span> -> <span style='color:#${color}'>#${color}</span>`);
//         user.color = `#${color}`;
//         socket.emit('setUser', user);
//         io.emit('userList', activeUsers);
//     });
    
//     // On Disconnect
//     socket.on('disconnect', () => {
//         socket.broadcast.emit('status', `${styleName(user)} has left the chat`)
//         activeUsers.splice(activeUsers.indexOf(user),1);
//         io.emit('userList', activeUsers);
//     });
// });

app.on('db ready', function() {
    // Port # will be null/empty if run locally
    let port = process.env.PORT;
    if(port == null || port == "") {
        port = 3000;
    }
    http.listen(port);
    console.log('Listening on Port ' + port);
});