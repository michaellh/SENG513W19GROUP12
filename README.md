# Simple Chat App

App Hosted at:
https://radiant-waters-80256.herokuapp.com/

Master Branch set to auto-deploy.

Application has been tested in Edge, Chrome, and Firefox

To Run locally:

1. Clone Repo

2. Run "npm install" in public folder

To Launch App:

Run "npm start" in public folder

To Build App:

1. Run "npm build" in public folder

2. Run "node index.js" in root folder

# Project Structure

/controllers
This folder contains all the express routes separated by the various modules of this application

/config
Initializes the passport library and is responsible for other configurations.

# Authentication

Authentication for logins are done using a password hashing library known as bcrypt. After a
user has been authenticated using bcrypt, they are assigned a JSON web token using the library
jsonwebtoken. The library creates a signature using the user's stored database information such
as email, first name, and last name.

This JSON web token stores a expiry time so that the server can check this field everytime the
client sends the token with each request. The JSON web tokens are sent with the HTTP request to
access stored sensor data and each WebSocket connection request. These JSON web tokens are
checked and verified for each reques
