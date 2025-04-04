'use client'
import { Box, Typography,button, rgbToHex,Paper } from "@mui/material";
import NavBar from "./NavBar/NavBar";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { auth } from "@/firebase";
import { signInWithCustomToken } from "firebase/auth";
import  UploadFileIcon from "@mui/icons-material/UploadFile";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const signIntoFirebaseWithClerk = async () => {
    const token = await getToken({ template: 'integration_firebase' })
    await signInWithCustomToken(auth, token)
  }

  useEffect(() => {
    if (isSignedIn) {
      signIntoFirebaseWithClerk();
    }
  }, [isSignedIn]);
  
  return (
  
    <Box
  sx={{
    backgroundColor: "#01454e",
    width: "100vw",
    height: "100vh",
    
  
  }}
>
  <NavBar />

  <Box
    sx={{
    width:"100%",
    display:"flex",
    flexWrap:"wrap",
    justifyContent:"Center",
    gap:4,
    px:2,
    pt:8,
    }}
  >
    <Paper
     elevation={6}
     sx={{
      width: 320,
      height: 400,
      p:3,
      borderRadius:4,
      backgroundColor:"#f1edff",
      textalign:"center",
      display:"flex",
      justifyContent:"center",
      FlexDirection:"column",
      alignItems:"center",
     }}
    >
      <Typography variant="h7" sx =  {{fontWeight:"bold",mt:4,color:"#6a92b2"}}>
        Speak to our very own Chatbot!
      </Typography>
      </Paper>
    <Paper
    elevation={6}
    sx={{
      width:320,
      height:400,
      p: 3, 
      borderRadius:4,
      textAlign:"center",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      
    }}
    >
    

    
    <Typography variant="h7" sx =  {{fontWeight:"bold",mt:4,color:"#6a92b2"}}>
      Please Insert Notes Here:
    </Typography>

    <Box
      component="label"
      htmlFor="file-upload"
      sx={{
        height:200,
        width:200,
        border: "2px dashed white",
        borderRadius: 2,
        display: "inline-block",
        color: "rgba(5, 169, 175, 0.44)",
        cursor: "pointer",
        fontWeight:"bold",
        backgroundColor: "rgba(5, 169, 175, 0.44)",
        '&:hover': {
          backgroundColor: "rgba(3, 118, 153, 0.57)",
        },
      }}
    >
      <UploadFileIcon sx={{ fontSize: 60, color:"#6a92b2" }} />
      <Typography sx={{ mt: 1 }}>
        Click or drag files here to upload
      </Typography>
      <input
        id="file-upload"
        type="file"
        hidden
        multiple
        onChange={(e) => {
          const files = e.target.files;
          console.log("Selected files:", files);
        }}
      />
       
    </Box>
    </Paper>
    <Paper
     elevation={6}
     sx={{
      width: 320,
      height: 400,
      p:3,
      borderRadius:4,
      backgroundColor:"#f1edff",
      textalign:"center",
      display:"flex",
      justifyContent:"center",
      FlexDirection:"column",
      alignItems:"center",
     }}
    >
      <Typography variant="h7" sx =  {{fontWeight:"bold",mt:4,color:"#6a92b2"}}>
        Create your Own Quiz here!
      </Typography>
      </Paper>


    </Box>
  </Box>
  );
}