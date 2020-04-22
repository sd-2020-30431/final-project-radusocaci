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
                    id: doc.id,
                    ...doc.data()  // unpack all properties
                });
            })
            return resp.json(screams);
        })
        .catch(err => console.error(err));
};

exports.createScream = async (req, resp) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    };

    await db
        .collection('screams')
        .add(newScream)
        .then(doc => {
            return resp.json({
                message: `document ${doc.id} created successfully`
            });
        })
        .catch(err => {
            console.error(err);
            return resp.status(500).json({
                error: err.code
            });
        });
};