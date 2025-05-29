import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI= new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);



export async function POST(req) {


    const formData= await req.formData();
    const fileText=formData.get("fileText");
    const numQuestions=formData.get("questions");
    const difficulty=formData.get("difficulty")

    if(!fileText || !numQuestions || !difficulty) {

        return new Response(
            JSON.stringify({error:"Missing required fields."}),
        );
    }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


    const prompt = `You are an quiz generator for students. Based on the notes provided,generate ${numQuestions} multiple choice questions at a ${difficulty} difficulty level.
    
    Each question must have:
    - A clear question statement
    - 4 Answer Choices in a multiple choice format
    - One correct answer (from those 4)

    Format the final response like this:
    [
    {
    "question": "1. What is the powerhouse of the cell?",
    "choices":["Nucleus","Mitochondria","Ribosome","Chloroplast"],
    },
    
      ...
    ]
    Here are the class notes to use:
    """
    
    
    
    
    `





}