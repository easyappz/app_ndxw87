import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = '/';

const УправлениеДоступом = () => {
  const [пользователи, установитьПользователей] = useState([]);
  const [загрузка, установитьЗагрузку] = useState(true);
  const [ошибка, установитьОшибку] = useState(null);
  const [выбранныйПользователь, установитьВыбранногоПользователя] = useState(null);
  const [роль, установитьРоль] = useState('');
  const [праваДоступа, установитьПраваДоступа] = useState([]);
  const [ссылочныйИдентификатор, установитьСсылочныйИдентификатор] = useState('');
  const [ссылочнаяМодель, установитьСсылочнуюМодель] = useState('');
  const [загрузкаОбновления, установитьЗагрузкуОбновления] = useState(false);
  const [ошибкаОбновления, установитьОшибкуОбновления] = useState(null);
  const [успехОбновления, установитьУспехОбновления] = useState(false);

  useEffect(() => {
    получитьПользователей();
  }, []);

  const получитьПользователей = async () => {
    try {
      установитьЗагрузку(true);
      установитьОшибку(null);
      const ответ = await axios.get(`${API_URL}api/access/users`);
      установитьПользователей(ответ.data);
      установитьЗагрузку(false);
    } catch (ошибка) {
      установитьОшибку('Не удалось загрузить пользователей. Попробуйте позже.');
      установитьЗагрузку(false);
      console.error(ошибка);
    }
  };

  const обработатьВыборПользователя = (пользователь) => {
    установитьВыбранногоПользователя(пользователь);
    установитьРоль(пользователь.role);
    установитьПраваДоступа(пользователь.permissions);
    установитьСсылочныйИдентификатор(пользователь.referenceId || '');
    установитьСсылочнуюМодель(пользователь.referenceModel || '');
    установитьУспехОбновления(false);
    установитьОшибкуОбновления(null);
  };

  const обработатьИзменениеРоли = (событие) => {
    установитьРоль(событие.target.value);
  };

  const обработатьИзменениеСсылочнойМодели = (событие) => {
    установитьСсылочнуюМодель(событие.target.value);
  };

  const обработатьОбновление = async () => {
    if (!выбранныйПользователь) return;

    try {
      установитьЗагрузкуОбновления(true);
      установитьОшибкуОбновления(null);
      установитьУспехОбновления(false);

      // Обновление роли
      await axios.put(`${API_URL}api/access/users/${выбранныйПользователь._id}/role`, { role: роль });

      // Обновление прав доступа
      await axios.put(`${API_URL}api/access/users/${выбранныйПользователь._id}/permissions`, { permissions: праваДоступа });

      // Обновление ссылки
      if (ссылочныйИдентификатор && ссылочнаяМодель) {
        await axios.put(`${API_URL}api/access/users/${выбранныйПользователь._id}/reference`, { referenceId: ссылочныйИдентификатор, referenceModel: ссылочнаяМодель });
      }

      установитьУспехОбновления(true);
      установитьЗагрузкуОбновления(false);

      // Обновление списка пользователей
      const ответ = await axios.get(`${API_URL}api/access/users`);
      установитьПользователей(ответ.data);
    } catch (ошибка) {
      установитьОшибкуОбновления('Не удалось обновить данные пользователя. Попробуйте снова.');
      установитьЗагрузкуОбновления(false);
      console.error(ошибка);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SecurityIcon fontSize="large" />
        Управление доступом
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {загрузка ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : ошибка ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {ошибка}
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Имя</TableCell>
                  <TableCell>Фамилия</TableCell>
                  <TableCell>Роль</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {пользователи.map((пользователь) => (
                  <TableRow key={пользователь._id} hover onClick={() => обработатьВыборПользователя(пользователь)} selected={выбранныйПользователь && выбранныйПользователь._id === пользователь._id}>
                    <TableCell>{пользователь.email}</TableCell>
                    <TableCell>{пользователь.firstName}</TableCell>
                    <TableCell>{пользователь.lastName}</TableCell>
                    <TableCell>{пользователь.role}</TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => обработатьВыборПользователя(пользователь)}>
                        Редактировать
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {выбранныйПользователь && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Редактировать пользователя: {выбранныйПользователь.email}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Роль</InputLabel>
              <Select value={роль} onChange={обработатьИзменениеРоли} label="Роль">
                <MenuItem value="admin">Администратор</MenuItem>
                <MenuItem value="teacher">Преподаватель</MenuItem>
                <MenuItem value="student">Ученик</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Ссылочный ID"
              value={ссылочныйИдентификатор}
              onChange={(e) => установитьСсылочныйИдентификатор(e.target.value)}
              disabled={роль === 'admin'}
            />

            <FormControl fullWidth margin="normal" disabled={роль === 'admin'}>
              <InputLabel>Ссылочная модель</InputLabel>
              <Select value={ссылочнаяМодель} onChange={обработатьИзменениеСсылочнойМодели} label="Ссылочная модель">
                <MenuItem value="Teacher">Преподаватель</MenuItem>
                <MenuItem value="Student">Ученик</MenuItem>
              </Select>
            </FormControl>

            {ошибкаОбновления && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {ошибкаОбновления}
              </Alert>
            )}

            {успехОбновления && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Данные пользователя успешно обновлены!
              </Alert>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={обработатьОбновление}
                disabled={загрузкаОбновления}
              >
                {загрузкаОбновления ? <CircularProgress size={24} /> : 'Обновить'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => установитьВыбранногоПользователя(null)}
                disabled={загрузкаОбновления}
              >
                Отмена
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default УправлениеДоступом;
