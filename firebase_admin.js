import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import serviceaccount from "./NoteGenius_Private_Key.json";

if (!getApps().length){
  initializeApp({
    credential: cert(serviceaccount)
  })
}

const adminDB = getFirestore();
const adminStorage = getStorage();

export { adminDB, adminStorage };
