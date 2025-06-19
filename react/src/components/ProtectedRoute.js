import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Компонент для защиты маршрутов на основе ролей пользователя
const ЗащищенныйМаршрут = ({ children, allowedRoles }) => {
  const { пользователь, загрузка } = useContext(AuthContext);

  if (загрузка) {
    return <div>Загрузка...</div>;
  }

  if (!пользователь) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(пользователь.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ЗащищенныйМаршрут;
