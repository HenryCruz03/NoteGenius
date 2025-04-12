import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import pdfParse from "pdf-parse";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();

/**
 * Saves a PDF file and its extracted text as a .txt file to Firebase Storage, and stores metadata in Firestore.
 * @param {File} file - The PDF file.
 * @param {string} userId - The ID of the user uploading the file.
 */
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId")
  
    const timestamp = new Date();
    const fileId = uuidv4(); // Generate a unique ID
    const txtFileId = uuidv4(); // TXT file ID

    const buffer = Buffer.from(await file.arrayBuffer());

    const bucket = getStorage().bucket(process.env.FIREBASE_STORAGE_BUCKET);

    // Upload the original PDF
    const pdfPath = `files/${userId}/${fileId}`;
    const pdfFile = bucket.file(pdfPath);
    await pdfFile.save(buffer, {
      contentType: file.type,
      resumable: false,
    });
    const [pdfURL] = await pdfFile.getSignedUrl({
      action: "read",
      expires: "03-01-2030",
    });

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    // Upload extracted text as .txt
    const txtPath = `files/${userId}/${txtFileId}`;
    const txtFile = bucket.file(txtPath);
    await txtFile.save(Buffer.from(extractedText), {
      contentType: "text/plain",
      resumable: false,
    });

    // Save metadata to Firestore
    const docRef = await db.collection("files").add({
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