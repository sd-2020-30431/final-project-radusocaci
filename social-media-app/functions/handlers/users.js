const firebase = require('firebase');

const {db, admin} = require('../util/admin');
const config = require('../util/config');
const {validateSignupData, validateLoginData, validateUserDetails} = require('../util/validators');

firebase.initializeApp(config);

exports.signup = async (req, resp) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const {valid, error} = validateSignupData(newUser);

    if (!valid) {
        return resp.status(400).json({...error});
    }

    const noImg = 'no-img.png';

    let accessToken, userId;
    await db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return resp.status(400).json({
                    handle: 'this handle is already taken'
                });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(token => {
            accessToken = token;
            const usersEntry = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId // same name
            };
            return db.doc(`/users/${newUser.handle}`).set(usersEntry);
        })
        .then(() => {
            return resp.status(201).json({
                token: accessToken
            });
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return resp.status(400).json({
                    email: 'Email is already in use'
                });
            } else {
                return resp.status(500).json({
                    general: 'Something went wrong, please try again'
                });
            }
        });
};

exports.login = async (req, resp) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const {valid, error} = validateLoginData(user);

    if (!valid) {
        return resp.status(400).json({...error});
    }

    await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return resp.json({token});
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: err.code
            });

        });
};

exports.uploadImage = async (req, resp) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({headers: req.headers});
    let imageFileName, imageToUpload = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return resp.status(400).json({
                error: 'Wrong file type submitted'
            });
        }

        let extensions = filename.split('.');
        const imageExtension = extensions[extensions.length - 1];
        imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToUpload = {filePath, mimetype};

        file.pipe(fs.createWriteStream(filePath));
    });

    busboy.on('finish', async () => {
        await admin.storage().bucket().upload(imageToUpload.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToUpload.mimetype
                }
            }
        })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                return db.doc(`/users/${req.user.handle}`).update({imageUrl});
            })
            .then(() => {
                return resp.json({
                    message: 'Image uploaded successfully'
                });
            })
            .catch(err => {
                console.error(err);
                return resp.status(500).json({
                    error: err.code
                });
            });
    });

    busboy.end(req.rawBody);
};

exports.addUserDetails = async (req, resp) => {
    let userDetails = validateUserDetails(req.body);

    await db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return resp.json({
                message: 'Details added successfully'
            });
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: err.code
            });
        });
};

exports.getAuthenticatedUser = async (req, resp) => {
    let userData = {};

    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return db
                    .collection('likes')
                    .where('userHandle', '==', req.user.handle)
                    .get();
            }
        })
        .then(data => {
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data());
            });
            return db
                .collection('notifications')
                .where('recipient', '==', req.user.handle)
                .orderBy('createdAt', 'desc')
                .limit(10)
                .get();
        })
        .then(data => {
            userData.notifications = [];
            data.forEach(doc => {
                userData.notifications.push({
                    ...doc.data(),
                    notificationId: doc.id
                });
            });
            return resp.json(userData);
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: err.code
            });
        });
};

exports.getUserDetails = async (req, resp) => {
    let userData = {};

    await db.doc(`/users/${req.params.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.user = doc.data();
                return db
                    .collection('screams')
                    .where('userHandle', '==', req.params.handle)
                    .orderBy('createdAt', 'desc')
                    .get();
            } else {
                return resp.status(404).json({
                    error: 'User not found'
                });
            }
        })
        .then(data => {
            userData.screams = [];
            data.forEach(doc => {
                userData.screams.push({
                    ...doc.data(),
                    screamId: doc.id,
                });
            });
            return resp.json(userData);
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: err.code
            });
        });
};

exports.markNotificationsRead = async (req, resp) => {
    let batch = db.batch();
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, {
            read: true
        });
    });
    await batch.commit()
        .then(() => {
            return resp.json({
                message: 'Notifications marked as read'
            });
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: err.code
            });
        });
};