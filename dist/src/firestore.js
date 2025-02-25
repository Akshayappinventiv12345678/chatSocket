"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirestoreInstance = getFirestoreInstance;
const dotenv_1 = require("dotenv");
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
(0, dotenv_1.config)(); // Load environment variables
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
let firestoreInstance = null;
let appInstance = null;
// Function to initialize Firestore and return a Promise
function getFirestoreInstance() {
    return new Promise((resolve, reject) => {
        if (firestoreInstance) {
            console.log("✅ Firestore instance already initialized.");
            resolve(firestoreInstance);
            return;
        }
        try {
            console.log("🚀 Initializing Firestore...");
            appInstance = (0, app_1.initializeApp)(firebaseConfig);
            firestoreInstance = (0, firestore_1.getFirestore)(appInstance);
            console.log("✅ Firestore initialized successfully.");
            resolve(firestoreInstance);
        }
        catch (error) {
            console.error("🔥 Firestore initialization failed:", error);
            reject(error);
        }
    });
}
//# sourceMappingURL=firestore.js.map