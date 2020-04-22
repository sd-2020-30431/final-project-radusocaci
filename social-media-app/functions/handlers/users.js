const firebase = require('firebase');

const {db} = require('../util/admin');
const config = require('../util/config');
const {validateSignupData, validateLoginData} = require('../util/validators');

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
                    error: err.code
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
            if (err.code === 'auth/wrong-password') {
                return resp.status(403).json({
                    general: 'Wrong credentials, please try again'
                });
            } else {
                return resp.status(500).json({
                    error: err.code
                });
            }
        });
};