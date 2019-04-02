var accounts = require('../models/accounts');
var jwtExpress = require ('express-jwt');
var passport = require ('passport');
var constants = require('./constants');

var bcrypt = require('bcrypt');

module.exports = {
    createRoutes: function (app) {
        app.post('/createUser', function (req, res) {
            accounts.getUserByEmail (req.body.email, function(err, user) {
                if (err) {
                    res.status(404).json(err);
                    return;
                }
                if (user.rowLength == 1){
                    res.json("Error: Please choose a different email address.");
                    return;
                }
                var saltRounds = 9; //CPU intensity varies greatly based on this value
                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    accounts.createUser(req.body.email, req.body.fname, req.body.lname, hash, req.body.birthday, constants.ADMIN_USER_TYPE, function(err) {
                        if (err) {
                            console.log(err);
                            res.json(err);
                        } else {
                            var token = jwt.sign({
                                                    email: req.body.email,
                                                    fname: req.body.fname,
                                                    lname: req.body.lname },
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
                    var token = jwt.sign({
                                            email: user.email,
                                            fname: user.fname,
                                            lname: user.lname },
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
