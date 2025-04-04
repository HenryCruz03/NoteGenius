  // File: PROJECT-4/ai_flashcards/app/components/Navbar.js

  import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/nextjs";
  import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
  import Link from "next/link";
  import { useRouter } from "next/navigation";

  export default function NavBar() {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    return (
      <Box sx={{ width: '100%' }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: '#1565c0',
            padding: '0.5rem 1rem',
            '&:hover': {
              backgroundColor: '#1e88e5',
              transition: 'background-color 0.3s ease-in-out',
            },
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* Website Name on the Left */}
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                NoteGenius
              </Link>
            </Typography>

            {/* Centered Navigation Links */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Button sx={{ color: 'white', textDecoration: 'none' }}>
                <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                  Home
                </Link>
              </Button>
              <Box sx={{ borderLeft: '1px solid white', height: '24px', marginX: '0.5rem' }} />
              <SignedOut>
                <Button sx={{ color: 'white', textDecoration: 'none' }}>
                  <Link href="/sign-in" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                    Login
                  </Link>
                </Button>
                <Box sx={{ borderLeft: '1px solid white', height: '24px', marginX: '0.5rem' }} />
                <Button sx={{ color: 'white', textDecoration: 'none' }}>
                  <Link href="/sign-up" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                    Sign Up
                  </Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }