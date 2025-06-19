import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Teachers() {
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/teachers/${id}`);
      setTeachers(teachers.filter(teacher => teacher._id !== id));
    } catch (error) {
      console.error('Ошибка при удалении преподавателя:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Преподаватели</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/teachers/add"
        >
          Добавить преподавателя
        </Button>
      </Box>
      <Grid container spacing={3}>
        {teachers.length > 0 ? (
          teachers.map(teacher => (
            <Grid item xs={12} sm={6} md={4} key={teacher._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {teacher.firstName} {teacher.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {teacher.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Телефон: {teacher.phone || 'Не указан'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Предметы: {teacher.subjects.join(', ') || 'Не указаны'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(teacher._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              Преподаватели не найдены. Добавьте нового преподавателя.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Teachers;
