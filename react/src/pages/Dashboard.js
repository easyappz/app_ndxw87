import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, CardHeader, Grid, Divider, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { People as PeopleIcon, Class as ClassIcon, Room as RoomIcon, MonetizationOn as MonetizationOnIcon, Event as EventIcon } from '@mui/icons-material';
import api from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function StatCard({ title, value, icon, color }) {
  return (
    <Card sx={{ backgroundColor: color, color: 'white', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 2 }}>{icon}</Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function ActivityList({ activities, loading, error, role }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (activities.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
        Нет недавних событий.
      </Typography>
    );
  }

  return (
    <List>
      {activities.map((activity, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemText
              primary={activity.description}
              secondary={new Date(activity.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            />
          </ListItem>
          {index < activities.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
}

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({
    students: 0,
    teachers: 0,
    groups: 0,
    attendance: { present: 0, absent: 0, late: 0 },
    payments: { total: 0, confirmed: 0 }
  });
  const [activities, setActivities] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorSummary, setErrorSummary] = useState(null);
  const [errorActivities, setErrorActivities] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        const response = await api.getDashboardSummary();
        setSummary(response);
        setErrorSummary(null);
      } catch (err) {
        setErrorSummary('Не удалось загрузить сводные данные.');
        console.error(err);
      } finally {
        setLoadingSummary(false);
      }
    };

    const fetchActivities = async () => {
      try {
        setLoadingActivities(true);
        const response = await api.getRecentActivities();
        setActivities(response);
        setErrorActivities(null);
      } catch (err) {
        setErrorActivities('Не удалось загрузить последние события.');
        console.error(err);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchSummary();
    if (user && user.role !== 'student') {
      fetchActivities();
    } else {
      setLoadingActivities(false);
      setErrorActivities('Access to activities is restricted for students.');
    }
  }, [user]);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Дашборд
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ color: '#666', mb: 3 }}>
        Обзор текущего состояния школы
      </Typography>
      <Box sx={{ mt: 4 }}>
        {loadingSummary ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : errorSummary ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorSummary}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Учеников" value={summary.students} icon={<PeopleIcon fontSize="large" />} color="#1976d2" />
            </Grid>
            {user && user.role === 'admin' && (
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Учителей" value={summary.teachers} icon={<PeopleIcon fontSize="large" />} color="#ff4081" />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Групп" value={summary.groups} icon={<ClassIcon fontSize="large" />} color="#4caf50" />
            </Grid>
            {user && user.role === 'admin' && (
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Доход (подтвержденный)" value={`${summary.payments.confirmed} ₽`} icon={<MonetizationOnIcon fontSize="large" />} color="#ff9800" />
              </Grid>
            )}
          </Grid>
        )}
      </Box>
      {user && user.role !== 'student' && (
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <CardHeader
                  title="Последние события"
                  avatar={<EventIcon sx={{ color: '#1976d2' }} />}
                  titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                />
                <CardContent sx={{ p: 0 }}>
                  <ActivityList activities={activities} loading={loadingActivities} error={errorActivities} role={user.role} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <CardHeader
                  title="Статистика посещаемости (месяц)"
                  avatar={<EventIcon sx={{ color: '#4caf50' }} />}
                  titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                />
                <CardContent>
                  {loadingSummary ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : errorSummary ? (
                    <Alert severity="error">{errorSummary}</Alert>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="green">{summary.attendance.present}</Typography>
                        <Typography variant="body2" color="text.secondary">Присутствовали</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="red">{summary.attendance.absent}</Typography>
                        <Typography variant="body2" color="text.secondary">Отсутствовали</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="orange">{summary.attendance.late}</Typography>
                        <Typography variant="body2" color="text.secondary">Опоздали</Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
