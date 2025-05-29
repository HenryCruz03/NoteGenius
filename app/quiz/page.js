"use client";
import {useState } from "react";
import { Box,Typography,TextField,MenuItem,Button,Card,CardContent,CircularProgress,Paper} from "@mui/material";
import NavBar from "../NavBar/NavBar";
import { useStore } from "@/app/stateManagement/RootStoreProvider";



export default function QuizPage({selectedFile}) {
    const {selectedFile} = useStore().fileViewStore;
    const [difficulty,setDifficulty]= useState('easy');
    const [questions,setquestions]= useState("5")
    const [quiz,setQuiz]=useState([]);
    const [loading,setLoading]= useState(false);
    

  const handleGenerateQuiz = async() => {
    if (!selectedFile || !selectedFile.extractedText){

    }
 setLoading(true);
    const formData = new FormData();
    formData.append("fileText", selectedFile.extractedText);
    formData.append("numQuestions", questions);
    formData.append("difficulty", difficulty);

  }



  

    return (
 <Box>




 </Box>

    )

  }