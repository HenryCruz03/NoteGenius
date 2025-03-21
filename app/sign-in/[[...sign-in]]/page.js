import { SignIn } from "@clerk/nextjs";
import { AppBar, Box, Container, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function SignUpPage(){
    return (
        <Container maxWidth="100vw">
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        FlashGenius
                    </Typography>
                    <Button sx={{ color: 'white', textDecoration: 'none' }}>
                      <Link href="/sign-in" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                        Login
                      </Link>
                    </Button>
                    <Button sx={{ color: 'white', textDecoration: 'none' }}>
                      <Link href="/sign-up" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                        Sign Up
                      </Link>
                    </Button>
                </Toolbar>
            </AppBar>

            <Box 
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h4">
                    Sign In
                </Typography>
                <SignIn/>
            </Box>
        </Container>
    )
}