import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Container, IconButton, Divider, Button } from '@mui/material';
import { Dashboard as DashboardIcon, MeetingRoom as MeetingRoomIcon, Person as PersonIcon, Group as GroupIcon, School as SchoolIcon, CalendarToday as CalendarTodayIcon, CheckCircle as CheckCircleIcon, AttachMoney as AttachMoneyIcon, Security as SecurityIcon, Logout as LogoutIcon } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ширинаМеню = 240;

function Макет() {
  const { пользователь, выйти } = useContext(AuthContext);
  const навигатор = useNavigate();
  const [мобильноеМенюОткрыто, установитьМобильноеМенюОткрыто] = React.useState(false);

  const переключитьМеню = () => {
    установитьМобильноеМенюОткрыто(!мобильноеМенюОткрыто);
  };

  const обработатьВыход = () => {
    выйти();
    навигатор('/login');
  };

  // Определение пунктов меню на основе роли пользователя
  const пунктыМеню = пользователь ? [
    { текст: 'Панель управления', иконка: <DashboardIcon />, путь: '/', роли: ['admin', 'teacher', 'student'] },
    { текст: 'Кабинеты', иконка: <MeetingRoomIcon />, путь: '/classrooms', роли: ['admin'] },
    { текст: 'Преподаватели', иконка: <PersonIcon />, путь: '/teachers', роли: ['admin'] },
    { текст: 'Группы', иконка: <GroupIcon />, путь: '/groups', роли: ['admin', 'teacher'] },
    { текст: 'Ученики', иконка: <SchoolIcon />, путь: '/students', роли: ['admin', 'teacher'] },
    { текст: 'Расписание', иконка: <CalendarTodayIcon />, путь: '/schedule', роли: ['admin', 'teacher', 'student'] },
    { текст: 'Посещаемость', иконка: <CheckCircleIcon />, путь: '/attendance', роли: ['admin', 'teacher'] },
    { текст: 'Финансы', иконка: <AttachMoneyIcon />, путь: '/finances', роли: ['admin'] },
    { текст: 'Управление доступом', иконка: <SecurityIcon />, путь: '/access-control', роли: ['admin'] }
  ].filter(элемент => элемент.роли.includes(пользователь.role)) : [];

  const меню = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Prof-IT
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {пунктыМеню.map((элемент) => (
          <ListItem key={элемент.текст} disablePadding>
            <ListItemButton component={Link} to={элемент.путь}>
              <ListItemIcon>
                {элемент.иконка}
              </ListItemIcon>
              <ListItemText primary={элемент.текст} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1976d2',
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="открыть меню"
            edge="start"
            onClick={переключитьМеню}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#ffffff', flexGrow: 1 }}>
            Prof-IT - Управление школой
          </Typography>
          {пользователь && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#ffffff' }}>
                {пользователь.firstName} {пользователь.lastName} ({пользователь.role})
              </Typography>
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={обработатьВыход}
                sx={{ color: '#ffffff' }}
              >
                Выйти
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: ширинаМеню }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={мобильноеМенюОткрыто}
          onClose={переключитьМеню}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: ширинаМеню },
            display: { xs: 'block', sm: 'none' },
          }}
        >
          {меню}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: ширинаМеню },
            display: { xs: 'none', sm: 'block' },
          }}
          open
        >
          {меню}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%', mt: 8 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default Макет;
