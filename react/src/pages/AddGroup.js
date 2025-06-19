import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Container, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import api from '../services/api';

function ДобавитьГруппу() {
  const навигатор = useNavigate();
  const [данныеФормы, установитьДанныеФормы] = useState({
    name: '',
    subject: '',
    teacher: ''
  });
  const [преподаватели, установитьПреподавателей] = useState([]);

  useEffect(() => {
    получитьПреподавателей();
  }, []);

  const получитьПреподавателей = async () => {
    try {
      const данные = await api.getTeachers();
      установитьПреподавателей(данные);
    } catch (ошибка) {
      console.error('Ошибка при загрузке преподавателей:', ошибка);
    }
  };

  const обработатьИзменение = (e) => {
    const { name, value } = e.target;
    установитьДанныеФормы({ ...данныеФормы, [name]: value });
  };

  const обработатьОтправку = async (e) => {
    e.preventDefault();
    try {
      await api.createGroup(данныеФормы);
      навигатор('/groups');
    } catch (ошибка) {
      console.error('Ошибка при добавлении группы:', ошибка);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добавить группу
      </Typography>
      <Container component="main" maxWidth="sm" sx={{ mt: 3 }}>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
          <form onSubmit={обработатьОтправку}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Название группы"
              name="name"
              value={данныеФормы.name}
              onChange={обработатьИзменение}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Предмет"
              name="subject"
              value={данныеФормы.subject}
              onChange={обработатьИзменение}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Преподаватель</InputLabel>
              <Select
                name="teacher"
                value={данныеФормы.teacher}
                onChange={обработатьИзменение}
                label="Преподаватель"
              >
                {преподаватели.map(преподаватель => (
                  <MenuItem key={преподаватель._id} value={преподаватель._id}>
                    {преподаватель.firstName} {преподаватель.lastName} - {преподаватель.subjects.join(', ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => навигатор('/groups')}
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

export default ДобавитьГруппу;
