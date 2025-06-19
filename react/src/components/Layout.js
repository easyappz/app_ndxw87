import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Container, IconButton, Divider } from '@mui/material';
import { Dashboard as DashboardIcon, MeetingRoom as MeetingRoomIcon, Person as PersonIcon, Group as GroupIcon, School as SchoolIcon, CalendarToday as CalendarTodayIcon, CheckCircle as CheckCircleIcon, AttachMoney as AttachMoneyIcon, Security as SecurityIcon } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

const menuItems = [
  { text: 'Дашборд', icon: <DashboardIcon />, path: '/' },
  { text: 'Кабинеты', icon: <MeetingRoomIcon />, path: '/classrooms' },
  { text: 'Преподаватели', icon: <PersonIcon />, path: '/teachers' },
  { text: 'Группы', icon: <GroupIcon />, path: '/groups' },
  { text: 'Ученики', icon: <SchoolIcon />, path: '/students' },
  { text: 'Расписание', icon: <CalendarTodayIcon />, path: '/schedule' },
  { text: 'Посещаемость', icon: <CheckCircleIcon />, path: '/attendance' },
  { text: 'Финансы', icon: <AttachMoneyIcon />, path: '/finances' },
  { text: 'Управление доступом', icon: <SecurityIcon />, path: '/access-control' }
];

function Layout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Prof-IT
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
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
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#ffffff' }}>
            Prof-IT - Управление школой
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            display: { xs: 'block', sm: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            display: { xs: 'none', sm: 'block' },
          }}
          open
        >
          {drawer}
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

export default Layout;
