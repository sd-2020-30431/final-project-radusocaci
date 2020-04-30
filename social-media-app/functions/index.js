const functions = require('firebase-functions');
const app = require('express')();

const {getScreams, createScream, getScream, deleteScream, createComment, likeScream, unlikeScream} = require('./handlers/screams');
const {signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead} = require('./handlers/users');
const FBAuth = require('./util/fbAuth');
const {db} = require('./util/admin');

const cors = require('cors');
app.use(cors());

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
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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
            .catch(err => {
                console.error(err);
            });
    });

exports.deleteNotificationOnUnlike = functions.region('europe-west2').firestore.document('likes/{id}')
    .onDelete(snapshot => {
        return db.doc(`/notifications/${snapshot.id}`).delete()
            .catch(err => {
                console.error(err);
            });
    });

exports.createNotificationOnComment = functions.region('europe-west2').firestore.document('comments/{id}')
    .onCreate(snapshot => {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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
            .catch(err => {
                console.error(err);
            });
    });

exports.onUserImageChange = functions.region('europe-west2').firestore.document('users/{userId}')
    .onUpdate((change) => {
        const batch = db.batch();
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            return db
                .collection('screams')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then(data => {
                    data.forEach(doc => {
                        const screamRef = db.doc(`/screams/${doc.id}`);
                        batch.update(screamRef, {
                            userImage: change.after.data().imageUrl
                        });
                    });
                    return batch.commit();
                })
                .catch(err => {
                    console.error(err);
                });
        } else return true; // no error returned undefined in firebase console
    });

exports.onScreamDelete = functions.region('europe-west2').firestore.document('screams/{screamId}')
    .onDelete((snapshot, context) => {
        const screamId = context.params.screamId;
        const batch = db.batch();
        return db
            .collection('comments')
            .where('screamId', '==', screamId)
            .get()
            .then(data => {
                data.forEach(doc => {
                    const commentRef = db.doc(`/comments/${doc.id}`);
                    batch.delete(commentRef);
                });
                return db
                    .collection('likes')
                    .where('screamId', '==', screamId)
                    .get();
            })
            .then(data => {
                data.forEach(doc => {
                    const likeRef = db.doc(`/likes/${doc.id}`);
                    batch.delete(likeRef);
                });
                return db
                    .collection('notifications')
                    .where('screamId', '==', screamId)
                    .get();
            })
            .then(data => {
                data.forEach(doc => {
                    const notificationRef = db.doc(`/notifications/${doc.id}`);
                    batch.delete(notificationRef);
                });
                return batch.commit();
            })
            .catch(err => {
                console.error(err);
            });
    });