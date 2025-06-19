import React from 'react';
import { Typography, Box, Card, CardContent, CardHeader, Grid } from '@mui/material';
import { People as PeopleIcon, Class as ClassIcon, Room as RoomIcon, MonetizationOn as MonetizationOnIcon } from '@mui/icons-material';

function StatCard({ title, value, icon, color }) {
  return (
    <Card sx={{ backgroundColor: color, color: 'white', height: '100%' }}>
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

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Дашборд
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Обзор текущего состояния школы
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Учеников" value="120" icon={<PeopleIcon fontSize="large" />} color="#1976d2" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Групп" value="15" icon={<ClassIcon fontSize="large" />} color="#ff4081" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Кабинетов" value="8" icon={<RoomIcon fontSize="large" />} color="#4caf50" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Доход" value="240,000 ₽" icon={<MonetizationOnIcon fontSize="large" />} color="#ff9800" />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Последние события" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Здесь будут отображаться последние события в системе.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Напоминания" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Здесь будут отображаться напоминания о предстоящих занятиях и оплатах.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;
