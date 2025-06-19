import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Container, Paper, Chip } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import api from '../services/api';

function ДобавитьПреподавателя() {
  const навигатор = useNavigate();
  const [данныеФормы, установитьДанныеФормы] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subjects: []
  });
  const [вводПредмета, установитьВводПредмета] = useState('');

  const обработатьИзменение = (e) => {
    const { name, value } = e.target;
    установитьДанныеФормы({ ...данныеФормы, [name]: value });
  };

  const обработатьДобавлениеПредмета = () => {
    if (вводПредмета && !данныеФормы.subjects.includes(вводПредмета)) {
      установитьДанныеФормы({ ...данныеФормы, subjects: [...данныеФормы.subjects, вводПредмета] });
      установитьВводПредмета('');
    }
  };

  const обработатьУдалениеПредмета = (удаляемыйПредмет) => () => {
    установитьДанныеФормы({ ...данныеФормы, subjects: данныеФормы.subjects.filter(предмет => предмет !== удаляемыйПредмет) });
  };

  const обработатьОтправку = async (e) => {
    e.preventDefault();
    try {
      await api.createTeacher(данныеФормы);
      навигатор('/teachers');
    } catch (ошибка) {
      console.error('Ошибка при добавлении преподавателя:', ошибка);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добавить преподавателя
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
              required
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
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Предметы
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Добавить предмет"
                  value={вводПредмета}
                  onChange={(e) => установитьВводПредмета(e.target.value)}
                  sx={{ mr: 1 }}
                />
                <Button variant="outlined" onClick={обработатьДобавлениеПредмета}>
                  Добавить
                </Button>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {данныеФормы.subjects.map((предмет) => (
                  <Chip
                    key={предмет}
                    label={предмет}
                    onDelete={обработатьУдалениеПредмета(предмет)}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => навигатор('/teachers')}
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

export default ДобавитьПреподавателя;
