'use client';
import { Box, TextField, Button, Typography, Alert, Container } from '@mui/material';
import { useSignIn } from "./lib/use-sign-in";
import Link from "next/link";

export default function SignIn() {
  const { state, handle } = useSignIn()
  const { username, password, error } = state;
  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        component="form"
        onSubmit={handle.submit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          p: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" component="h1" textAlign="center">
          Sign In
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => handle.setUsername(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => handle.setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth>
          Sign In
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <Link href="/auth/signup" style={{ color: '#125aa1', textDecoration: 'underline' }}>
          Register here
        </Link>
      </Typography>
    </Container>
  );
}
