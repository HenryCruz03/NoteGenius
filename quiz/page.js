"use client";
import { useStore } from "@/app/stateManagement/RootStoreProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography,TextField,Button } from "@mui/material";
import NavBar from "../NavBar/NavBar";

export default function QuizPage() {
    const router = useRouter();
    const fileViewStore = useStore().fileViewStore;
    const { selectedFile } = fileViewStore;
    const [showPDF, setShowPDF]= useState(false);

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
        ></Box>































        )
}

