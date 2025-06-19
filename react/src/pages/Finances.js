import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, CardActions, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import api from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Finances() {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [payments, setPayments] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    fetchStudents();
    fetchGroups();
  }, [user]);

  useEffect(() => {
    if (selectedStudent) {
      fetchPayments(selectedStudent);
      fetchPaymentStatus(selectedStudent);
    }
  }, [selectedStudent, user]);

  useEffect(() => {
    if (selectedGroup) {
      fetchStudentsByGroup(selectedGroup);
    } else {
      fetchStudents();
    }
  }, [selectedGroup, user]);

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents();
      if (user && user.role === 'student') {
        // Students see only themselves
        setStudents(data.filter(student => student._id === user.referenceId));
        setSelectedStudent(user.referenceId);
      } else if (user && user.role === 'teacher') {
        // Teachers see students in their groups - placeholder
        setStudents(data);
      } else {
        setStudents(data); // Admin sees all
      }
    } catch (error) {
      console.error('Ошибка при загрузке учеников:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const data = await api.getGroups();
      if (user && user.role === 'teacher') {
        // Teachers see only their groups - placeholder
        setGroups(data);
      } else if (user && user.role === 'admin') {
        setGroups(data); // Admin sees all
      } else {
        setGroups([]); // Students don't see groups in finances
      }
    } catch (error) {
      console.error('Ошибка при загрузке групп:', error);
    }
  };

  const fetchStudentsByGroup = async (groupId) => {
    try {
      const groupData = await api.getGroups();
      const group = groupData.find(g => g._id === groupId);
      setStudents(group.students || []);
      setSelectedStudent('');
      setPayments([]);
      setPaymentStatus([]);
    } catch (error) {
      console.error('Ошибка при загрузке учеников по группе:', error);
    }
  };

  const fetchPayments = async (studentId) => {
    try {
      const data = await api.getPaymentReport({ studentId });
      setPayments(data);
      if (user && user.role === 'admin') {
        checkPaymentNotifications(data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке оплат:', error);
    }
  };

  const fetchPaymentStatus = async (studentId) => {
    try {
      const data = await api.getStudentPaymentStatus(studentId);
      setPaymentStatus(data || []);
      if (user && user.role === 'admin') {
        checkPaymentStatusNotifications(data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке статуса оплат:', error);
    }
  };

  const checkPaymentNotifications = (paymentsData) => {
    const totalLessons = paymentsData.reduce((acc, payment) => acc + (payment.cycleLessonsCount || 8), 0);
    if (totalLessons > 0 && totalLessons % 8 === 0 && paymentsData.length > 0 && !paymentsData[paymentsData.length - 1].confirmed) {
      setSnackbar({
        open: true,
        message: 'Необходимо подтвердить оплату за последний цикл из 8 занятий.',
        severity: 'warning'
      });
    }
  };

  const checkPaymentStatusNotifications = (statusData) => {
    const overduePayments = statusData.filter(status => !status.confirmed && new Date(status.cycleEndDate) < new Date());
    if (overduePayments.length > 0) {
      setSnackbar({
        open: true,
        message: 'Есть просроченные оплаты. Проверьте статус оплаты ученика.',
        severity: 'error'
      });
    }
  };

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      await api.confirmPayment(paymentId);
      setPayments(payments.map(payment => 
        payment._id === paymentId ? { ...payment, confirmed: true } : payment
      ));
      setSnackbar({
        open: true,
        message: 'Оплата успешно подтверждена.',
        severity: 'success'
      });
    } catch (error) {
      console.error('Ошибка при подтверждении оплаты:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при подтверждении оплаты.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Финансы
      </Typography>
      {user && user.role !== 'student' && (
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Выберите группу</InputLabel>
            <Select
              value={selectedGroup}
              onChange={handleGroupChange}
              label="Выберите группу"
            >
              <MenuItem value="">Все группы</MenuItem>
              {groups.map(group => (
                <MenuItem key={group._id} value={group._id}>
                  {group.name} - {group.subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} disabled={students.length === 0}>
            <InputLabel>Выберите ученика</InputLabel>
            <Select
              value={selectedStudent}
              onChange={handleStudentChange}
              label="Выберите ученика"
            >
              {students.map(student => (
                <MenuItem key={student._id} value={student._id}>
                  {student.firstName} {student.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      <Grid container spacing={3}>
        {selectedStudent ? (
          payments.length > 0 ? (
            payments.map(payment => (
              <Grid item xs={12} sm={6} key={payment._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Сумма: {payment.amount} ₽
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Дата оплаты: {new Date(payment.paymentDate).toLocaleDateString('ru-RU')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Цикл: {new Date(payment.cycleStartDate).toLocaleDateString('ru-RU')} - {new Date(payment.cycleEndDate).toLocaleDateString('ru-RU')}
                    </Typography>
                    <Typography variant="body2" color={payment.confirmed ? 'green' : 'red'}>
                      Статус: {payment.confirmed ? 'Подтверждено' : 'Ожидает подтверждения'}
                    </Typography>
                  </CardContent>
                  {user && user.role === 'admin' && !payment.confirmed && (
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={() => handleConfirmPayment(payment._id)}
                      >
                        Подтвердить
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                Оплаты для этого ученика не найдены.
              </Typography>
            </Grid>
          )
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              {user && user.role === 'student' ? 'Ваши финансовые данные отображаются автоматически.' : 'Выберите ученика для просмотра финансовой информации.'}
            </Typography>
          </Grid>
        )}
      </Grid>
      {user && user.role === 'admin' && (
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default Finances;
