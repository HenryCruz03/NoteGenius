"use client";
import { Box, Typography, button, rgbToHex, Paper } from "@mui/material";
import NavBar from "./NavBar/NavBar";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { signInWithCustomToken } from "firebase/auth";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [ error, setError ] = useState('');
  const [userFiles, setUserFiles] = useState([]);

  const signIntoFirebaseWithClerk = async () => {
    const token = await getToken({ template: "integration_firebase" });
    await signInWithCustomToken(auth, token);
  };

  useEffect(() => {
    if (isSignedIn) {
      signIntoFirebaseWithClerk();
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/getUserFiles?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched user files:", data); 
          setUserFiles(data);   
        })
        .catch((err) => {
          console.error("Error fetching files:", err);
        });
    }
  }, [user?.id]);

  // Dropzone setup for drag-and-drop PDF upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (!user || !user.id) {
        // Ensure user is not null
        console.error("Cannot upload file: No current user available.");
        return;
      }
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Get the MIME type of the file
        const mimeType = file.type;

        // Check if the file is a PDF MIME type
        if (!mimeType.startsWith("application/pdf")) {
          setError("The uploaded file is not a valid PDF.");
          console.log("The uploaded file is not a valid PDF.");
          return;
        }

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("userId", user.id);

          const res = await fetch("/api/saveFile", {
            method: "POST",
            body: formData
          });

          if (!res.ok) {
            throw new Error(`Server Error: ${res.status}`);
          }
        
          const data = await res.json();
          console.log("Uploaded:", data);
        } catch (error) {
          setError("Error uploading file, please try again.");
          console.error(error);
        }
      }
    },
    // Accept PDF MIME types, defined as an object with MIME types and corresponding extensions
    accept: {
      "application/pdf": [".pdf"],
    },

    maxSize: 10 * 1024 * 1024, // Set max file size to 10MB
    maxFiles: 1, // Allow only one file
    multiple: false, // Disable multiple file selection
    onDropRejected: () => {
      console.log("File rejected");
    },
  });

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
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "Center",
          gap: 4,
          px: 2,
          pt: 8,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: 320,
            height: 400,
            p: 3,
            borderRadius: 4,
            backgroundColor: "#f1edff",
            textalign: "center",
            display: "flex",
            justifyContent: "center",
            FlexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h7"
            sx={{ fontWeight: "bold", mt: 4, color: "#6a92b2" }}
          >
            Speak to our very own Chatbot!
          </Typography>
        </Paper>
        <Paper
          elevation={6}
          sx={{
            width: 320,
            height: 400,
            p: 3,
            borderRadius: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h7"
            sx={{ fontWeight: "bold", mt: 4, color: "#6a92b2" }}
          >
            Please Insert Notes Here:
          </Typography>

          <Box
            component="label"
            htmlFor="file-upload"
            {...getRootProps()}
            sx={{
              height: 200,
              width: 200,
              border: "2px dashed white",
              borderRadius: 2,
              display: "inline-block",
              color: "rgba(5, 169, 175, 0.44)",
              cursor: "pointer",
              fontWeight: "bold",
              backgroundColor: "rgba(5, 169, 175, 0.44)",
              "&:hover": {
                backgroundColor: "rgba(3, 118, 153, 0.57)",
              },
            }}
          >
            <UploadFileIcon sx={{ fontSize: 60, color: "#6a92b2" }} />
            <Typography sx={{ mt: 1 }}>
              Click or drag files here to upload
            </Typography>
            <input {...getInputProps()} />
          </Box>
        </Paper>
        <Paper
          elevation={6}
          sx={{
            width: 320,
            height: 400,
            p: 3,
            borderRadius: 4,
            backgroundColor: "#f1edff",
            textalign: "center",
            display: "flex",
            justifyContent: "center",
            FlexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h7"
            sx={{ fontWeight: "bold", mt: 4, color: "#6a92b2" }}
          >
            Create your Own Quiz here!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
