# Simple Chat App

Run index.js with node and server should be hosted at http://localhost:3000

To test multiple client, use multiple browsers and their incognito/private mode

Application has been tested in Edge, Chrome, and Firefox


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
