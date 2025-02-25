"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishData = publishData;
const firestore_1 = require("@firebase/firestore");
const async_lock_1 = __importDefault(require("async-lock"));
const dotenv = __importStar(require("dotenv"));
const firestore_2 = require("./firestore");
// import { convertTimeStamp } from "./timestamp";
dotenv.config();
// Create a lock instance
const lock = new async_lock_1.default();
const log = console.log;
// Cache as simple arrays (no need for keys)
// Cache structure to store operations by Firestore instance
const cache = new Map();
const batch_processing_time = process.env.FIRESTORE_BATCH_PROCESSING_TIME_INTERVAL ? parseInt(process.env.FIRESTORE_BATCH_PROCESSING_TIME_INTERVAL) : 1500;
// Cache Limit per batch
const cacheLimit = process.env.FIRESTORE_BATCH_LIMIT ? parseInt(process.env.FIRESTORE_BATCH_LIMIT) : 300;
let firestore;
const firestoreManager = false;
// FirestoreManager.getInstance({ log: console.log });
// Function to publish data to Firestore
async function publishData(data, roomid) {
    return new Promise(async (resolve, reject) => {
        try {
            // Ensure the externalOrderId is defined
            // const log = loggerFunction(context);
            const docId = Date.now().toString();
            const timestamp = Date.now().toString();
            console.log(timestamp);
            const collectionPath = 'chatSocket/' + roomid + "/messages/" + timestamp; // Collection naming convention
            log("reading collectionpath", collectionPath, true);
            firestore = await (0, firestore_2.getFirestoreInstance)();
            const docRef = (0, firestore_1.doc)(firestore, collectionPath);
            let modificationCount = 1; //modificationCount added
            // Fetch existing document from Firestore
            const existingDoc = await (0, firestore_1.getDoc)(docRef);
            const now = new Date().toISOString();
            let lastCoordinatesUpdated = now;
            let payloadUpdateTime = now;
            let trackingId;
            if (existingDoc.exists() && firestoreManager) {
                const existingData = existingDoc.data();
                payloadUpdateTime = now;
                if (existingData.hasOwnProperty("modificationCount")) {
                    modificationCount = existingData.modificationCount + 1;
                }
            }
            // Add additional keys to the payload
            const updatedData = {
                ...data,
                payloadUpdateTime,
                modificationCount
            };
            // Add or overwrite the document in Firestore
            await (0, firestore_1.setDoc)(docRef, updatedData);
            // console.log(getFirestoreInstance(brand+"_"+country))
            log("FinalStage " + collectionPath + " Document added with ID:", docId, " order_status: " + data.orderStatusName + " almpstatus : " + data.almpStatusId, " modificationCount : " + modificationCount);
            resolve(`Data added successfully with ID: ${docId}`);
        }
        catch (error) {
            console.error("Error:", error.message);
            reject(`Error: ${error.message}`);
        }
    });
}
//# sourceMappingURL=databasesync.js.map