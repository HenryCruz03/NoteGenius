import { GoogleGenerativeAI } from "@google/generative-ai"
import { adminStorage } from "@/firebase_admin";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);

export async function POST(req) {
    
    try{
    const bucket=adminStorage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const formData = await req.formData();
    const message = formData.get("userMessage"); 
    const fileName= formData.get("fileName");
    const txtId = formData.get("txtId");
    const userId= formData.get("uid");

    if (!txtId || !userId || !message) {
      return new Response(JSON.stringify({ error: "Missing data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const txtFile=bucket.file(`files/${userId}/${txtId}`);
    const [txtBuffer]= await txtFile.download();
    const extractedText= txtBuffer.toString("utf-8")


      const fullPrompt= 
      `You are an intelligent AI assistant. The user has uploaded a document titled "${fileName}".
      
      
      Here is the content of the document:

      """
      ${extractedText}
      
      """

      The user will now ask you some questions based on the document:
      "${message}"
      ` .trim();
      
      
    

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(fullPrompt );
    const response = await result.response;
    const text = response.text();
    const chatbottext={role:"bot",content:text}



    return new Response(JSON.stringify({message:chatbottext}),{

        headers:{"Content-Type": "application/json"},
    });
}   catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

}     
