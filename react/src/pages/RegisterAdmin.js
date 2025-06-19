import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Container, Alert, CircularProgress, Paper } from '@mui/material';

const RegisterAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminExists = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/auth/check-admin');
        if (response.data.exists) {
          setAdminExists(true);
          setError('Администратор уже существует. Регистрация нового администратора невозможна.');
        }
      } catch (err) {
        console.error('Ошибка проверки существования администратора:', err.response?.data?.message || err.message);
        setError('Не удалось проверить наличие администратора. Попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminExists();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/create-admin', {
        email,
        password,
        firstName,
        lastName
      });

      if (response.status === 201) {
        setSuccess('Администратор успешно зарегистрирован. Вы будете перенаправлены на страницу входа.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Ошибка регистрации администратора:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Произошла ошибка при регистрации администратора.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Регистрация администратора
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {success}
            </Alert>
          )}
          {isLoading ? (
            <CircularProgress sx={{ mb: 2 }} />
          ) : (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Имя"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={adminExists || isLoading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Фамилия"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={adminExists || isLoading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={adminExists || isLoading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={adminExists || isLoading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={adminExists || isLoading}
              >
                Зарегистрировать администратора
              </Button>
            </form>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterAdmin;
