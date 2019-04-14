var jwtExpress = require ('express-jwt');
var passport = require ('passport');
var constants = require('./constants');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = {
    initRoutes: function (app, dbClient) {

        app.post('/register', function (req, res) {
            dbClient.collection('users').findOne({$or: [{name: req.body.name}, {email: req.body.email}]}, function(err, user) {
                if (err) {
                    res.status(404).json(err);
                    return;
                }
                if (user)
                {
                    if (user.name == req.body.name)
                    {
                        res.status(409).json("Error: An account with that entered username already exists.");
                    }
                    else
                    {
                        res.status(409).json("Error: An account with that entered email already exists.");
                    }
                    return;
                }
                if (!user) //Ensure user does not already exist
                {
                    //CPU intensity varies greatly based on this value
                    bcrypt.hash(req.body.password, constants.BCRYPT_SALT_ROUNDS, function(err, hash) {
                        // Enroll new user
                        let userObject = {
                            name: req.body.name,
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
                res.cookie('token', token).status(200).json({
                      auth_token: token,
                      timeout: constants.USER_TIMEOUT
                })
            }
            // If user is not found
            else {
                res.status(401).json(info);
            }
        })(req,res);
    });

    app.post('/account-settings/username', function(req,res) {
        dbClient.collection('users').findOne({$or: [{name: req.body.name}, {email: req.body.email}]}, function(err, user) {
            if (err) {
                res.status(404).json(err);
                return;
            }
            // Determine if the user object exists
            if (!user)
            {
                res.json("Error: No user with that username or e-mail exists!");
                return;
            }
            else {
                // Check the request body for the form input data
                if(req.body.newName !== "") {
                    dbClient.collection('users').findOne({name: req.body.newName}, function(err, userExist) {
                        if (err) {
                            res.status(404).json(err);
                            return;
                        }
                        if(!userExist) {
                            // The username doesn't exist so we can replace it
                            user.name = req.body.newName;
                            dbClient.collection('users').replaceOne({ name: req.body.name }, user);
                            res.status(200).json("ok");
                        }
                        else {
                            res.status(409).json("Error: An account with that username already exists.");
                        }
                    });
                }
                else {
                    res.json("no");
                }
            }
        });
    });

    app.post('/account-settings/email', function(req,res) {
        dbClient.collection('users').findOne({ email: req.body.email }, function(err, user) {
            if (err) {
                res.status(404).json(err);
                return;
            }
            // Determine if the user object exists
            if (!user)
            {
                res.json("Error: No user with that username or e-mail exists!");
                return;
            }
            else {
                // Check the request body for the form input data
                if(req.body.newEmail !== "") {
                    dbClient.collection('users').findOne({email: req.body.newEmail}, function(err, userExist) {
                        if (err) {
                            res.status(404).json(err);
                            return;
                        }
                        if(!userExist) {
                            // The new email doesn't exist in the DB so we can use it
                            user.email = req.body.newEmail;
                            dbClient.collection('users').replaceOne({ email: req.body.email }, user);
                            res.status(200).json("ok");
                        }
                        else {
                            res.status(409).json("Error: An account with that email already exists."); 
                        }
                    });
                }
                else {
                    res.json("no");
                }
            }
        });
    });
    // the req.body.name or email may have been changed by now
    // so the user could've been 'deleted' and these params no longer exist
    app.post('/account-settings/password', function(req,res) {
        dbClient.collection('users').findOne({$or: [{name: req.body.name}, {email: req.body.email}]}, function(err, user) {
            if (err) {
                res.status(404).json(err);
                return;
            }
            // Determine if the user object exists
            if (!user)
            {
                res.json("Error: No user with that username or e-mail exists!");
                return;
            }
            else {
                // Check the request body for the form input data
                if((req.body.newPassword !== "")) {
                    // If the password is changed then the new password will need to be hashed
                    bcrypt.hash(req.body.newPassword, constants.BCRYPT_SALT_ROUNDS, function(err, hash) {
                        user.password = hash;
                        if(req.body.newEmail !== "") {
                            user.email = req.body.newEmail;
                        }
                        dbClient.collection('users').replaceOne({ email: user.email }, user);
                        res.status(200).json("ok")
                    });
                }
                else {
                    res.json("no");
                }
            }
        });
    });

    app.post('/account-settings/token', function(req,res) {
        // Even though the email or username is already taken,
        // the code still reaches here and just checks the param strings
        // and since they aren't empty we make a new token with the existing
        // user and giving us their token
        if((req.body.newName !== "") || (req.body.newEmail !== "")) {
            let userName = req.body.name;
            let userEmail = req.body.email;
            if(req.body.newName !== "") {
                userName = req.body.newName;
            }
            if(req.body.newEmail !== "") {
                userEmail = req.body.newEmail;
            }
            let token = jwt.sign({
                email: userEmail,
                name: userName },
                constants.JSON_KEY,
                {
                    expiresIn: constants.USER_TIMEOUT
                }
            ); //expire in 30 mins 
            res.cookie('token', token).status(200).json({
                auth_token: token,
                timeout: constants.USER_TIMEOUT
            })
        }
        else {
            res.status(200).json("no");
        }
    });

    app.post('/account-settings', function(req, res) {
        dbClient.collection('users').findOne({$or: [{name: req.body.name}, {email: req.body.email}]}, function(err, user) {
            if (err) {
                res.status(404).json(err);
                return;
            }
            // Determine if the user object exists
            if (!user)
            {
                res.json("Error: No user with that username or e-mail exists!");
                return;
            }
            else {
                // Check the request body for the form input data
                if((req.body.newName !== "") && (req.body.newName !== user.name)) {
                    dbClient.collection('users').findOne({name: req.body.newName}, function(err, userExist) {
                        if (err) {
                            res.status(404).json(err);
                            return;
                        }
                        if(!userExist) {
                            // The username doesn't exist so we can replace it
                            user.name = req.body.newName;
                            dbClient.collection('users').replaceOne({ name: req.body.name }, user);
                        }
                        else {
                            res.status(409).json("Error: An account with that username already exists.");
                            console.log(res.statusCode); //409
                            return;
                        }
                    });
                } 
                // 200
                //console.log(res.statusCode);
                if((req.body.newEmail !== "") && (req.body.newEmail !== user.email)) {
                    dbClient.collection('users').findOne({email: req.body.newEmail}, function(err, userExist) {
                        if (err) {
                            res.status(404).json(err);
                            return;
                        }
                        if(!userExist) {
                            // The new email doesn't exist in the DB so we can use it
                            user.email = req.body.newEmail;
                            dbClient.collection('users').replaceOne({ email: req.body.email }, user);                 
                        }
                        else {
                            res.status(409).json("Error: An account with that email already exists."); 
                            return; 
                        }
                    });
                }
                // If either the username and/or email was changed, generate a new token for page reloads
                if((req.body.newPassword !== "") || (req.body.newEmail !== "")) {
                    let userName = user.name;
                    let userEmail = user.email;
                    if(newUsername !== "") {
                        userName = req.body.newName;
                    }
                    if(newEmail !== "") {
                        userEmail = req.body.newEmail;
                    }
                    let token = jwt.sign({
                        email: userEmail,
                        name: userName },
                        constants.JSON_KEY,
                        {
                            expiresIn: constants.USER_TIMEOUT
                        }
                    ); //expire in 30 mins
                }
                // If the password is changed then the new password will need to be hashed
                if(req.body.newPassword !== "") {
                    bcrypt.hash(req.body.newPassword, constants.BCRYPT_SALT_ROUNDS, function(err, hash) {
                        user.password = hash;
                        if(req.body.newEmail !== "") {
                            user.email = req.body.newEmail;
                        }
                        dbClient.collection('users').replaceOne({ email: user.email }, user);
                    });
                }
                // if(res.statusMessage) {

                // }
                // If I get an error already and send back an err res,
                // I can't then come here and modify it again,
                // but I need this if I want to refresh the page
                res.status(200).json("ok");
                //console.log(res.statusMessage);
            }
        });
    });

    app.post('/forgot', function(req, res, next) {
        dbClient.collection('users').findOne({ email: req.body.email }, function(err, user) {
            if (err) {
                res.status(404).json(err);
                return;
            }
            if (!user) //Ensure user does not already exist
            {
                res.json("Error: No account with that e-mail exists!");
                return;
            }
            else
            {
                crypto.randomBytes(20, function(err, buf) {
                    if (err) {
                        res.status(404).json(err);
                        return;
                    }
                    else {
                        var token = buf.toString('hex');
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000;
                        dbClient.collection('users').replaceOne({ email: user.email }, user, sendPasswordReset(req, res, user));
                    }
                });
            }
        });
    });

    app.post('/reset/:token', function(req, res) {
        dbClient.collection('users').findOne({ resetPasswordToken: req.params.token }, function(err, user) {
            if (err) {
                res.status(404).json(err);
                return;
            }
            if (!user) //Ensure user does not already exist
            {
                res.json("Error: Incorrect email and reset token combination!");
                return;
            }
            else
            {
                //CPU intensity varies greatly based on this value
                bcrypt.hash(req.body.password, constants.BCRYPT_SALT_ROUNDS, function(err, hash) {
                    user.password = hash;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    dbClient.collection('users').replaceOne({ email: user.email }, user, notifyPasswordChange(req, res, user));
                });
            }
        });
    });

    // app.get('/protected', jwtExpress({secret: constants.JSON_KEY}), function(req, res){
    //         if (!req.user.admin) return res.sendStatus(401);
    //         res.sendStatus(200);
    // });
    //
    // app.use(function (err, req, res, next) {
    //     if (err.name === 'UnauthorizedError') {
    //         res.status(401).send('Invalid Token Sent');
    //     }
    // });
}
}

function sendPasswordReset(req, res, user) {
    let smtpTransport = nodemailer.createTransport(sgTransport({
        auth: {
            api_key: constants.SEND_GRID_API_KEY
        }
    }));
    let mailOptions = {
        to: user.email,
        from: 'passwordreset@NetChatter.com',
        subject: 'Net Chatter Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset-password/' + user.resetPasswordToken + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
    smtpTransport.sendMail(mailOptions, function(err) {
        if (err) {
            console.log("Error! Unable to send out reset email: " + err)
        }
        else {
            res.status(200).json("ok");
        }
    });
}

function notifyPasswordChange(req, res, user) {
    let smtpTransport = nodemailer.createTransport(sgTransport({
        auth: {
            api_key: constants.SEND_GRID_API_KEY
        }
    }));
    let mailOptions = {
        to: user.email,
        from: 'passwordreset@NetChatter.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
    };
    smtpTransport.sendMail(mailOptions, function(err) {
        if (err) {
            console.log("Error! Unable to send out password change email: " + err)
        }
        else {
            res.status(200).json("ok");
        }
    });
}
