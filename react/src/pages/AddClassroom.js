import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Container, Paper } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';

function AddClassroom() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    location: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/classrooms', formData);
      navigate('/classrooms');
    } catch (error) {
      console.error('Ошибка при добавлении кабинета:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добавить кабинет
      </Typography>
      <Container component="main" maxWidth="sm" sx={{ mt: 3 }}>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Название кабинета"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Вместимость"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Расположение"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Описание"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/classrooms')}
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

export default AddClassroom;
