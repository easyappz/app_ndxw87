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

function Посещаемость() {
  const { пользователь } = useContext(AuthContext);
  const [группы, установитьГруппы] = useState([]);
  const [выбраннаяГруппа, установитьВыбраннуюГруппу] = useState('');
  const [ученики, установитьУчеников] = useState([]);
  const [данныеПосещаемости, установитьДанныеПосещаемости] = useState([]);
  const [подсвеченныеДаты, установитьПодсвеченныеДаты] = useState([]);
  const [дата, установитьДату] = useState(dayjs().format('YYYY-MM-DD'));
  const [текущийМесяц, установитьТекущийМесяц] = useState(dayjs().format('YYYY-MM'));

  useEffect(() => {
    получитьГруппы();
  }, [пользователь]);

  useEffect(() => {
    if (выбраннаяГруппа) {
      получитьУчеников(выбраннаяГруппа);
      получитьПосещаемость(выбраннаяГруппа, дата);
      получитьПодсвеченныеДаты(выбраннаяГруппа, текущийМесяц);
    }
  }, [выбраннаяГруппа, дата, текущийМесяц, пользователь]);

  const получитьГруппы = async () => {
    try {
      const данные = await api.getGroups();
      // Фильтрация групп на основе роли пользователя
      if (пользователь && пользователь.role === 'teacher') {
        // Преподаватели видят только свои группы - временное решение до реализации фильтрации на бэкенде
        установитьГруппы(данные); // Временное решение
      } else {
        установитьГруппы(данные); // Администратор видит все
      }
    } catch (ошибка) {
      console.error('Ошибка при загрузке групп:', ошибка);
    }
  };

  const получитьУчеников = async (идентификаторГруппы) => {
    try {
      const данныеГруппы = await api.getGroups();
      const группа = данныеГруппы.find(г => г._id === идентификаторГруппы);
      установитьУчеников(группа.students || []);
      const начальнаяПосещаемость = (группа.students || []).map(ученик => ({
        student: ученик._id,
        status: 'absent'
      }));
      установитьДанныеПосещаемости(начальнаяПосещаемость);
    } catch (ошибка) {
      console.error('Ошибка при загрузке учеников:', ошибка);
    }
  };

  const получитьПосещаемость = async (идентификаторГруппы, выбраннаяДата) => {
    try {
      const данные = await api.getAttendanceReport({
        groupId: идентификаторГруппы,
        startDate: выбраннаяДата,
        endDate: выбраннаяДата
      });
      if (данные.length > 0) {
        const существующиеДанные = данные.map(запись => ({
          student: запись.student._id,
          status: запись.status
        }));
        установитьДанныеПосещаемости(существующиеДанные);
      } else {
        установитьДанныеПосещаемости(ученики.map(ученик => ({
          student: ученик._id,
          status: 'absent'
        })));
      }
    } catch (ошибка) {
      console.error('Ошибка при загрузке данных о посещаемости:', ошибка);
    }
  };

  const получитьПодсвеченныеДаты = async (идентификаторГруппы, месяц) => {
    try {
      const начальнаяДата = `${месяц}-01`;
      const конечнаяДата = dayjs(начальнаяДата).add(1, 'month').format('YYYY-MM-DD');
      const данные = await api.getAttendanceDates({
        groupId: идентификаторГруппы,
        startDate: начальнаяДата,
        endDate: конечнаяДата
      });
      const даты = данные.map(запись => dayjs(запись.date).format('YYYY-MM-DD'));
      установитьПодсвеченныеДаты(даты);
    } catch (ошибка) {
      console.error('Ошибка при загрузке дат для подсветки:', ошибка);
    }
  };

  const обработатьИзменениеГруппы = (событие) => {
    установитьВыбраннуюГруппу(событие.target.value);
  };

  const обработатьИзменениеСтатуса = (идентификаторУченика, статус) => {
    установитьДанныеПосещаемости(данныеПосещаемости.map(запись => 
      запись.student === идентификаторУченика ? { ...запись, status: статус } : запись
    ));
  };

  const обработатьСохранение = async () => {
    try {
      for (const запись of данныеПосещаемости) {
        await api.createAttendance({
          student: запись.student,
          group: выбраннаяГруппа,
          date: new Date(дата),
          status: запись.status
        });
      }
      alert('Данные о посещаемости сохранены');
      получитьПодсвеченныеДаты(выбраннаяГруппа, текущийМесяц);
    } catch (ошибка) {
      console.error('Ошибка при сохранении данных о посещаемости:', ошибка);
    }
  };

  const обработатьИзменениеДаты = (новаяДата) => {
    const отформатированнаяДата = новаяДата.format('YYYY-MM-DD');
    установитьДату(отформатированнаяДата);
    установитьТекущийМесяц(новаяДата.format('YYYY-MM'));
  };

  const обработатьИзменениеМесяца = (новыйМесяц) => {
    установитьТекущийМесяц(новыйМесяц.format('YYYY-MM'));
  };

  const нужноПодсветитьДату = (день) => {
    const отформатированныйДень = день.format('YYYY-MM-DD');
    return подсвеченныеДаты.includes(отформатированныйДень);
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
            value={выбраннаяГруппа}
            onChange={обработатьИзменениеГруппы}
            label="Выберите группу"
          >
            {группы.map(группа => (
              <MenuItem key={группа._id} value={группа._id}>
                {группа.name} - {группа.subject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={обработатьСохранение}
          disabled={!выбраннаяГруппа || ученики.length === 0}
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
              value={dayjs(дата)}
              onChange={обработатьИзменениеДаты}
              onMonthChange={обработатьИзменениеМесяца}
              shouldDisableDate={(день) => !нужноПодсветитьДату(день) && !день.isSame(dayjs(дата), 'day')}
              slots={{
                day: ({ day, ...props }) => (
                  <Button
                    {...props}
                    sx={{
                      backgroundColor: нужноПодсветитьДату(day) ? '#ff4081' : 'transparent',
                      color: нужноПодсветитьДату(day) ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: нужноПодсветитьДату(day) ? '#e6005c' : 'rgba(0, 0, 0, 0.04)',
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
        {выбраннаяГруппа ? (
          ученики.length > 0 ? (
            ученики.map(ученик => {
              const записьПосещаемости = данныеПосещаемости.find(запись => запись.student === ученик._id);
              return (
                <Grid item xs={12} sm={6} key={ученик._id}>
                  <Card>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        {ученик.firstName} {ученик.lastName}
                      </Typography>
                      <Box>
                        <ToggleButtonGroup
                          value={записьПосещаемости ? записьПосещаемости.status : 'absent'}
                          exclusive
                          onChange={(e, значение) => обработатьИзменениеСтатуса(ученик._id, значение || 'absent')}
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

export default Посещаемость;
