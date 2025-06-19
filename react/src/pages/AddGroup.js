import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Container, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';

function AddGroup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    teacher: ''
  });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке преподавателей:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/groups', formData);
      navigate('/groups');
    } catch (error) {
      console.error('Ошибка при добавлении группы:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добавить группу
      </Typography>
      <Container component="main" maxWidth="sm" sx={{ mt: 3 }}>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Название группы"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Предмет"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Преподаватель</InputLabel>
              <Select
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                label="Преподаватель"
              >
                {teachers.map(teacher => (
                  <MenuItem key={teacher._id} value={teacher._id}>
                    {teacher.firstName} {teacher.lastName} - {teacher.subjects.join(', ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/groups')}
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

export default AddGroup;
