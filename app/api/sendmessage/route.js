import { GoogleGenerativeAI } from "@google/generative-ai"


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);

export async function POST(req) {


    const formData = await req.formData();
    const message = formData.get("userMessage");
    
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message.content);
    console.log(result)
    const response = await result.response;
    const text = response.text();
    const chatbottext={role:"bot",content:text}
    return chatbottext
















}