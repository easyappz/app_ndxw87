import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Groups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке групп:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/groups/${id}`);
      setGroups(groups.filter(group => group._id !== id));
    } catch (error) {
      console.error('Ошибка при удалении группы:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Группы</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/groups/add"
        >
          Добавить группу
        </Button>
      </Box>
      <Grid container spacing={3}>
        {groups.length > 0 ? (
          groups.map(group => (
            <Grid item xs={12} sm={6} md={4} key={group._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {group.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Предмет: {group.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Преподаватель: {group.teacher ? `${group.teacher.firstName} ${group.teacher.lastName}` : 'Не назначен'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Учеников: {group.students.length}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(group._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              Группы не найдены. Добавьте новую группу.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Groups;
