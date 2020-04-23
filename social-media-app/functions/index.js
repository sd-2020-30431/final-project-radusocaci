const functions = require('firebase-functions');
const app = require('express')();

const {getScreams, createScream, getScream, deleteScream, createComment, likeScream, unlikeScream} = require('./handlers/screams');
const {signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead} = require('./handlers/users');
const FBAuth = require('./util/fbAuth');
const {db} = require('./util/admin');

exports.api = functions.region('europe-west2').https.onRequest(app);


// Scream routes
app.get('/screams', getScreams);
app.get('/screams/:screamId', getScream);
app.post('/screams', FBAuth, createScream);
app.delete('/screams/:screamId', FBAuth, deleteScream);

app.get('/screams/:screamId/like', FBAuth, likeScream);
app.get('/screams/:screamId/unlike', FBAuth, unlikeScream);
app.post('/screams/:screamId/comment', FBAuth, createComment);

// Authentication routes (users)
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

// Notifications using firestore triggers, to avoid more db calls in like/createComment (only works on deploy)
exports.createNotificationOnLike = functions.region('europe-west2').firestore.document('likes/{id}')
    .onCreate(snapshot => {
        db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .then(() => {
            })
            .catch(err => {
                console.error(err);
            });
    });

exports.deleteNotificationOnUnlike = functions.region('europe-west2').firestore.document('likes/{id}')
    .onDelete(snapshot => {
        db.doc(`/notifications/${snapshot.id}`).delete()
            .then(() => {
            })
            .catch(err => {
                console.error(err);
            });
    });

exports.createNotificationOnComment = functions.region('europe-west2').firestore.document('comments/{id}')
    .onCreate(snapshot => {
        db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .then(() => {
            })
            .catch(err => {
                console.error(err);
            });
    });