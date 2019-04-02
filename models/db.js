const mongoClient = require('mongodb').MongoClient;
const mObjectId = require('mongodb').ObjectId;
var dbClient = connect();

function connect() {
    // Connect to the MongoDB Atlas database
    const uri = "mongodb+srv://Michael:Test@demo-84yw9.mongodb.net/test?retryWrites=true";
    mongoClient.connect(uri, (err, clientConnector) => {
        if (err) throw err;

        dbClient = clientConnector.db("SENG513");
        console.log("Connected to the database!");
        return dbClient;
    });
}

module.exports = dbClient;
