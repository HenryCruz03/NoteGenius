"use client";
import { Box, Typography, button, rgbToHex, Paper, Card, CardContent, Checkbox } from "@mui/material";
import NavBar from "./NavBar/NavBar";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { signInWithCustomToken } from "firebase/auth";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDropzone } from "react-dropzone";
import { observer } from "mobx-react"
import { useStore } from "./stateManagement/RootStoreProvider";

const Home = observer(() => {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [ error, setError ] = useState('');
  const fileViewStore = useStore().fileViewStore;

  const { 
    filesArr, 
    selectedFile, 
    setSelectedFile, 
    unselectFile, 
    filesLoaded, 
    loadFiles,
  } = fileViewStore;

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
    if (!isSignedIn) return;
    if (filesLoaded) return;

    const fetchUserFiles = async () => {
      try {
        await loadFiles(user.id);
        console.log('Fetched files: ', filesArr);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchUserFiles();
  }, [isSignedIn, user?.id, filesArr, filesLoaded, loadFiles]);

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
          await addFile(file, user.id);
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

  const handleFileClick = (file) => {
    if (!selectedFile) {
      setSelectedFile(file);
    } else {
      if (file.id != selectedFile.id) {
        setSelectedFile(file);
      } else {
        unselectFile();
      }
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#01454e",
        width: "100vw",
        height: "100%",
        overflowY: 'auto',
        flex: 1,
      }}
    >
      <NavBar />

      <Box
        sx={{
          width: "100%",
          height: "100%",
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
      
      {/* Display files */}
      {filesArr.length > 0 && (
        <Box
          component="div"
          display="flex"
          flexDirection="column"
          width='100%'
          sx={{overflowY: 'auto', m: 4}}
        >
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '1rem' }} >  
            <Typography variant="h4" color="white">
              File Library
            </Typography>
          </Box>
          <Box
            component="div"
            display="flex"
            flexWrap="wrap"
            justifyContent="space-around"
            gap="1em"
          >
            {filesArr.map((file) => (
              <Card
                key={file.id}
                sx={{
                  width: '15em',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  position: 'relative',
                }}
                onClick={() => handleFileClick(file)}
              >
                <CardContent>
                  <embed
                    src={file.url}
                    width="100%" 
                    height="100%"
                  />
                  <Typography gutterBottom>
                    {file.fileName}
                  </Typography>
                </CardContent>
                <Box
                  component="div"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.5rem', 
                    height: '2.5rem',
                    backgroundColor: 'inherit', 
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                >
                  <Checkbox
                    checked={selectedFile?.id === file.id}
                  />
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default Home;