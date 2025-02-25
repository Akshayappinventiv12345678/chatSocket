import { Firestore, doc, setDoc, getDoc, updateDoc, writeBatch, DocumentReference } from "@firebase/firestore";
import AsyncLock from "async-lock";


import * as dotenv from 'dotenv';

import { time } from "console";
import { getFirestoreInstance } from "./firestore";
// import { convertTimeStamp } from "./timestamp";
dotenv.config();
// Create a lock instance
const lock = new AsyncLock();
const log=  console.log

// Cache as simple arrays (no need for keys)
// Cache structure to store operations by Firestore instance
const cache = new Map<string, Array<{ docRef: DocumentReference; data: any }>>();
const batch_processing_time = process.env.FIRESTORE_BATCH_PROCESSING_TIME_INTERVAL ? parseInt(process.env.FIRESTORE_BATCH_PROCESSING_TIME_INTERVAL) : 1500;


// Cache Limit per batch
const cacheLimit = process.env.FIRESTORE_BATCH_LIMIT ? parseInt(process.env.FIRESTORE_BATCH_LIMIT) : 300;
let firestore:Firestore;

const firestoreManager = false;
// FirestoreManager.getInstance({ log: console.log });






// Function to publish data to Firestore
export async function publishData(
  data:any,
  roomid:string
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // Ensure the externalOrderId is defined
     
      // const log = loggerFunction(context);

      const docId = Date.now().toString() ; 

      
      const timestamp = Date.now().toString();
      console.log(timestamp); 
      const collectionPath = 'chatSocket/'+roomid+"/messages/"+timestamp; // Collection naming convention
      log("reading collectionpath", collectionPath, true)
      firestore=await getFirestoreInstance();
      const docRef = doc(firestore, collectionPath);
      let modificationCount = 1; //modificationCount added

      // Fetch existing document from Firestore
      const existingDoc = await getDoc(docRef);
      const now = new Date().toISOString();
      let lastCoordinatesUpdated = now;
      let payloadUpdateTime = now;
      let trackingId: any;

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
      await setDoc(docRef, updatedData);
 
      // console.log(getFirestoreInstance(brand+"_"+country))

      log("FinalStage " + collectionPath + " Document added with ID:", docId, " order_status: " + data.orderStatusName + " almpstatus : " + data.almpStatusId, " modificationCount : " + modificationCount);
      resolve(`Data added successfully with ID: ${docId}`);
    } catch (error: any) {
       console.error("Error:", error.message);
      reject(`Error: ${error.message}`);
    }
  });
}



