import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '/';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [пользователь, установитьПользователя] = useState(null);
  const [загрузка, установитьЗагрузку] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли токен в локальном хранилище и получаем данные пользователя
    const токен = localStorage.getItem('token');
    if (токен) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${токен}`;
      получитьПрофильПользователя();
    } else {
      установитьЗагрузку(false);
    }
  }, []);

  const получитьПрофильПользователя = async () => {
    try {
      установитьЗагрузку(true);
      const ответ = await axios.get(`${API_URL}api/auth/profile`);
      установитьПользователя(ответ.data);
      установитьЗагрузку(false);
    } catch (ошибка) {
      console.error('Ошибка получения профиля пользователя:', ошибка);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      установитьПользователя(null);
      установитьЗагрузку(false);
    }
  };

  const войти = (токен, данныеПользователя) => {
    localStorage.setItem('token', токен);
    axios.defaults.headers.common['Authorization'] = `Bearer ${токен}`;
    установитьПользователя(данныеПользователя);
  };

  const выйти = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    установитьПользователя(null);
  };

  // Функция для проверки, имеет ли пользователь определенную роль
  const имеетРоль = (роль) => {
    return пользователь && пользователь.role === роль;
  };

  // Функция для проверки, имеет ли пользователь одну из разрешенных ролей
  const имеетЛюбуюРоль = (роли) => {
    return пользователь && роли.includes(пользователь.role);
  };

  return (
    <AuthContext.Provider value={{ пользователь, загрузка, войти, выйти, имеетРоль, имеетЛюбуюРоль }}>
      {children}
    </AuthContext.Provider>
  );
};
