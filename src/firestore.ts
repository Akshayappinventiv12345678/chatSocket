import { config } from 'dotenv';
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

config(); // Load environment variables

// 🔒 Load Firebase credentials
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

let firestoreInstance: Firestore | null = null;
let appInstance: FirebaseApp | null = null;

// Function to initialize Firestore and return a Promise
export function getFirestoreInstance(): Promise<Firestore> {
    return new Promise((resolve, reject) => {
        if (firestoreInstance) {
            console.log("✅ Firestore instance already initialized.");
            resolve(firestoreInstance);
            return;
        }

        try {
            console.log("🚀 Initializing Firestore...");
            appInstance = initializeApp(firebaseConfig);
            firestoreInstance = getFirestore(appInstance);
            console.log("✅ Firestore initialized successfully.");
            resolve(firestoreInstance);
        } catch (error) {
            console.error("🔥 Firestore initialization failed:", error);
            reject(error);
        }
    });
}
