import Image from "next/image";
import styles from "./page.module.css";
import { Box, Typography } from "@mui/material";


export default function Home() {
  
  return (
  
    <Box sx={{p:2,backgroundColor:"rgb(2, 25, 51)", width:"100vw",height:"100vh", 
      alignItems:"center",
      display:"flex",
      pt:4,
      flexDirection:"column",
      textAlign:"right"
      }}
      >
      <Box sx={{p:8,backgroundcolor:"rgb(255, 255, 255)",width:"25",height:"25",
        
      }}>

      </Box>
    <Typography 
    variant="h7"
    sx={{textAlign:"center",justifyContent:"flex-start" }}
    >
    Drag and Drop Note Files Here 
    </Typography>  
   
    
     </Box>
    
  )
}