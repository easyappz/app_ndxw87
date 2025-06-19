import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Container, Paper } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import api from '../services/api';

function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    balance: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createStudent(formData);
      navigate('/students');
    } catch (error) {
      console.error('Ошибка при добавлении ученика:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добавить ученика
      </Typography>
      <Container component="main" maxWidth="sm" sx={{ mt: 3 }}>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Имя"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Фамилия"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Телефон"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Имя родителя"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Телефон родителя"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/students')}
                sx={{ mr: 2 }}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Сохранить
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default AddStudent;
