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
    - 4 Answer Choices labeled A,B,C,D
    - One correct answer (from those 4)

    Format the output in the following way:
  [ 
   {
   question: " ....",
   answer1: "....",
   answer2: "....",
   answer3: ".....",
   answer4: "....",
   correctAnswerIdx: 1, 2, 3, or 4
   }
  , 
   .....
  ,
  .....
]
    Here are the class notes to use:
    """
    ${fileText}
    """
    `;

    const result = await model.generateContent(fullPrompt );
    const response = await result.response;
    const text = response.text();
    const quiz =JSON.parse(text);
    return quiz

}