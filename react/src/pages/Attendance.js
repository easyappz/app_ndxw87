import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, MenuItem, Select, InputLabel, FormControl, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import api from '../services/api';

function Attendance() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchStudents(selectedGroup);
      fetchAttendance(selectedGroup, date);
      fetchHighlightedDates(selectedGroup, currentMonth);
    }
  }, [selectedGroup, date, currentMonth]);

  const fetchGroups = async () => {
    try {
      const data = await api.getGroups();
      setGroups(data);
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
      const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).toISOString().split('T')[0].slice(0, 10);
      const data = await api.getAttendanceDates({
        groupId,
        startDate,
        endDate
      });
      const dates = data.map(record => new Date(record.date).toISOString().split('T')[0]);
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

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setCurrentMonth(newDate.slice(0, 7));
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
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          style={{ padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            style={{ padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {highlightedDates.length > 0 ? (
            highlightedDates.map((highlightedDate) => (
              <Button
                key={highlightedDate}
                variant={highlightedDate === date ? 'contained' : 'outlined'}
                onClick={() => setDate(highlightedDate)}
                sx={{ minWidth: 100 }}
              >
                {new Date(highlightedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </Button>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Нет данных о занятиях за выбранный месяц.
            </Typography>
          )}
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
