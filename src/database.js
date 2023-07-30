import admin from 'firebase-admin';
import serviceAccount from '../firebase.json';

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default db;