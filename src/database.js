import admin from 'firebase-admin';
import serviceAccount from '../firebase.json';

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const storage = admin.storage();

export default db;

export { storage };