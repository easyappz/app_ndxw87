import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Container, Paper, Chip, OutlinedInput, MenuItem, Select } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';

function AddTeacher() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subjects: []
  });
  const [subjectInput, setSubjectInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectsChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, subjects: typeof value === 'string' ? value.split(',') : value });
  };

  const handleAddSubject = () => {
    if (subjectInput && !formData.subjects.includes(subjectInput)) {
      setFormData({ ...formData, subjects: [...formData.subjects, subjectInput] });
      setSubjectInput('');
    }
  };

  const handleDeleteSubject = (subjectToDelete) => () => {
    setFormData({ ...formData, subjects: formData.subjects.filter(subject => subject !== subjectToDelete) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/teachers', formData);
      navigate('/teachers');
    } catch (error) {
      console.error('Ошибка при добавлении преподавателя:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добавить преподавателя
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
              required
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
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Предметы
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Добавить предмет"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  sx={{ mr: 1 }}
                />
                <Button variant="outlined" onClick={handleAddSubject}>
                  Добавить
                </Button>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.subjects.map((subject) => (
                  <Chip
                    key={subject}
                    label={subject}
                    onDelete={handleDeleteSubject(subject)}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/teachers')}
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

export default AddTeacher;
