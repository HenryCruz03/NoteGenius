import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * GET /api/getUserFiles?userId=abc123
 * Returns all files in Firestore that belong to a specific user.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response("Missing userId parameter", { status: 400 });
  }

  try {
    const q = query(collection(db, "files"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

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