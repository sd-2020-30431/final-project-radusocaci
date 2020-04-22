const admin = require('firebase-admin');
require('custom-env').env();

admin.initializeApp();

const db = admin.firestore();

module.exports = {admin, db};