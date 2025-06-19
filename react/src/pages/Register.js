import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, Alert, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = '/';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}api/auth/register`, { 
        email, 
        password, 
        firstName, 
        lastName, 
        role 
      });
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please check your details and try again.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 500, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <PersonAddIcon color="primary" fontSize="large" />
          <Typography component="h1" variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
            Register
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
            label="First Name"
            name="firstName"
            autoFocus
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            sx={{ mt: 1, mb: 2 }}
            onClick={() => navigate('/login')}
            disabled={loading}
          >
            Already have an account? Sign In
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
