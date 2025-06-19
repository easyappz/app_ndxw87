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
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Layout />}>
              <Route 
                index 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="classrooms" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Classrooms />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="classrooms/add" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AddClassroom />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="teachers" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Teachers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="teachers/add" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AddTeacher />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="groups" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <Groups />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="groups/add" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AddGroup />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="students" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <Students />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="students/add" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AddStudent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="schedule" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                    <Schedule />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="attendance" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                    <Attendance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="finances" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Finances />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="access-control" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AccessControl />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
