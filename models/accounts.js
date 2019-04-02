var client = require('./db');
module.exports = {
    createUser: function (email, fname, lname, password, birthday, userType, callback) {
        var createUser = 'INSERT INTO users_by_email (email, fname, lname, password, birthday, usertype) VALUES(?, ?, ?, ?, ?, ?);';
        client.execute(createUser,[email, fname, lname, password, birthday, userType], { prepare: true }, callback);
    },

    getUserByEmail: function (email, callback){
        var getUser = 'SELECT email, fname, lname, password, birthday FROM users_by_email WHERE email=?;';
        client.execute(getUser, [email], { prepare:true }, callback);
    },

    findAndUpdate: function () {
        dbClient.collection('users').findOneAndUpdate({name:username}, {$set:{socketID: socket.id}}, {returnOriginal: false}, (err, res) => {
            let user = res.value;
            // console.log(res);
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
                const userObject = {
                    name: username,
                    socketID: socket.id,
                    chats: [],
                    friends: [],
                }
                dbClient.collection('users').insertOne(userObject, (err, res) => {
                    userID = res.insertedId;
                    socket.emit('startInfo', {chats:[], friends:[]});
                });
                // socket.emit('startInfo', {chats:['Chat1', 'Chat2'], friends: ['Friend1', 'Friend2', 'Friend3']});
            }
        });
    }
}
