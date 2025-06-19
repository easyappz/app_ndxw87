import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('/api/classrooms');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке кабинетов:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/classrooms/${id}`);
      setClassrooms(classrooms.filter(classroom => classroom._id !== id));
    } catch (error) {
      console.error('Ошибка при удалении кабинета:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Кабинеты</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/classrooms/add"
        >
          Добавить кабинет
        </Button>
      </Box>
      <Grid container spacing={3}>
        {classrooms.length > 0 ? (
          classrooms.map(classroom => (
            <Grid item xs={12} sm={6} md={4} key={classroom._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {classroom.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Вместимость: {classroom.capacity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Расположение: {classroom.location || 'Не указано'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Описание: {classroom.description || 'Нет описания'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(classroom._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              Кабинеты не найдены. Добавьте новый кабинет.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Classrooms;
