var users = require('./users')
var server = require('./server')
var socketPaths = require('./socketPaths')

module.exports = {
    initRoutes: users.initRoutes,
    startListening: server.startListening,
    initialize: socketPaths.initialize
}
