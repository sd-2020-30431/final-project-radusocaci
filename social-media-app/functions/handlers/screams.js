const {db} = require('../util/admin');

exports.getScreams = async (req, resp) => {
    await db
        .collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    ...doc.data()  // unpack all properties
                });
            });
            return resp.json(screams);
        })
        .catch(err => console.error(err));
};

exports.createScream = async (req, resp) => {
    if (req.body.body.trim() === '') {
        return resp.status(400).json({
            body: 'Body must not be empty'
        });
    }

    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    await db
        .collection('screams')
        .add(newScream)
        .then(doc => {
            return resp.json({
                screamId: doc.id,
                ...newScream
            });
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: err.code
            });
        });
};

exports.getScream = async (req, resp) => {
    let screamData = {};

    await db.doc(`/screams/${req.params.screamId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return resp.status(404).json({
                    error: 'Scream not found'
                });
            }
            screamData = doc.data();
            screamData.screamId = doc.id;

            return db.collection('comments')
                .orderBy('createdAt', 'desc')
                .where('screamId', '==', req.params.screamId)
                .get();
        })
        .then(data => {
            screamData.comments = [];
            data.forEach(doc => {
                screamData.comments.push(doc.data());
            });
            return resp.json(screamData);
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: err.code
            });
        });
};

exports.deleteScream = async (req, resp) => {
    const document = db.doc(`/screams/${req.params.screamId}`);

    document.get()
        .then(doc => {
            if (!doc.exists) {
                return resp.status(404).json({
                    error: 'Scream not found'
                });
            }
            if (doc.data().userHandle !== req.user.handle) {
                return resp.status(403).json({
                    error: 'Unauthorized'
                });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            resp.json({
                message: 'Scream deleted successfully'
            });
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: err.code
            });
        });
};

exports.createComment = async (req, resp) => {
    if (req.body.body.trim() === '') {
        return resp.status(400).json({
            comment: 'Must not be empty'
        });
    }

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl // less db calls => less payment to firebase
    };

    await db.doc(`/screams/${req.params.screamId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return resp.status(404).json({
                    error: 'Scream not found'
                });
            }
            return doc.ref.update({
                commentCount: doc.data().commentCount + 1
            });
        })
        .then(() => {
            return db
                .collection('comments')
                .add(newComment);
        })
        .then(() => {
            resp.json(newComment);
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: 'Something went wrong'
            });
        });
};

exports.likeScream = async (req, resp) => {
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId)
        .limit(1);
    const screamDocument = db.doc(`/screams/${req.params.screamId}`);
    let screamData = {};

    await screamDocument.get()
        .then(doc => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get();
            } else {
                return resp.status(404).json({
                    error: 'Scream not found'
                });
            }
        })
        .then(data => {
            if (data.empty) {
                return db
                    .collection('likes')
                    .add({
                        screamId: req.params.screamId,
                        userHandle: req.user.handle
                    })
                    .then(() => {
                        screamData.likeCount++;
                        return screamDocument.update({
                            likeCount: screamData.likeCount
                        });
                    })
                    .then(() => {
                        return resp.json(screamData);
                    });
            } else {
                return resp.status(400).json({
                    error: 'Scream already liked'
                });
            }
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: err.code
            });
        });
};

exports.unlikeScream = async (req, resp) => {
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId)
        .limit(1);
    const screamDocument = db.doc(`/screams/${req.params.screamId}`);
    let screamData = {};

    await screamDocument.get()
        .then(doc => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get();
            } else {
                return resp.status(404).json({
                    error: 'Scream not found'
                });
            }
        })
        .then(data => {
            if (data.empty) {
                return resp.status(400).json({
                    error: 'Scream not liked'
                });
            } else {
                return db
                    .doc(`/likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        screamData.likeCount--;
                        return screamDocument.update({
                            likeCount: screamData.likeCount
                        });
                    })
                    .then(() => {
                        return resp.json(screamData);
                    });
            }
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: err.code
            });
        });
};