const mObjectId = require('mongodb').ObjectId;

module.exports = {
    initialize: function (io, dbClient) {

        // get ID to Mongo format
        let mID = id => new mObjectId(id);

        // Object Mutable so do not need to return;
        let frontEndID = obj => {obj.id = obj._id; delete obj._id};

        io.on('connect', socket => {
            // Checking if user exist and assigning name
            const cookie = socket.client.request.headers.cookie;
            const userCookie =  cookie && cookie.split(';').find(cookie => cookie.includes('user='));
            // username being used below as the username from the database
            const socket_username = userCookie && userCookie.split('=')[1];
            let socket_userID;
            // console.log(socket_username);

            dbClient.collection('users').findOneAndUpdate({name:socket_username}, {$set:{socketID: socket.id}}, {returnOriginal: false}, (err, res) => {
                let user = res.value;
                // console.log(res);
                // console.log(user);
                if (user){
                    socket_userID = user._id;
                    console.log(socket_userID);
                    frontEndID(user);
                    // console.log(user.socketID, socket.id);
                    socket.emit('userInfo', user);
                    // socket.emit('chatlist', user.chats);
                    // socket.emit('friendlist', user.friends);
                }else{
                    // Enroll new user
                    const userObject = {
                        name: socket_username,
                        socketID: socket.id,
                        chats: [],
                        friends: [],
                        notifications: [],
                    }
                    dbClient.collection('users').insertOne(userObject, (err, res) => {
                        let user = res.ops[0];
                        socket_userID = user._id;
                        frontEndID(user);
                        socket.emit('userInfo', user);
                    });
                    // socket.emit('chatlist', {chats:['Chat1', 'Chat2'], friends: ['Friend1', 'Friend2', 'Friend3']});
                }
            });

            function notifyUser(userID, notification){
                notification = {time: new Date(), ...notification};
                // dbClient.collection('users').findOneAndUpdate({_id:mID(userID)}, (err, res) => {
                //     const user = res;
                //     io.to(user.socketID).emit('notification', notification);
                // });
                dbClient.collection('users').findOneAndUpdate({_id:mID(userID)},{$push : {notifications: notification}}, {returnOriginal:false}, (err, res) => {
                    const user = res.value;
                    // console.log('Send Message to ', res);
                    // console.log(socket.id);
                    io.to(user.socketID).emit('notification', user.notifications);
                });
            }

            socket.on('removeNotification', time => {
                dbClient.collection('users').findOneAndUpdate({_id:mID(socket_userID)},{$pull : {notifications: {time : new Date(time)}}}, {returnOriginal:false}, (err, res) => {
                    const user = res.value;
                    // console.log('Send Message to ', res);
                    // console.log(socket.id);
                    io.to(user.socketID).emit('notification', user.notifications);
                });
            });

            let sendback = (message) => {
                socket.emit('debug', message);
            }
            // console.log('Connected');
            // To send message back and forth
            socket.on('debug', msg => {
               eval(msg);
            });

            socket.on('joinRoom', chatID => {
                socket.join(chatID);
                
                dbClient.collection('chats').findOneAndUpdate({_id:mID(chatID)},{$addToSet : {activeMembers: socket_userID}}, {returnOriginal:false}, (err, res) => {
                    const chatInfo = res.value;
                    frontEndID(chatInfo);
                    // Removing extra unecessary stuff;
                    delete chatInfo.messages;
                    io.to(chatID).emit('chatInfoUpdate',chatInfo);
                    // console.log(chatInfo);
                });
            });

            // Seperating out function as used in disconnect
            function leaveRoom(chatID){
                // Leave Chat
                socket.leave(chatID);
                // Updating chatroom info
                dbClient.collection('chats').findOneAndUpdate({_id:mID(chatID)},{$pull : {activeMembers: socket_userID}}, {returnOriginal:false}, (err, res) => {
                    const chatInfo = res.value;
                    frontEndID(chatInfo);
                    // Removing extra unecessary stuff;
                    delete chatInfo.messages;
                    io.to(chatID).emit('chatInfoUpdate',chatInfo);
                    // console.log(chatInfo);
                });
            }

            socket.on('leaveRoom', chatID => {
                leaveRoom(chatID);                
            });

            socket.on('resetUnread', chatID => {
                dbClient.collection('users').findOneAndUpdate({_id:mID(socket_userID), 'chats.id':mID(chatID)}, {$set : {'chats.$.unread': 0}}, {returnOriginal:false}, (err, res) => {
                    let user = res.value;
                    // console.log("resetUnread", res.value);
                    socket.emit('chatlist', user.chats);
                });
            });

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

            socket.on('message', msg => {
                let message = {date: new Date(), ...msg.msg};
                // dbClient.collection('chats').update({_id:mID(msg.chat.id)}, {$push : {messages: message}});
                // Update the unread field of all inactive members of the chat
                dbClient.collection('chats').findOneAndUpdate({_id:mID(msg.chat.id)}, {$push : {messages: message}}, {returnOriginal:false}, (err, res) => {
                    let chat = res.value;
                    let members = chat.members;
                    let activeMembers = chat.activeMembers.map(d => ''+d);
                    // console.log(members, activeMembers);
                    let inactiveMembers = members.filter(d => !activeMembers.includes(''+d.id));

                    // console.log(inactiveMembers);
                    inactiveMembers.forEach(members => {
                        let query = {_id:mID(members.id),'chats.id':mID(msg.chat.id)};
                        let update = {$inc:{'chats.$.unread':1}};
                        dbClient.collection('users').findOneAndUpdate(query, update, {returnOriginal:false}, (err,res) => {
                            let user = res.value;
                            // console.log(user, err);
                            io.to(user.socketID).emit('chatlist',user.chats);
                        });
                    });
                });
                // Send Message
                io.to(msg.chat.id).emit('message', message);
            });

            // Handle Message Reacts
            socket.on('messageReact', ({chatID, userID, date, reactions, incReaction}) => {
                // Checking Reactions
                reactions = reactions ? reactions : {like:0, dislike:0};
                // Incrementing that reaction
                reactions[incReaction]++;
                console.log('messageReacted');
                // Updating messages that match the date, userid of the chat
                const query = {_id:mID(chatID), messages: {$elemMatch:{date: new Date(date),userID}}};
                const update = {$set:{'messages.$.reactions':reactions}};
                dbClient.collection('chats').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                    // If success, emit history of chat again so the message on client updates
                    res.value && io.to(chatID).emit('loadHistory', res.value.messages);
                });
            });

            // Handle Message Deletes
            socket.on('messageDelete', ({chatID, userID, date}) => {
                // Checking whether deleting own message
                if (userID == socket_userID){
                    // Updating messages that match the date, userid of the chat
                    const query = {_id:mID(chatID)};
                    // const update = {$pull: {messages: {$elemMatch:{date: new Date(date),userID}}}};
                    const update = {$pull: {messages: {userID ,date: new Date(date)}}};
                    dbClient.collection('chats').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                        // If success, emit history of chat again so the message on client updates
                        res.value && io.to(chatID).emit('loadHistory', res.value.messages);
                    });
                }
                else{
                    // Cannot delete other messages
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
                        res.value && io.to(chatID).emit('loadHistory', res.value.messages);
                    });
                }
                else{
                    // Cannot Edit other messages
                    // Should not be able to anyway, Edit should only show for own messages
                    console.log('tried Editing other message');
                }
            });

            //
            // chat renames
            //
            // Function to rename chat table of user
            function renameUserChatTable(chatID, userID, chatName, chat){
                // Updating User Own Chat table
                const query = {_id:mID(userID), 'chats.id': mID(chatID)};
                const update = {$set:{'chats.$.name':chatName}};
                dbClient.collection('users').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                    // console.log(res.value);
                    let user = res.value;
                    // If success, emit chatlist to user.
                    io.to(user.socketID).emit('chatlist', user.chats);
                    // Tell them to update chat Info
                    dbClient.collection('chats').findOne({_id:mID(chatID)}, (err, res) => {
                        // console.log(res);
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
                console.log(chat, name);
                if (chat.group){
                    // Updating Chats table name
                    const query = {_id:mID(chat.id)};
                    const update = {$set:{name}};
                    dbClient.collection('chats').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                        // For each member of the group, also update their individual chat tables
                        res.value.members.forEach(member => {
                            // console.log(member);
                            renameUserChatTable(chat.id, member.id, name, res.value);
                        });
                    });
                }
                else{
                    renameUserChatTable(chat.id, socket_userID, name);
                }
            })

            // Role Change
            socket.on('roleChange', ({chatID, userID, role}) => {
                dbClient.collection('chats').findOneAndUpdate({_id:mID(chatID), 'members.id':mID(userID)}, {$set:{'members.$.role':role}}, {returnOriginal:false}, (err,res) => {
                    // console.log(res);
                    let chatInfo = res.value
                    // console.log(chatInfo);
                    frontEndID(chatInfo);
                    // Removing extra unecessary stuff;
                    delete chatInfo.messages;
                    // Telling everyone in chatroom new chat info
                    io.to(chatID).emit('chatInfoUpdate',chatInfo);
                });
            });

            socket.on('reqHistory', id => {
                dbClient.collection('chats').findOne({_id:mID(id)}, (err, res) => {
                    // console.log(res);
                    socket.emit('loadHistory', res.messages);
                });
            });

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
                    sendback(['chatID',id]);
                    // Adding Chats name and ID to user table
                    dbClient.collection('users').findOneAndUpdate({_id:mID(socket_userID)},{$push : {chats: {id,name, group}}}, {returnOriginal:false}, (err, res) => {
                        // console.log(res, err);
                        let user = res.value;
                        sendback(user);
                        // Updating user chatlist and friends.
                        socket.emit('chatlist', user.chats);
                    });
                    // dbClient.collection('users').findOne({_id:mID(socket_userID)}, (err, res) => {
                    //     console.log(res, err);
                    // });
                });
            });

            // Create Single Chat
            socket.on('createSingleChat', name => {
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
                                sendback(['Self',user]);
                                // Updating user chatlist and friends.
                                socket.emit('chatlist', user.chats);
                            });

                                // Update Client Chat Table, id is clients, but name is self name
                                dbClient.collection('users').findOneAndUpdate({_id:mID(clientID)},{$push : {chats: {id, name: socket_username, group}}}, {returnOriginal:false}, (err, res) => {
                                let user = res.value;
                                sendback(['Client',user]);
                                // Updating client's chatlist and friends.
                                io.to(user.socketID).emit('chatlist', user.chats);
                            });
                        });
                    }else{
                        // Cannot Find User
                        const notification = {
                            title: 'Create Chat Failed',
                            message: `No User: ${name}`,
                            color: 'lightpink',
                            // delay: 5000,
                            // autohide: true,
                        }
                        notifyUser(socket_userID, notification);
                        console.log(`no user: ${name}`);
                    }
                });
            });

            // Add User to Chat
            socket.on('addToChat', ({chatID, name}) => {
                dbClient.collection('users').findOne({name}, function(err, res){
                    // User Exist
                    if(res){
                        sendback([res,err]);
                        const {_id:id, socketID, name} = res;
                        // Update Chat member with new user
                        dbClient.collection('chats').findOneAndUpdate({_id:mID(chatID)},{$push : {members: {id, name, role:'member'}}}, {returnOriginal:false}, (err, res) => {
                            let chat = res.value;
                            // Check chat exist, and is group chat
                            if(chat && chat.group){
                                // console.log(chat);
                                // sendback(chat);

                                // Update user's chatlist with new chat, Could be moved out to to improve performance
                                // Setting up query parameters
                                const query = {_id:mID(id)};
                                const update = {$push:{chats:{id:chat._id, name: chat.name, group: chat.group}}};
                                // Add new chat to user Chatlist
                                dbClient.collection('users').findOneAndUpdate(query, update, {returnOriginal:false}, (err, res) => {
                                    const user = res.value;
                                    // Update their chatlist
                                    io.to(user.socketID).emit('chatlist', user.chats);
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
                                console.log('chat not found')
                            }
                        });
                    }
                    // user not found
                    else{
                        // Cannot Find User
                        const notification = {
                            title: 'Cannot Add User',
                            message: `No User: ${name}`,
                            color: 'lightpink',
                            // delay: 5000,
                            // autohide: true,
                        }
                        notifyUser(socket_userID, notification);
                        console.log('no user');
                    }
                });
            });

            // Defining function outside as being used more than once
            function deleteChat(chatID){
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
                            // Tell user to reset chat
                            io.to(user.socketID).emit('resetChat', chatID);
                            // Update their chatlist
                            io.to(user.socketID).emit('chatlist', user.chats);
                        })
                    });
                    // console.log(deletedChat.members);
                });
            }

            // socket.on('deleteChat', chat => {
            //     if(chat.group){
            //         console.log('Group Chat Delete attempted');
            //         dbClient.collection('chats').findOne({_id:mID(chat.id)}, (err, res) => {
            //             let currentChat = res;
            //             // console.log(currentChat);
            //             // sendback(currentChat.members);
            //             // Typecasting to string to compare and find
            //             const {name, role} = currentChat.members.find(({id}) => `${id}` == `${socket_userID}`);

            //             if(role == 'admin'){
            //                 deleteChat(currentChat._id);
            //             }else{
            //                 // Not admin, leave chat?
            //                 console.log('notAdmin');
            //             }
            //         });
            //     }else{
            //         // Single chat delete
            //         deleteChat(chat.id);
            //     }
            // });

            // Leave Chat Function
            function leaveChat(chatID,id){
                // Updating the user Chat Table
                dbClient.collection('users').findOneAndUpdate({_id:mID(id)},{$pull : {chats: {id : mID(chatID)}}}, {returnOriginal:false}, (err, res) => {
                    // console.log('Removed from User', res.value.chats);
                    let user = res.value;
                    // Let the chat know that this user has left
                    // Optional Server Left Message
                    // const message = {
                    //     date: new Date(),
                    //     userID: 1, //Just arbirary assignment of userID 1 for server
                    //     userName: 'Server',
                    //     message: `${user.name} has left the chat`,
                    // }
                    // io.to(chatID).emit('message', message);
                    // Tell user to reset chat
                    io.to(user.socketID).emit('resetChat', chatID);
                    // Sending message only to that person that was removed
                    io.to(user.socketID).emit('chatlist', user.chats);
                });
                // Updating the chat table member list
                dbClient.collection('chats').findOneAndUpdate({_id:mID(chatID)},{$pull : {members: {id}}}, {returnOriginal:false}, (err, res) => {
                    // console.log(res);
                    let chatInfo = res.value;
                    frontEndID(chatInfo);
                    // Removing extra unecessary stuff;
                    delete chatInfo.messages;
                    // Telling everyone in chatroom new chat info
                    io.to(chatID).emit('chatInfoUpdate',chatInfo);
                });
            }

            socket.on('removeFromChat', ({chatID, id}) => leaveChat(chatID, id));

            socket.on('leaveChat', chat => {
                if(chat.group){
                    // Typecasting to string to compare and find
                    // const {name, role} = chat.members.find(({id}) => `${id}` == `${socket_userID}`);
                    const {role} = chat.members.find(({id}) => id == socket_userID);

                    // console.log(name, role);

                    if(role == 'admin'){
                        // Is Admin, Delete Chat
                        deleteChat(chat.id)
                    }else{
                        // Not admin, leave chat?
                        leaveChat(chat.id, socket_userID);
                    }
                }else{
                    // Single chat
                    // If only person left, delete the chat.
                    console.log('left single chat');
                    chat.members.length > 1 ? leaveChat(chat.id, socket_userID) : deleteChat(chat.id);
                }
            });

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
