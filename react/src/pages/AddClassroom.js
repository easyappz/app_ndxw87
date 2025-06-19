import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Container, Paper } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import api from '../services/api';

function ДобавитьКабинет() {
  const навигатор = useNavigate();
  const [данныеФормы, установитьДанныеФормы] = useState({
    name: '',
    capacity: '',
    location: '',
    description: ''
  });

  const обработатьИзменение = (e) => {
    const { name, value } = e.target;
    установитьДанныеФормы({ ...данныеФормы, [name]: value });
  };

  const обработатьОтправку = async (e) => {
    e.preventDefault();
    try {
      await api.createClassroom(данныеФормы);
      навигатор('/classrooms');
    } catch (ошибка) {
      console.error('Ошибка при добавлении кабинета:', ошибка);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добавить кабинет
      </Typography>
      <Container component="main" maxWidth="sm" sx={{ mt: 3 }}>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
          <form onSubmit={обработатьОтправку}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Название кабинета"
              name="name"
              value={данныеФормы.name}
              onChange={обработатьИзменение}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Вместимость"
              name="capacity"
              type="number"
              value={данныеФормы.capacity}
              onChange={обработатьИзменение}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Расположение"
              name="location"
              value={данныеФормы.location}
              onChange={обработатьИзменение}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Описание"
              name="description"
              multiline
              rows={4}
              value={данныеФормы.description}
              onChange={обработатьИзменение}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => навигатор('/classrooms')}
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

export default ДобавитьКабинет;
