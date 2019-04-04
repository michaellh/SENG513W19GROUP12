var accounts = require('./accounts')
var server = require('./server')
var socketPaths = require('./socketPaths')

module.exports = {
    createRoutes: accounts.createRoutes,
    startListening: server.startListening,
    initialize: socketPaths.initialize
}
