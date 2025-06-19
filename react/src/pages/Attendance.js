import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, MenuItem, Select, InputLabel, FormControl, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import api from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Attendance() {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));

  useEffect(() => {
    fetchGroups();
  }, [user]);

  useEffect(() => {
    if (selectedGroup) {
      fetchStudents(selectedGroup);
      fetchAttendance(selectedGroup, date);
      fetchHighlightedDates(selectedGroup, currentMonth);
    }
  }, [selectedGroup, date, currentMonth, user]);

  const fetchGroups = async () => {
    try {
      const data = await api.getGroups();
      // Filter groups based on user role
      if (user && user.role === 'teacher') {
        // Teachers see only their groups - placeholder until backend implements filtering
        setGroups(data); // Temporary
      } else {
        setGroups(data); // Admin sees all
      }
    } catch (error) {
      console.error('Ошибка при загрузке групп:', error);
    }
  };

  const fetchStudents = async (groupId) => {
    try {
      const groupData = await api.getGroups();
      const group = groupData.find(g => g._id === groupId);
      setStudents(group.students || []);
      const initialAttendance = (group.students || []).map(student => ({
        student: student._id,
        status: 'absent'
      }));
      setAttendanceData(initialAttendance);
    } catch (error) {
      console.error('Ошибка при загрузке учеников:', error);
    }
  };

  const fetchAttendance = async (groupId, selectedDate) => {
    try {
      const data = await api.getAttendanceReport({
        groupId,
        startDate: selectedDate,
        endDate: selectedDate
      });
      if (data.length > 0) {
        const existingData = data.map(record => ({
          student: record.student._id,
          status: record.status
        }));
        setAttendanceData(existingData);
      } else {
        setAttendanceData(students.map(student => ({
          student: student._id,
          status: 'absent'
        })));
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных о посещаемости:', error);
    }
  };

  const fetchHighlightedDates = async (groupId, month) => {
    try {
      const startDate = `${month}-01`;
      const endDate = dayjs(startDate).add(1, 'month').format('YYYY-MM-DD');
      const data = await api.getAttendanceDates({
        groupId,
        startDate,
        endDate
      });
      const dates = data.map(record => dayjs(record.date).format('YYYY-MM-DD'));
      setHighlightedDates(dates);
    } catch (error) {
      console.error('Ошибка при загрузке дат для подсветки:', error);
    }
  };

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(attendanceData.map(record => 
      record.student === studentId ? { ...record, status } : record
    ));
  };

  const handleSave = async () => {
    try {
      for (const record of attendanceData) {
        await api.createAttendance({
          student: record.student,
          group: selectedGroup,
          date: new Date(date),
          status: record.status
        });
      }
      alert('Данные о посещаемости сохранены');
      fetchHighlightedDates(selectedGroup, currentMonth);
    } catch (error) {
      console.error('Ошибка при сохранении данных о посещаемости:', error);
    }
  };

  const handleDateChange = (newDate) => {
    const formattedDate = newDate.format('YYYY-MM-DD');
    setDate(formattedDate);
    setCurrentMonth(newDate.format('YYYY-MM'));
  };

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth.format('YYYY-MM'));
  };

  const shouldHighlightDate = (day) => {
    const formattedDay = day.format('YYYY-MM-DD');
    return highlightedDates.includes(formattedDay);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Посещаемость
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Выберите группу</InputLabel>
          <Select
            value={selectedGroup}
            onChange={handleGroupChange}
            label="Выберите группу"
          >
            {groups.map(group => (
              <MenuItem key={group._id} value={group._id}>
                {group.name} - {group.subject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!selectedGroup || students.length === 0}
        >
          Сохранить
        </Button>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Календарь занятий
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DateCalendar
              value={dayjs(date)}
              onChange={handleDateChange}
              onMonthChange={handleMonthChange}
              shouldDisableDate={(day) => !shouldHighlightDate(day) && !day.isSame(dayjs(date), 'day')}
              slots={{
                day: ({ day, ...props }) => (
                  <Button
                    {...props}
                    sx={{
                      backgroundColor: shouldHighlightDate(day) ? '#ff4081' : 'transparent',
                      color: shouldHighlightDate(day) ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: shouldHighlightDate(day) ? '#e6005c' : 'rgba(0, 0, 0, 0.04)',
                      },
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      minWidth: 36,
                    }}
                  >
                    {day.date()}
                  </Button>
                ),
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {selectedGroup ? (
          students.length > 0 ? (
            students.map(student => {
              const attendanceRecord = attendanceData.find(record => record.student === student._id);
              return (
                <Grid item xs={12} sm={6} key={student._id}>
                  <Card>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        {student.firstName} {student.lastName}
                      </Typography>
                      <Box>
                        <ToggleButtonGroup
                          value={attendanceRecord ? attendanceRecord.status : 'absent'}
                          exclusive
                          onChange={(e, value) => handleStatusChange(student._id, value || 'absent')}
                          size="small"
                        >
                          <ToggleButton value="present" sx={{ color: 'green' }}>Присутствует</ToggleButton>
                          <ToggleButton value="absent" sx={{ color: 'red' }}>Отсутствует</ToggleButton>
                          <ToggleButton value="late" sx={{ color: 'orange' }}>Опоздал</ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                В этой группе нет учеников.
              </Typography>
            </Grid>
          )
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              Выберите группу для учета посещаемости.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Attendance;
