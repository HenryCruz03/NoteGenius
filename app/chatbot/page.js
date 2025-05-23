"use client";
import { useStore } from "@/app/stateManagement/RootStoreProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography,TextField,Button } from "@mui/material";
import TypewriterMessage from "./typewriter";
import NavBar from "../NavBar/NavBar";


export default function ChatbotPage() {
    const router = useRouter();
    const fileViewStore = useStore().fileViewStore;
    const { selectedFile } = fileViewStore;
    const [showPDF, setShowPDF]= useState(false);
    const [prompt,setPrompt]=useState("");
    const [messages,setMessages]=useState([]);
    const [isTyping,setIsTyping]=useState(false);

useEffect(() => {
   if (!selectedFile) {
    alert("No File Selected. Please go back and select one");
    router.push("/");
    }
}, [selectedFile,router]);

const handleSendMessage = async () => {
  try {

    if(!prompt.trim()|| isTyping) return;
    const userMessage= {role: "user", content:prompt};
     setMessages((prev)=>[...prev,userMessage])
     setPrompt("");

     setIsTyping(true);
     const formData = new FormData();
      formData.append("userMessage", prompt);
      formData.append("txtId",selectedFile.txtId);
      formData.append("uid",selectedFile.uid);
      formData.append("fileName",selectedFile.fileName)
    
      if(selectedFile){
        formData.append("fileText",selectedFile.extractedText || "");
        formData.append("fileName",selectedFile.fileName);
      }

      const res = await fetch("api/sendmessage", {
        method: "POST",
        body: formData,
      });
      const chatbotmessageRes = await res.json();
      const chatbotMessageData = chatbotmessageRes.message;

     setMessages((prev)=>[...prev,chatbotMessageData])
     setPrompt("");
  } catch (error) {
    console.error("Error Sending Message", error);
    setIsTyping(false);
  }
};  
 
return (
     <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#faebd7",
            width: "100vw",
            height: "100vh",
            padding:2,
            alignItems:'center',

          }}
        >
          <NavBar sx={{widith:"100%", margin:0, padding:0}}/>
          <Button
          variant="contained"
          sx={{alignSelf:"flex-start", mt:4}}
          onClick={()=>{
            setShowPDF(!showPDF) 
            window.open(selectedFile.url, "_blank");
          }}
          >
            {showPDF ? "Hide PDF":"View PDF"}
          </Button>
          
          <Box
          sx={{
          display:"flex",
          flexDirection:"column",
          width:"100%",
          maxWidth:"800px",
          flexGrow:1,
          overflowY:"auto",
          backgroundColor:"99b4b8",
          borderRadius:2,
          padding:2,
          marginTop:2
          }}
          >
            {messages.map((msg,index)=>  (
              <Box
              key={index}
              sx={{
                backgroundColor: msg.role === "user"? "#8fce00" :"#956437",
                color:"#f8f8f8",
                fontFamily:"sans-serif",
                borderRadius:2,
                padding: 1.5,
                marginBottom:1.5,
                alignSelf: msg.role === "user"? "flex-end" : "flex-start",
                width:"fit-content",
                maxWidth:"100%"
              }}
              >
                {msg.role === "bot" && index === messages.length-1?(
                  <TypewriterMessage content={msg.content} onComplete={()=>setIsTyping(false)}  />
                ) :  (
                <Typography variant="body1" sx={{whiteSpace:"pre-wrap"}}>
                  {msg.content}
                </Typography>
              )}
              </Box>
          ))}
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          </Box>

          <TextField
          size="normal"
          multiline
          maxRows={4}
          disabled={isTyping}
          placeholder="Ask about something regarding the document"
          value={prompt}
           onChange={(e)=> setPrompt(e.target.value)}
          variant="outlined"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();       // prevent newline
              handleSendMessage();             // call your function
            }
          }}
          sx={{
            backgroundColor:"white", 
            width:"25%",
            borderRadius:"2",
            padding:"1"       
          }}
          >
        </TextField>
      </Box>
);

}