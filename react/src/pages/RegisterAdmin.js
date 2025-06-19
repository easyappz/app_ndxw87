import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Alert, CircularProgress, Paper } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api.js';

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
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const checkAdminExists = async () => {
      setIsLoading(true);
      try {
        const response = await api.checkAdminExists();
        if (response.exists && !user) {
          setAdminExists(true);
          setError('Администратор уже существует. Регистрация нового администратора невозможна без авторизации.');
        }
      } catch (err) {
        console.error('Ошибка проверки существования администратора:', err.message);
        setError('Не удалось проверить наличие администратора. Попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminExists();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data = {
        email,
        password,
        firstName,
        lastName
      };

      let response;
      if (user && user.role === 'admin') {
        response = await api.registerAdmin(data, token);
      } else {
        response = await api.createAdmin(data);
      }

      setSuccess('Администратор успешно зарегистрирован. Вы будете перенаправлены на страницу входа или панель управления.');
      setTimeout(() => {
        if (user && user.role === 'admin') {
          navigate('/');
        } else {
          navigate('/login');
        }
      }, 3000);
    } catch (err) {
      console.error('Ошибка регистрации администратора:', err.message);
      setError(err.message || 'Произошла ошибка при регистрации администратора.');
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
                disabled={adminExists && !user}
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
                disabled={adminExists && !user}
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
                disabled={adminExists && !user}
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
                disabled={adminExists && !user}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                disabled={(adminExists && !user) || isLoading}
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
