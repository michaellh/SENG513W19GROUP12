const jwt = require('jsonwebtoken');
var constants = require('./constants');

module.exports = {
  withAuth: function(req, res, next) {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;
    if (!token) {
      res.status(401).send('Unauthorized: No token provided');
    } else {
      jwt.verify(token, constants.JSON_KEY, function(err, decoded) {
        if (err) {
          res.status(401).send('Unauthorized: Invalid token');
        } else {
          req.email = decoded.email;
          next();
        }
      });
    }
  }
}
