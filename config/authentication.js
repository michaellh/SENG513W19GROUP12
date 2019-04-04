var passport = require ('passport');
var localStrategy = require ('passport-local').Strategy;

var bcrypt = require('bcrypt');

module.exports.initPassport = function() {
  passport.use(new localStrategy({
      usernameField: 'email'
    },
    function(email, password, done) {
      accounts.getUserByEmail (email, function(err, user) {
          if (err) {
              return done(err);
          }
          if (user.rowLength == 0){
              return done(null, false, {
                message: 'User not found'
              });
          }
          validatePassword(password, user.first().password, function(err, res) {
              if (!res){
              return done(null, false, { message: 'Password is wrong'});
              }
              // If credentials are correct, return the user object
              return done(null, user.first());
          });
      });
    }
  ));
}

function validatePassword(enteredPassword, hashedPassword, callback) {
    bcrypt.compare(enteredPassword, hashedPassword, callback);
}
