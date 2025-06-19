import React, { useState, useEffect } from 'react';
import { Typography, Box, ToggleButtonGroup, ToggleButton, Grid, Card, CardContent } from '@mui/material';
import { Day as DayIcon, Week as WeekIcon, Month as MonthIcon } from '@mui/icons-material';
import axios from 'axios';

function Schedule() {
  const [view, setView] = useState('day');
  const [classrooms, setClassrooms] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchClassrooms();
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (classrooms.length > 0) {
      fetchScheduleData(view);
    }
  }, [view, classrooms]);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('/api/classrooms');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке кабинетов:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('/api/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке расписания:', error);
    }
  };

  const fetchScheduleData = async (selectedView) => {
    // Placeholder for fetching schedule based on view (day/week/month)
    // This will be updated based on backend API
    console.log(`Fetching schedule for ${selectedView} view`);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Расписание
      </Typography>
      <Box sx={{ mb: 4 }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view schedule"
        >
          <ToggleButton value="day" aria-label="day view">
            <DayIcon sx={{ mr: 1 }} />
            День
          </ToggleButton>
          <ToggleButton value="week" aria-label="week view">
            <WeekIcon sx={{ mr: 1 }} />
            Неделя
          </ToggleButton>
          <ToggleButton value="month" aria-label="month view">
            <MonthIcon sx={{ mr: 1 }} />
            Месяц
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Grid container spacing={3}>
        {classrooms.length > 0 ? (
          classrooms.map(classroom => (
            <Grid item xs={12} md={6} key={classroom._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Кабинет: {classroom.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Здесь будет отображаться расписание для кабинета в режиме {view === 'day' ? 'день' : view === 'week' ? 'неделя' : 'месяц'}.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              Кабинеты не найдены. Расписание недоступно.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Schedule;
