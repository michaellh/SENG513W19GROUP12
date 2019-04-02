var client = require('./db');
var accounts = require('./accounts');

module.exports = {
    createUser: accounts.createUser,
    getUserByEmail: accounts.getUserByEmail,
    findAndUpdate: accounts.findAndUpdate
}
