const functions = require('firebase-functions');
const app = require('express')();

const {getScreams, createScream} = require('./handlers/screams');
const {signup, login} = require('./handlers/users');
const FBAuth = require('./util/fbAuth');

exports.api = functions.region('europe-west2').https.onRequest(app);


// Scream routes
app.get('/screams', FBAuth, getScreams);
app.post('/screams', FBAuth, createScream);

// Authentication routes (users)
app.post('/signup', signup);
app.post('/login', login);

