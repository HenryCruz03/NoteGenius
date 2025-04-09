import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import pdfParse from "pdf-parse";

/**
 * Saves a PDF file and its extracted text as a .txt file to Firebase Storage, and stores metadata in Firestore.
 * @param {File} file - The PDF file.
 * @param {string} userId - The ID of the user uploading the file.
 */
export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file || !userId) throw new Error("File and userId are required");

  
    const timestamp = new Date();
    const fileId = uuidv4(); // Generate a unique ID
    const txtFileId = uuidv4(); // TXT file ID

    // Upload PDF file
    const pdfStorageRef = ref(storage, `files/${userId}/${fileId}`);
    const pdfSnapshot = await uploadBytes(pdfStorageRef, file);
    const pdfURL = await getDownloadURL(pdfSnapshot.ref);

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    // Create a .txt Blob and upload
    const textBlob = new Blob([extractedText], { type: "text/plain" });
    const txtStorageRef = ref(storage, `files/${userId}/${txtFileId}`);
    await uploadBytes(txtStorageRef, textBlob);

    // Save metadata to Firestore
    const docRef = await addDoc(collection(db, "files"), {
      uid: userId,
      fileName: file.name,
      fileSize: file.size,
      createdAt: timestamp,
      id: fileId,
      txtId: txtFileId,
      url: pdfURL
    });

    return NextResponse.json({ fileId, pdfURL});
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};