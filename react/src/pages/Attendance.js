import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';

function Attendance() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchStudents(selectedGroup);
      fetchAttendance(selectedGroup, date);
    }
  }, [selectedGroup, date]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке групп:', error);
    }
  };

  const fetchStudents = async (groupId) => {
    try {
      const response = await axios.get(`/api/groups/${groupId}`);
      setStudents(response.data.students || []);
      const initialAttendance = response.data.students.map(student => ({
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
      const response = await axios.get(`/api/reports/attendance?groupId=${groupId}&startDate=${selectedDate}&endDate=${selectedDate}`);
      if (response.data.length > 0) {
        const existingData = response.data.map(record => ({
          student: record.student._id,
          status: record.status
        }));
        setAttendanceData(existingData);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных о посещаемости:', error);
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
        await axios.post('/api/attendances', {
          student: record.student,
          group: selectedGroup,
          date: new Date(date),
          status: record.status
        });
      }
      alert('Данные о посещаемости сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении данных о посещаемости:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Посещаемость
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
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
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!selectedGroup}
        >
          Сохранить
        </Button>
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
