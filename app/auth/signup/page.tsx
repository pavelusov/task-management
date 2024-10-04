'use client';
import {Box, TextField, Button, Typography, Alert, Container} from '@mui/material';
import { useSignUp } from "./lib/use-sign-up";

export default function SignUp() {
  const { state, handle } = useSignUp();
  const { username, password, success, error } = state;
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
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">User created successfully!</Alert>}
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
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
        Register
      </Button>
    </Box>
    </Container>
  );
};
