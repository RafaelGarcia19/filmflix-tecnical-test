import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import serviceAccount from "../firebase.json";
import env from "./config";

// Initialize Firebase
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: env.db.storageBucket,
});

const db = getFirestore();

const storage = getStorage().bucket();

export { db, storage };
