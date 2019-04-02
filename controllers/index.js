var db = require('../models')
var accounts = require('./accounts')
var server = require('./server')

module.exports = {
    createRoutes: accounts.createRoutes,
    startListening: server.startListening
}
