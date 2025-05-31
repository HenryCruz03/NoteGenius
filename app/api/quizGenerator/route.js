import {GoogleGenerativeAI} from "@google/generative-ai";
import { adminStorage } from "@/firebase_admin";
import { NextResponse } from "next/server";
const genAI= new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);



export async function POST(req) {
    try {
        const bucket = adminStorage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
        const formData = await req.formData();
        const txtId = formData.get("txtId");
        const userId= formData.get("uid");
        const numQuestions=formData.get("numQuestions");
        const difficulty=formData.get("difficulty")

        if(!txtId || !userId || !numQuestions || !difficulty) {
            return new Response(
                JSON.stringify({error:"Missing required fields."}),
            );
        }

        const txtFile = bucket.file(`files/${userId}/${txtId}`);
        const [txtBuffer]= await txtFile.download();
        const extractedText = txtBuffer.toString("utf-8")

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


        const prompt = `
        You are a quiz generator for students. Based on the class notes provided, generate ${numQuestions} multiple-choice questions at a ${difficulty} difficulty level.
            Each question must have:
            - A clear question statement
            - 4 answer choices
            - One correct answer (from those 4)
            - An Explanation of why that answer is correct

            ⚠️ VERY IMPORTANT: 
            Your output must ONLY be a valid JSON array. DO NOT use code formatting of any kind (no triple backticks). DO NOT include markdown. DO NOT prefix or suffix the output with "json", "Here is the quiz:", or anything else.

            Only output this exact structure, with no extras:

            [
                {
                    "question": "....",
                    "answer1": "....",
                    "answer2": "....",
                    "answer3": "....",
                    "answer4": "....",
                    "correctAnswerIdx": 1,2,3 or 4
                    "explanation": "...."
                },
                ...
            ]

            Only return the JSON array. Here are the class notes to use:
            """
            ${extractedText}
            """
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log("text:", text);
        const quiz = JSON.parse(text);

        return NextResponse.json({ quiz });
        
    } catch (error) {
        console.error("Error generating quiz content:", error);

        return new Response(
            JSON.stringify({ error }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

}