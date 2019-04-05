var passport = require ('passport');
var localStrategy = require ('passport-local').Strategy;

var bcrypt = require('bcrypt');

module.exports.initPassport = function(dbClient) {
  passport.use(new localStrategy({
      usernameField: 'email'
    },
    function(email, password, done) {
        dbClient.collection('users').findOne({ email: email }, function(err, user) {
            if (err) { return done(err); }
            if (!user)
            {
                return done(null, false, { message: 'The specified account does not exist.' });
            }
            validatePassword(password, user.password, function(err, res) {
                if (!res){
                return done(null, false, { message: 'Incorrect password'});
                }
                // If credentials are correct, return the user object
                return done(null, user);
            });
        });
    }
  ));
}

function validatePassword(enteredPassword, hashedPassword, callback) {
    bcrypt.compare(enteredPassword, hashedPassword, callback);
}
