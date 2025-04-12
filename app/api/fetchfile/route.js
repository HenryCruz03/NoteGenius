import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();

/**
 * Returns all files in Firestore that belong to a specific user.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response("Missing userId parameter", { status: 400 });
  }

  try {
    const snapshot = await db.collection("files").where("uid", "==", userId).get();

    const files = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched files for user:", userId, files);

    return Response.json(files);
  } catch (error) {
    console.error("Error fetching user files:", error);
    return new Response("Internal server error", { status: 500 });
  }
}