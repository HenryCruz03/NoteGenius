"use client";
import {useEffect, useState } from "react";
import { Box,Typography,MenuItem,Button, FormControl, InputLabel, Select, RadioGroup, Radio, FormControlLabel} from "@mui/material";
import NavBar from "../NavBar/NavBar";
import { useStore } from "@/app/stateManagement/RootStoreProvider";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CancelIcon from '@mui/icons-material/Cancel';



const QuizPage = observer(() => {
  const router = useRouter();
  const { selectedFile } = useStore().fileViewStore;
  const { quizViewStore } = useStore();
  const { 
    difficulty, 
    numQuestions, 
    userAnswers, 
    quizContent,
    loading,
    setDifficulty,
    setNumQuestions,
    selectAnswerChoice,
    setLoading,
    setIsSubmitted,
    generateQuiz,
    isSubmitted,
    resetQuiz,
    ShowExplanations,
    SetShowExplanations
  } = quizViewStore;
  useEffect(() => {
    if (!selectedFile) {
     alert("No File Selected. Please go back and select one.");
     router.push("/");
     }
  }, [selectedFile]);

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleNumQuestionsChange = (event) => {
    setNumQuestions(event.target.value);
  };
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#faebd7",
        width: "100vw",
        height: "100vh",
        alignItems:'center',
      }}
    >
      <NavBar sx={{widith:"100%", margin:0, padding:0}}/>

      {quizContent.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems:'center',
            m: 4
          }}
        >
          <FormControl sx={{mb: 5,  width: '15vw'}} disabled={loading}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={difficulty}
              label="Difficulty"
              onChange={handleDifficultyChange}
            >
              <MenuItem value={"easy"}>Easy</MenuItem>
              <MenuItem value={"medium"}>Medium</MenuItem>
              <MenuItem value={"hard"}>Hard</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{mb: 5, width: '15vw'}} disabled={loading}>
            <InputLabel>Number of Questions</InputLabel>
            <Select
              value={numQuestions}
              label="Number of Questions"
              onChange={handleNumQuestionsChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={() => generateQuiz()} disabled={loading}>
            Generate Quiz
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",

          }}
        >
          <Box sx={{display: 'flex', flexDirection: 'column', overflowY: 'auto', height: "100%"}}>
            {quizContent.map((questionObj, idx) => (
              <Box key={idx}  sx={{display: 'flex', flexDirection: 'column', p: 4, }}>
                <Typography sx={{color:"black"}}> {questionObj.question} </ Typography>
                
               
                <FormControl sx={{color:"black"}}>
                  <RadioGroup
                    value={userAnswers[idx]}
                    onChange={(event) => selectAnswerChoice(Number(event.target.value), idx)}
                    sx={{
                      pointerEvents: isSubmitted ? "none" : "auto", 
                    }}
                  >
                    {[1, 2, 3, 4].map((option) => {
                      const isSelected = userAnswers[idx] === option;
                      const isCorrect = questionObj.correctAnswerIdx === option;

                      let color = "default";
                      let icon = <RadioButtonUncheckedIcon />;
                      let checkedIcon = <RadioButtonCheckedIcon />;

                      if (!isSubmitted) {
                        color = isSelected ? "primary" : "default";
                      } else {
                        if (isCorrect && isSelected) {
                          color = "success";
                          checkedIcon = <CheckCircleIcon color="success" />;  
                        } else if (isCorrect && !isSelected) {
                          color = "success";
                          icon = <CheckCircleIcon color="success" />;
                        } else if (!isCorrect && isSelected) {
                          color = "error";
                          checkedIcon = <CancelIcon color="error" />;
                        }
                      }

                      return (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={
                            <Radio 
                              // color={color}
                              icon={icon}
                              checkedIcon={checkedIcon}
                            />
                          }
                          label={questionObj[`answer${option}`]}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                {isSubmitted && (
                  <Button variant="outlined" onClick={()=> SetShowExplanations(prev => !prev)} sx={{mt:2}}> 
                  {ShowExplanations ? "Hide Explanations" : "Show Explanations"}
                  </Button>
                )}
              </Box>
            ))}
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            {isSubmitted ? (
              <Button variant="contained" size="large" onClick={() => resetQuiz()}>
                CREATE NEW QUIZ
              </Button>
            ) : (
              <Button variant="contained" size="large" onClick={() => setIsSubmitted(true)}>
                Submit
              </Button>
             
            )}
           
          </Box>

          
        </Box>
      )}
      

    </Box>

  );
});

export default QuizPage;