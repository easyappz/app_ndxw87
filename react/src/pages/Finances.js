import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, CardActions, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import axios from 'axios';

function Finances() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchPayments(selectedStudent);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке учеников:', error);
    }
  };

  const fetchPayments = async (studentId) => {
    try {
      const response = await axios.get(`/api/reports/payments?studentId=${studentId}`);
      setPayments(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке оплат:', error);
    }
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      await axios.post(`/api/payments/${paymentId}/confirm`);
      setPayments(payments.map(payment => 
        payment._id === paymentId ? { ...payment, confirmed: true } : payment
      ));
      alert('Оплата подтверждена');
    } catch (error) {
      console.error('Ошибка при подтверждении оплаты:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Финансы
      </Typography>
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
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
                  {!payment.confirmed && (
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
              Выберите ученика для просмотра финансовой информации.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Finances;
