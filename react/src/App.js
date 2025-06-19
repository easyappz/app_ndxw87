import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from './ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Classrooms from './pages/Classrooms';
import AddClassroom from './pages/AddClassroom';
import Teachers from './pages/Teachers';
import AddTeacher from './pages/AddTeacher';
import Groups from './pages/Groups';
import AddGroup from './pages/AddGroup';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import Schedule from './pages/Schedule';
import Attendance from './pages/Attendance';
import Finances from './pages/Finances';
import AccessControl from './pages/AccessControl';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="classrooms" element={<Classrooms />} />
            <Route path="classrooms/add" element={<AddClassroom />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="teachers/add" element={<AddTeacher />} />
            <Route path="groups" element={<Groups />} />
            <Route path="groups/add" element={<AddGroup />} />
            <Route path="students" element={<Students />} />
            <Route path="students/add" element={<AddStudent />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="finances" element={<Finances />} />
            <Route path="access-control" element={<AccessControl />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
