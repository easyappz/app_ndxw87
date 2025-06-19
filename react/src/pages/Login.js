import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = '/';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}api/auth/login`, { email, password });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <LockOutlinedIcon color="primary" fontSize="large" />
          <Typography component="h1" variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
            Sign In
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            sx={{ mt: 1, mb: 2 }}
            onClick={() => navigate('/register')}
            disabled={loading}
          >
            Don't have an account? Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
