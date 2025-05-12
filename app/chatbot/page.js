"use client";
import { useStore } from "@/app/stateManagement/RootStoreProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Card, CardContent, TextField,Button } from "@mui/material";
import PreviewIcon from '@mui/icons-material/Preview';



export default function ChatbotPage() {
    const router = useRouter();
    const fileViewStore = useStore().fileViewStore;
    const { selectedFile } = fileViewStore;
    const [showPDF, setShowPDF]= useState(false)
    const [prompt,setPrompt]=useState("")
    const [messages,setMessages]=useState([])

useEffect(() => {
   if (!selectedFile) {
    alert("No File Selected. Please go back and select one");
    router.push("/");
    }
}, [selectedFile,router]);

const handleSendMessage = async () => {
  try {
    const userMessage= {role: "user", content:prompt};
     setMessages((prev)=>[...prev,userMessage])
     const formData = new FormData();
      formData.append("userMessage", userMessage);

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
  }
};  
 
return (
     <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#01454e",
            width: "100vw",
            height: "100vh",
            padding:2,
            alignItems:'center',

          }}
        >
          <Button
          variant="contained"
          sx={{alignSelf:"flex-start"}}
          onClick={()=>{
            setShowPDF(!showPDF) 
            window.open(selectedFile.url, "_blank");
          }}
          >
            {showPDF ? "Hide PDF":"View PDF"}
          </Button>
         {/* {showPDF && (
      //   <Card sx={{ width: "100%", height: "80vh", mt: "2", display:"flex",}}>
      //     <CardContent sx={{width:"100%",height:"100%"}}>
      //       <embed
      //         src={selectedFile.url}
      //         width="100%"
      //         height="100%"
      //         type="application/pdf"
      //         style={{}}
      //       />
      //     </CardContent>
      //   </Card>
      // )} */}
          <Box sx={{flexGrow:1}}/>
          <TextField
          size="normal"
          multiline
          maxRows={4}
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