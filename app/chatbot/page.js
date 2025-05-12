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

  const userMessage= {role: user, content:prompt};

  setMessages((prev)=>[...prev,userMessage])
  setPrompt("");

return (
     <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#01454e",
            width: "100vw",
            height: "100vh",
            padding:2,
          }}
        >
          <Button
          variant="contained"
          sx={{alignSelf:"flex-start"}}
          onClick={()=>setShowPDF(!showPDF) }
          >
            {showPDF ? "Hide PDF":"View PDF"}
          </Button>
          {showPDF && (
        <Card sx={{ width: "100%", height: "80vh",flex:"1" , mt: "2"}}>
          <CardContent>
            <embed
              src={selectedFile.url}
              width="100%"
              height="100%"
              type="application/pdf"
              style={{ borderRadius: "8px" }}
            />
          </CardContent>
        </Card>
      )}

          <TextField
          size="normal"
          multiline
          maxRows={4}
          placeholder="Ask about something regarding the document"
          value={prompt}
          onChange={(e)=> setPrompt(e.target.value)}
          variant="outlined"
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