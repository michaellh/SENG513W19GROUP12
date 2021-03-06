const mObjectId = require('mongodb').ObjectId;
const socketioJwt = require('socketio-jwt');
const constants = require('./constants');


module.exports = {
    initialize: function (io, dbClient) {

        // get ID to Mongo format
        let mID = id => new mObjectId(id);

        // Object Mutable so do not need to return;
        let frontEndID = obj => {obj.id = obj._id; delete obj._id};

        io.sockets.on('connect', socketioJwt.authorize({
            secret: constants.JSON_KEY,
            timeout: 15000 // 15 seconds to send the authentication message
        })).on('authenticated', socket => {
            const socket_email = socket.decoded_token.email;
            let socket_username;
            let socket_userID;

            dbClient.collection('users').findOneAndUpdate({email:socket_email}, {$set:{socketID: socket.id}}, {returnOriginal: false}, (err, res) => {
                let user = res.value;
                if (user){
                    // Send User Info If found
                    socket_userID = user._id;
                    socket_username = user.name;
                    frontEndID(user);
                    socket.emit('userInfo', user);
                }else{
                    console.log("Error! Invalid email found");
                }
            });
            
            //
            // Notification Section
            //
            function notifyUser(userID, notification){
                // Formating Notification with Date
                notification = {time: new Date(), ...notification};
                dbClient.collection('users').findOneAndUpdate({_id:mID(userID)},{$push : {notifications: notification}}, {returnOriginal:false}, (err, res) => {
                    const user = res.value;
                    io.to(user.socketID).emit('notification', user.notifications);
                });
            }

            socket.on('notifySelf', notification => notifyUser(socket_userID, notification));

            socket.on('removeNotification', time => {
                dbClient.collection('users').findOneAndUpdate({_id:mID(socket_userID)},{$pull : {notifications: {time : new Date(time)}}}, {returnOriginal:false}, (err, res) => {
                    const user = res.value;
                    io.to(user.socketID).emit('notification', user.notifications);
                });
            });

            //
            //Room Section
            //
            socket.on('joinRoom', chatID => {
                socket.join(chatID);

                dbClient.collection('chats').findOneAndUpdate({_id:mID(chatID)},{$addToSet : {activeMembers: socket_userID}}, {returnOriginal:false}, (err, res) => {
                    const chatInfo = res.value;
                    frontEndID(chatInfo);
                    // Removing extra unecessary stuff;
                    delete chatInfo.messages;
                    io.to(chatID).emit('chatInfoUpdate',chatInfo);
                });
            });

            // Seperating out function as used in disconnect
            function leaveRoom(chatID){
                // Leave Chat
                socket.leave(chatID);
                // Updating chatroom info
                dbClient.collection('chats').findOneAndUpdate({_id:mID(chatID)},{$pull : {activeMembers: socket_userID}}, {returnOriginal:false}, (err, res) => {
                    const chatInfo = res.value;
                    // Only proccess if we do have chatInfo. Will ahve none if we try to leave deleted room
                    if(chatInfo){
                        frontEndID(chatInfo);
                        // Removing extra unecessary stuff;
                        delete chatInfo.messages;
                        io.to(chatID).emit('chatInfoUpdate',chatInfo);
                    }
                });
            }

            socket.on('leaveRoom', chatID => {
                leaveRoom(chatID);
            });

            // 
            // Message Section
            // 
            socket.on('message', msg => {
                let message = {date: new Date(), ...msg.msg};
                // Update the unread field of all inactive members of the chat
                dbClient.collection('chats').findOneAndUpdate({_id:mID(msg.chat.id)}, {$push : {messages: message}}, {returnOriginal:false}, (err, res) => {
                    let chat = res.value;
                    let members = chat.members;
                    let activeMembers = chat.activeMembers.map(d => ''+d);
                    let inactiveMembers = members.filter(d => !activeMembers.includes(''+d.id));
                    // Update Unread for inactive members
                    inactiveMembers.forEach(members => {
                        let query = {_id:mID(members.id),'chats.id':mID(msg.chat.id)};
                        let update = {$inc:{'chats.$.unread':1}};
                        dbClient.collection('users').findOneAndUpdate(query, update, {returnOriginal:false}, (err,res) => {
                            let user = res.value;
                            io.to(user.socketID).emit('chatlist',user.chats);
                        });
                    });
                });
                // Send Message
                io.to(msg.chat.id).emit('message', {chatID:msg.chat.id, message});
            });

            // Handle Message Reacts
            socket.on('messageReact', ({chatID, userID, date, reactions, incReaction}) => {
                // Checking Reactions
                reactions = reactions ? reactions : {like:0, dislike:0};
                // Incrementing that reaction
                reactions[incReaction]++;
                // Updating messages that match the date, userid of the chat
                const query = {_id:mID(chatID), messages: {$elemMatch:{date: new Date(date),userID}}};
                const update = {$set:{'messages.$.reactions':reactions}};
                dbClient.collection('chats').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                    // If success, emit history of chat again so the message on client updates
                    res.value && io.to(chatID).emit('loadHistory', {chatID, messages: res.value.messages});
                });
            });

            // Handle Message Deletes
            socket.on('messageDelete', ({chatID, userID, date}) => {
                // Checking whether deleting own message
                if (userID == socket_userID){
                    // Updating messages that match the date, userid of the chat
                    const query = {_id:mID(chatID)};
                    const update = {$pull: {messages: {userID ,date: new Date(date)}}};
                    dbClient.collection('chats').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                        // If success, emit history of chat again so the message on client updates
                        res.value && io.to(chatID).emit('loadHistory', {chatID, messages: res.value.messages});
                    });
                }
                else{
                    // Cannot delete other messages, Should Not reach here
                    // Should not be able to anyway, Delete should only show for own messages
                    console.log('tried deleteing other message');
                }
            });

            // Handle Message Edit
            socket.on('messageEdit', ({chatID, userID, date, message}) => {
                // Checking whether editing own message
                if (userID == socket_userID){
                    // Updating messages that match the date, userid of the chat
                    const query = {_id:mID(chatID), messages: {$elemMatch:{date: new Date(date),userID}}};
                    const update = {$set:{'messages.$.message':message}};
                    dbClient.collection('chats').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                        // If success, emit history of chat again so the message on client updates
                        res.value && io.to(chatID).emit('loadHistory', {chatID, messages: res.value.messages});
                    });
                }
                else{
                    // Cannot Edit other messages, Should Not reach here
                    // Should not be able to anyway, Edit should only show for own messages
                    console.log('tried editing other message');
                }
            });

            // Reseting unread messages to 0 when visiting chat
            socket.on('resetUnread', chatID => {
                dbClient.collection('users').findOneAndUpdate({_id:mID(socket_userID), 'chats.id':mID(chatID)}, {$set : {'chats.$.unread': 0}}, {returnOriginal:false}, (err, res) => {
                    let user = res.value;
                    socket.emit('chatlist', user.chats);
                });
            });


            
            //
            // Chat Area Section
            //

            // Get Chat Info
            socket.on('reqChatInfo', chatID => {
                dbClient.collection('chats').findOne({_id:mID(chatID)}, (err, res) => {
                    let chatInfo = res;
                    // Formating id for front end
                    frontEndID(chatInfo);
                    // Removing extra unecessary stuff;
                    delete chatInfo.messages;
                    socket.emit('chatInfo', chatInfo);
                });
            })

            // Function to rename chat table of user
            function renameUserChatTable(chatID, userID, chatName, chat){
                // Updating User Own Chat table
                const query = {_id:mID(userID), 'chats.id': mID(chatID)};
                const update = {$set:{'chats.$.name':chatName}};
                dbClient.collection('users').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                    let user = res.value;
                    // If success, emit chatlist to user.
                    io.to(user.socketID).emit('chatlist', user.chats);
                    // Tell them to update chat Info
                    dbClient.collection('chats').findOne({_id:mID(chatID)}, (err, res) => {
                        let chatInfo = res;
                        frontEndID(chatInfo);
                        // Removing extra unecessary stuff;
                        delete chatInfo.messages;
                        io.to(user.socketID).emit('chatInfoUpdate',chatInfo);
                    });
                });
            }
            // Rename chat
            socket.on('renameChat', ({chat,name}) => {
                if (chat.group){
                    // Updating Chats table name
                    const query = {_id:mID(chat.id)};
                    const update = {$set:{name}};
                    dbClient.collection('chats').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                        // For each member of the group, also update their individual chat tables
                        res.value.members.forEach(member => {
                            renameUserChatTable(chat.id, member.id, name, res.value);
                            const notification = {
                                title: `${chat.name}: Chat Has Been Renamed`,
                                message: `${chat.name} has been renamed to ${name}`,
                                color: 'yellow',
                            }
                            notifyUser(member.id, notification);
                        });
                    });
                }
                else{
                    // Notify User
                    dbClient.collection('users').findOne({_id:mID(socket_userID)}, function(err, res){
                        let oldName = res.chats.find(({id}) => ''+id == chat.id).name;
                        const notification = {
                            title: `${oldName}: Chat Has Been Renamed`,
                            message: `${oldName} has been renamed to ${name}`,
                            color: 'yellow',
                        }
                        notifyUser(socket_userID, notification);
                    });
                    // Rename Chat
                    renameUserChatTable(chat.id, socket_userID, name);
                }
            });

            // Set Style
            socket.on('setStyle', ({userID, chatID, style}) => {
                // Updating User Own Chat table
                const query = {_id:mID(userID), 'chats.id': mID(chatID)};
                const update = {$set:{'chats.$.style':style}};
                dbClient.collection('users').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => { 
                    let user = res.value;
                    // Updating user chatlist and friends.
                    socket.emit('chatlist', user.chats);
                });
            });


            // Role Change
            socket.on('roleChange', ({chatID, userID, role}) => {
                dbClient.collection('chats').findOneAndUpdate({_id:mID(chatID), 'members.id':mID(userID)}, {$set:{'members.$.role':role}}, {returnOriginal:false}, (err,res) => {
                    let chatInfo = res.value
                    frontEndID(chatInfo);
                    // Removing extra unecessary stuff;
                    delete chatInfo.messages;
                    // Telling everyone in chatroom new chat info
                    io.to(chatID).emit('chatInfoUpdate',chatInfo);
                    
                    const notification = {
                        title: `${chatInfo.name}: Role Updated`,
                        message: `Your Role has been updated to ${role}`,
                        color: role == 'admin' ? 'lightgreen' : 'lightpink',
                    }
                    notifyUser(userID, notification);
                });
            });

            // Chat Request History
            socket.on('reqHistory', chatID => {
                dbClient.collection('chats').findOne({_id:mID(chatID)}, (err, res) => {
                    socket.emit('loadHistory', {chatID, messages: res.messages});
                });
            });

            // Create Group Chat
            socket.on('createGroupChat', name => {
                let groupChatObj = {
                    name,
                    group: true,
                    messages:[],
                    members:[
                        {id : socket_userID, name: socket_username, role:'admin'}
                    ]
                };
                // Adding to Chats Table
                dbClient.collection('chats').insertOne(groupChatObj, (err,res) => {
                    const {_id:id, name, group} = res.ops[0];
                    // Adding Chats name and ID to user table
                    dbClient.collection('users').findOneAndUpdate({_id:mID(socket_userID)},{$push : {chats: {id,name, group}}}, {returnOriginal:false}, (err, res) => {
                        let user = res.value;
                        // Updating user chatlist and friends.
                        socket.emit('chatlist', user.chats);
                        
                        const notification = {
                            title: `${name}: Group Chat Created`,
                            message: `New chat ${name} has been created`,
                            color: 'lightgreen',
                        }
                        notifyUser(user._id, notification);
                    });
                });
            });

            // Create Single Chat
            socket.on('createSingleChat', name => {
                // Find user in DB, res is null if not found
                dbClient.collection('users').findOne({name}, (err, res) => {
                    if(res){
                        // Checking not equal to self
                        if(''+res._id != socket_userID){
                            // Found Users id, and name
                            const {_id:clientID, name:clientName} = res;
                            let chatObj = {
                                name : 'OneOnOne',
                                group : false,
                                messages : [],
                                members : [
                                    // Self
                                    {id : socket_userID, name: socket_username},
                                    // res user
                                    {id : clientID, name: clientName},
                                ]
                            };
                            // Adding to chats table
                            dbClient.collection('chats').insertOne(chatObj, (err,res) => {
                                // Getting group condition, and id back from result
                                const {_id:id, group} = res.ops[0];

                                // Update Self Chat Table
                                dbClient.collection('users').findOneAndUpdate({_id:mID(socket_userID)},{$push : {chats: {id, name: clientName, group}}}, {returnOriginal:false}, (err, res) => {
                                    let user = res.value;
                                    // Updating user chatlist and friends.
                                    socket.emit('chatlist', user.chats);
                                    const notification = {
                                        title: `New Chat Created`,
                                        message: `New chat has been created with ${clientName}`,
                                        color: 'lightgreen',
                                    }
                                    notifyUser(user._id, notification);
                                });

                                // Update Client Chat Table, id is clients, but name is self name
                                dbClient.collection('users').findOneAndUpdate({_id:mID(clientID)},{$push : {chats: {id, name: socket_username, group}}}, {returnOriginal:false}, (err, res) => {
                                    let user = res.value;
                                    // Updating client's chatlist and friends.
                                    io.to(user.socketID).emit('chatlist', user.chats);

                                    const notification = {
                                        title: `New Chat Created`,
                                        message: `${socket_username} has created a new chat with you`,
                                        color: 'lightgreen',
                                    }
                                    notifyUser(user._id, notification);
                                });
                            });
                        }else{
                            // Cannot create chat with self
                            const notification = {
                                title: 'Create Chat Failed',
                                message: `Cannot create chat with self`,
                                color: 'lightpink',
                            }
                            notifyUser(socket_userID, notification);
                        }
                    }else{
                        // Cannot Find User
                        const notification = {
                            title: 'Create Chat Failed',
                            message: `No User: ${name}`,
                            color: 'lightpink',
                        }
                        notifyUser(socket_userID, notification);
                    }
                });
            });

            // Add User to Chat
            socket.on('addToChat', ({chatID, name}) => {
                dbClient.collection('users').findOne({name}, function(err, res){
                    // User Exist
                    if(res){
                        if(''+res._id != socket_userID){
                            const {_id:id, socketID, name} = res;
                            // Update Chat member with new user
                            dbClient.collection('chats').findOneAndUpdate({_id:mID(chatID)},{$push : {members: {id, name, role:'member'}}}, {returnOriginal:false}, (err, res) => {
                                let chat = res.value;
                                // Check chat exist, and is group chat
                                if(chat && chat.group){    
                                    // Update user's chatlist with new chat, Could be moved out to to improve performance
                                    // Setting up query parameters
                                    const query = {_id:mID(id)};
                                    const update = {$push:{chats:{id:chat._id, name: chat.name, group: chat.group}}};
                                    // Add new chat to user Chatlist
                                    dbClient.collection('users').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                                        const user = res.value;
                                        // Update their chatlist
                                        io.to(user.socketID).emit('chatlist', user.chats);
                                        // Send them a notification
                                        const notification = {
                                            title: `${chat.name}: Welcome`,
                                            message: `You have been added to chat ${chat.name}`,
                                            color: 'lightgreen',
                                        }
                                        notifyUser(user._id, notification);
                                    });
    
                                    // Telling Everyone else to update chat Info
                                    let chatInfo = chat;
                                    frontEndID(chatInfo);
                                    // Removing extra unecessary stuff;
                                    delete chatInfo.messages;
                                    // Telling everyone in chatroom new chat info
                                    io.to(chatID).emit('chatInfoUpdate',chatInfo);
                                }
                                // chat does not exist
                                else{
                                    // Chat should exist, and chat should be group to have access to this function
                                    // Should not reach here
                                    console.log('chat not found')
                                }
                            });
                        }else{  
                             // Cannot Add self to Group Chat
                            const notification = {
                                title: 'Cannot Add User',
                                message: `Cannot add yourself to group chat`,
                                color: 'lightpink',
                            }
                            notifyUser(socket_userID, notification);
                        }
                    }
                    // user not found
                    else{
                        // Cannot Find User
                        const notification = {
                            title: 'Cannot Add User',
                            message: `No User: ${name}`,
                            color: 'lightpink',
                        }
                        notifyUser(socket_userID, notification);
                    }
                });
            });

            // Defining function outside as being used more than once
            function deleteChat(chatID, chatName){
                // Find the Chat and delete it
                dbClient.collection('chats').findOneAndDelete({_id:mID(chatID)}, (err, res) => {
                    let deletedChat = res.value;
                    // For each deleted member
                    deletedChat.members.forEach(({id, name}) => {
                        // Setting up query parameters
                        const query = {_id:mID(id)};
                        const update = {$pull:{chats:{id:deletedChat._id}}};
                        // Remove the chat from their list
                        dbClient.collection('users').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                            const user = res.value;
                            // Tell user to reset chat
                            io.to(user.socketID).emit('resetChat', chatID);
                            // Update their chatlist
                            io.to(user.socketID).emit('chatlist', user.chats);
                            
                            // Send Notification
                            const notification = {
                                title: `${chatName}: Deleted`,
                                message: `The chat '${chatName}' has been deleted`,
                                color: 'lightpink',
                            }
                            notifyUser(user._id, notification);
                        })
                    });
                });
            }

            // Leave Chat Function
            function leaveChat(chatID, chatName, id){
                // Updating the user Chat Table
                dbClient.collection('users').findOneAndUpdate({_id:mID(id)},{$pull : {chats: {id : mID(chatID)}}}, {returnOriginal:false}, (err, res) => {
                    let user = res.value;
                    // Tell user to reset chat
                    io.to(user.socketID).emit('resetChat', chatID);
                    // Sending message only to that person that was removed
                    io.to(user.socketID).emit('chatlist', user.chats);

                    // Send Notification
                    const notification = {
                        title: `${chatName}: Removed From Chat`,
                        message: `You have been removed from ${chatName}`,
                        color: 'lightpink',
                    }
                    notifyUser(id, notification);
                });
                // Updating the chat table member list
                dbClient.collection('chats').findOneAndUpdate({_id:mID(chatID)},{$pull : {members: {id:mID(id)}}}, {returnOriginal:false}, (err, res) => {
                    let chatInfo = res.value;
                    frontEndID(chatInfo);
                    // Removing extra unecessary stuff;
                    delete chatInfo.messages;
                    // Telling everyone in chatroom new chat info
                    io.to(chatID).emit('chatInfoUpdate',chatInfo);
                });
            }

            socket.on('removeFromChat', ({chatID, chatName, userID}) => leaveChat(chatID, chatName, userID));

            socket.on('deleteChat', ({chatID, chatName}) => deleteChat(chatID, chatName));

            socket.on('leaveChat', ({chat, chatName}) => {
                chat.members.length > 1 ? leaveChat(chat.id, chatName, socket_userID) : deleteChat(chat.id, chat.name);
            });

            // Add Friend
            socket.on('addFriend', name => {
                dbClient.collection('users').findOne({name}, function(err, res){
                    // User Exist
                    if(res){
                        const members = [
                            {id: socket_userID, name: socket_username},
                            {id: res._id, name: res.name}
                        ];
                        let query1 = {_id:mID(members[0].id)};
                        let update1 = {$push:{friends: members[1].name}};
                        dbClient.collection('users').findOneAndUpdate(query1, update1, {returnOriginal:false}, (err,res) => {
                            let user = res.value;
                            io.to(user.socketID).emit('friendlist',user.friends);
                        });
            
                        let query2 = {_id:mID(members[1].id)};
                        let update2 = {$push:{friends: members[0].name}};
                        dbClient.collection('users').findOneAndUpdate(query2, update2, {returnOriginal:false}, (err,res) => {
                            let user = res.value;
                            io.to(user.socketID).emit('friendlist',user.friends);
                        });
                    }else{
                        // Cannot Find User
                        const notification = {
                            title: 'Create Chat Failed',
                            message: `No User: ${name}`,
                            color: 'lightpink',
                        }
                        notifyUser(socket_userID, notification);
                    }
                });
            });
            
                // Leaving all rooms and from active user list of those rooms
            socket.on('disconnect', () => {
                dbClient.collection('users').findOne({_id:mID(socket_userID)}, (err, res) => {
                    let user = res;
                    user.chats.forEach(({id}) => {
                        leaveRoom(id);
                    });
                });
            });
        });
    }
}
