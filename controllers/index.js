var users = require('./users')
var server = require('./server')
var socketPaths = require('./socketPaths')

module.exports = {
    createRoutes: users.createRoutes,
    startListening: server.startListening,
    initialize: socketPaths.initialize
}
