var jwtExpress = require ('express-jwt');
var passport = require ('passport');
var constants = require('./constants');
var jwt = require('jsonwebtoken');

var bcrypt = require('bcrypt');

module.exports = {
    initRoutes: function (app, dbClient) {
        app.post('/createUser', function (req, res) {
            dbClient.collection('users').findOne({ email: req.body.email }, function(err, user) {
                if (err) {
                    res.status(404).json(err);
                    return;
                }
                if (user)
                {
                    res.json("Error: Please choose a different email address.");
                    return;
                }
                if (!user) //Ensure user does not already exist
                {
                    let saltRounds = constants.BCRYPT_SALT_ROUNDS; //CPU intensity varies greatly based on this value
                    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                        // Enroll new user
                        const userObject = {
                            name: req.body.socket_username,
                            socketID: req.body.socket_id,
                            email: req.body.email,
                            password: hash,
                            fname: req.body.fname,
                            lname: req.body.lname,
                            chats: [],
                            friends: [],
                        }
                        dbClient.collection('users').insertOne(userObject, (err, result) => {
                            // let user = res.ops[0];
                            // socket_userID = user._id;
                            // frontEndID(user);
                            // socket.emit('userInfo', user);
                            if (err) {
                                console.log(err);
                                res.json(err);
                            } else {
                                let token = jwt.sign({
                                                        email: req.body.email,
                                                        name: req.body.socket_username },
                                                       constants.JSON_KEY,
                                                        {
                                                            expiresIn: constants.USER_TIMEOUT
                                                        }
                                                    ); //expire in 30 mins
                                res.status(200).json({
                                                        auth_token: token,
                                                        timeout: constants.USER_TIMEOUT
                                                    });
                            }
                        });
                    });
                }
            });
        });

        app.post('/sign-in', function(req, res) {
            passport.authenticate('local', function (err, user, info){
                if (err){
                    res.status(404).json(err);
                    return;
                }
                // If a user is found
                if(user){
                    res.status(200);
                    let token = jwt.sign({
                                            email: user.email,
                                            name: user.socket_username
                                         },
                                           constants.JSON_KEY,
                                            {
                                                expiresIn: constants.USER_TIMEOUT
                                            }
                                        ); //expire in 30 mins
                    res.status(200).json({
                                            auth_token: token,
                                            timeout: constants.USER_TIMEOUT
                                        });
                }
                // If user is not found
                else {
                    res.status(401).json(info);
                }
            })(req,res);
        });

        app.get('/protected', jwtExpress({secret: constants.JSON_KEY}), function(req, res){
                if (!req.user.admin) return res.sendStatus(401);
                res.sendStatus(200);
        });

        app.use(function (err, req, res, next) {
            if (err.name === 'UnauthorizedError') {
                res.status(401).send('Invalid Token Sent');
            }
        });
    }
}
