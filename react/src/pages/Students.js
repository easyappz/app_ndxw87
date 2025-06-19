import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, CardActions, IconButton, Alert } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Students() {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    try {
      setError(null);
      const data = await api.getStudents();
      // Filter students for non-admin users
      if (user && user.role === 'teacher') {
        // Teachers should only see students in their groups
        // This is a placeholder; actual filtering depends on backend implementation
        setStudents(data); // Temporary until backend filtering is implemented
      } else if (user && user.role === 'student') {
        // Students should only see their own data
        const studentData = data.filter(student => student._id === user.referenceId);
        setStudents(studentData);
      } else {
        setStudents(data);
      }
    } catch (error) {
      setError('Ошибка при загрузке учеников. Пожалуйста, попробуйте позже.');
      console.error('Ошибка при загрузке учеников:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteStudent(id);
      setStudents(students.filter(student => student._id !== id));
    } catch (error) {
      console.error('Ошибка при удалении ученика:', error);
      setError('Не удалось удалить ученика. Пожалуйста, попробуйте снова.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/students/edit/${id}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Ученики</Typography>
        {user && user.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/students/add"
          >
            Добавить ученика
          </Button>
        )}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
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
                  {user && user.role === 'admin' && (
                    <Typography variant="body2" color="text.secondary">
                      Баланс: {student.balance} ₽
                    </Typography>
                  )}
                </CardContent>
                {user && user.role === 'admin' && (
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
                )}
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              Ученики не найдены. {user && user.role === 'admin' && 'Добавьте нового ученика.'}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Students;
