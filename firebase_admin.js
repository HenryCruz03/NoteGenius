import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceaccount from "./NoteGenius_Private_Key.json";

    console.log("firebase admin function works!");
  initializeApp({
    credential: cert(
        serviceaccount)
    })
  
    const adminDB = getFirestore();
    const adminStorage = getStorage();
    
    export { adminDB, adminStorage };
