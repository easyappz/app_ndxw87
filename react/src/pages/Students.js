import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Students() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Ошибка при загрузке учеников:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteStudent(id);
      setStudents(students.filter(student => student._id !== id));
    } catch (error) {
      console.error('Ошибка при удалении ученика:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/students/edit/${id}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Ученики</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/students/add"
        >
          Добавить ученика
        </Button>
      </Box>
      <Grid container spacing={3}>
        {students.length > 0 ? (
          students.map(student => (
            <Grid item xs={12} sm={6} md={4} key={student._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {student.firstName} {student.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {student.email || 'Не указан'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Телефон: {student.phone || 'Не указан'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Баланс: {student.balance} ₽
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton 
                    size="small" 
                    sx={{ mr: 1 }} 
                    onClick={() => handleEdit(student._id)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(student._id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              Ученики не найдены. Добавьте нового ученика.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Students;
