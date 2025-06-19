import React, { useState, useEffect } from 'react';
import { Typography, Box, ToggleButtonGroup, ToggleButton, Grid, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { Today as TodayIcon, ViewWeek as ViewWeekIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
import api from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Schedule() {
  const { user } = useContext(AuthContext);
  const [view, setView] = useState('day');
  const [classrooms, setClassrooms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [scheduleData, setScheduleData] = useState({});
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  useEffect(() => {
    fetchClassrooms();
    fetchSchedules();
  }, [user]);

  useEffect(() => {
    if (classrooms.length > 0) {
      fetchScheduleData(view);
    }
  }, [view, classrooms, user]);

  useEffect(() => {
    filterSchedules();
  }, [schedules, user]);

  const fetchClassrooms = async () => {
    try {
      if (user && user.role === 'admin') {
        const data = await api.getClassrooms();
        setClassrooms(data);
      } else {
        setClassrooms([]); // For non-admin, we'll show schedules directly
      }
    } catch (error) {
      console.error('Ошибка при загрузке кабинетов:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const data = await api.getSchedules();
      setSchedules(data);
      filterSchedules(data);
    } catch (error) {
      console.error('Ошибка при загрузке расписания:', error);
    }
  };

  const filterSchedules = (data = schedules) => {
    if (user) {
      if (user.role === 'student') {
        // Students see schedules for their groups
        // This is a placeholder until backend provides filtering
        setFilteredSchedules(data); // Temporary
      } else if (user.role === 'teacher') {
        // Teachers see schedules for their groups
        setFilteredSchedules(data); // Temporary
      } else {
        setFilteredSchedules(data); // Admin sees all
      }
    } else {
      setFilteredSchedules([]);
    }
  };

  const fetchScheduleData = async (selectedView) => {
    try {
      const data = {};
      for (const classroom of classrooms) {
        const schedule = await api.getClassroomSchedule(classroom._id, selectedView);
        data[classroom._id] = schedule;
      }
      setScheduleData(data);
    } catch (error) {
      console.error(`Ошибка при загрузке расписания для вида ${selectedView}:`, error);
    }
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const renderSchedule = (classroomId) => {
    const data = scheduleData[classroomId];
    if (!data) return <Typography variant="body2" color="text.secondary">Нет данных</Typography>;

    if (view === 'day' && data.days && data.days.length > 0) {
      return (
        <List dense>
          {data.days.map((day, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={day.dayOfWeek}
                secondary={day.timeSlots.map(slot => `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`).join(', ')}
              />
            </ListItem>
          ))}
        </List>
      );
    } else if (view === 'week' && data.weeks && data.weeks.length > 0) {
      return (
        <List dense>
          {data.weeks.map((week, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Неделя ${week.weekNumber}`}
                secondary={week.days.map(day => `${day.dayOfWeek}: ${day.timeSlots.map(slot => `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`).join(', ')}`).join('; ')}
              />
            </ListItem>
          ))}
        </List>
      );
    } else if (view === 'month' && data.months && data.months.length > 0) {
      return (
        <List dense>
          {data.months.map((month, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={month.month}
                secondary={month.days.map(day => `${new Date(day.date).toLocaleDateString('ru-RU')}: ${day.timeSlots.map(slot => `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`).join(', ')}`).join('; ')}
              />
            </ListItem>
          ))}
        </List>
      );
    }
    return <Typography variant="body2" color="text.secondary">Расписание отсутствует</Typography>;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Расписание
      </Typography>
      {user && user.role === 'admin' && (
        <Box sx={{ mb: 4 }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view schedule"
          >
            <ToggleButton value="day" aria-label="day view">
              <TodayIcon sx={{ mr: 1 }} />
              День
            </ToggleButton>
            <ToggleButton value="week" aria-label="week view">
              <ViewWeekIcon sx={{ mr: 1 }} />
              Неделя
            </ToggleButton>
            <ToggleButton value="month" aria-label="month view">
              <CalendarMonthIcon sx={{ mr: 1 }} />
              Месяц
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
      <Grid container spacing={3}>
        {user && user.role === 'admin' ? (
          classrooms.length > 0 ? (
            classrooms.map(classroom => (
              <Grid item xs={12} md={6} key={classroom._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Кабинет: {classroom.name}
                    </Typography>
                    {renderSchedule(classroom._id)}
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
          )
        ) : (
          filteredSchedules.length > 0 ? (
            filteredSchedules.map(schedule => (
              <Grid item xs={12} md={6} key={schedule._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Группа: {schedule.group ? schedule.group.name : 'Не указана'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Кабинет: {schedule.classroom ? schedule.classroom.name : 'Не указан'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Время: {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      День: {schedule.dayOfWeek || 'Не указан'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                Расписание не найдено.
              </Typography>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
}

export default Schedule;
