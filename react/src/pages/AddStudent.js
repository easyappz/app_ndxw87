import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Container, Paper } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import api from '../services/api';

function ДобавитьУченика() {
  const навигатор = useNavigate();
  const [данныеФормы, установитьДанныеФормы] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    balance: 0
  });

  const обработатьИзменение = (e) => {
    const { name, value } = e.target;
    установитьДанныеФормы({ ...данныеФормы, [name]: value });
  };

  const обработатьОтправку = async (e) => {
    e.preventDefault();
    try {
      await api.createStudent(данныеФормы);
      навигатор('/students');
    } catch (ошибка) {
      console.error('Ошибка при добавлении ученика:', ошибка);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добавить ученика
      </Typography>
      <Container component="main" maxWidth="sm" sx={{ mt: 3 }}>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
          <form onSubmit={обработатьОтправку}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Имя"
              name="firstName"
              value={данныеФормы.firstName}
              onChange={обработатьИзменение}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Фамилия"
              name="lastName"
              value={данныеФормы.lastName}
              onChange={обработатьИзменение}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={данныеФормы.email}
              onChange={обработатьИзменение}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Телефон"
              name="phone"
              value={данныеФормы.phone}
              onChange={обработатьИзменение}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Имя родителя"
              name="parentName"
              value={данныеФормы.parentName}
              onChange={обработатьИзменение}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Телефон родителя"
              name="parentPhone"
              value={данныеФормы.parentPhone}
              onChange={обработатьИзменение}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => навигатор('/students')}
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

export default ДобавитьУченика;
