'use client'
import { Box, Typography } from "@mui/material";
import NavBar from "./NavBar/NavBar";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { auth } from "@/firebase";
import { signInWithCustomToken } from "firebase/auth";

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
  
    <Box sx={{
      backgroundColor:"rgb(2, 25, 51)", 
      width:"100vw",
      height:"100vh", 
      }}
    >
      <NavBar/>
      
  
     </Box>
    
  )
}