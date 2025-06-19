import axios from 'axios';

// Base URL for API requests
const API_URL = '/';

// Classrooms
const getClassrooms = async () => {
  const response = await axios.get(`${API_URL}api/classrooms`);
  return response.data;
};

const createClassroom = async (data) => {
  const response = await axios.post(`${API_URL}api/classrooms`, data);
  return response.data;
};

const updateClassroom = async (id, data) => {
  const response = await axios.put(`${API_URL}api/classrooms/${id}`, data);
  return response.data;
};

const deleteClassroom = async (id) => {
  const response = await axios.delete(`${API_URL}api/classrooms/${id}`);
  return response.data;
};

const getClassroomSchedule = async (id, view) => {
  const response = await axios.get(`${API_URL}api/classrooms/${id}/schedule?view=${view}`);
  return response.data;
};

// Teachers
const getTeachers = async () => {
  const response = await axios.get(`${API_URL}api/teachers`);
  return response.data;
};

const createTeacher = async (data) => {
  const response = await axios.post(`${API_URL}api/teachers`, data);
  return response.data;
};

const updateTeacher = async (id, data) => {
  const response = await axios.put(`${API_URL}api/teachers/${id}`, data);
  return response.data;
};

const deleteTeacher = async (id) => {
  const response = await axios.delete(`${API_URL}api/teachers/${id}`);
  return response.data;
};

const getTeacherGroups = async (id) => {
  const response = await axios.get(`${API_URL}api/teachers/${id}/groups`);
  return response.data;
};

// Groups
const getGroups = async () => {
  const response = await axios.get(`${API_URL}api/groups`);
  return response.data;
};

const createGroup = async (data) => {
  const response = await axios.post(`${API_URL}api/groups`, data);
  return response.data;
};

const updateGroup = async (id, data) => {
  const response = await axios.put(`${API_URL}api/groups/${id}`, data);
  return response.data;
};

const deleteGroup = async (id) => {
  const response = await axios.delete(`${API_URL}api/groups/${id}`);
  return response.data;
};

const getGroupSchedule = async (id) => {
  const response = await axios.get(`${API_URL}api/groups/${id}/schedule`);
  return response.data;
};

const getGroupAttendanceReport = async (id) => {
  const response = await axios.get(`${API_URL}api/groups/${id}/attendance-report`);
  return response.data;
};

// Students
const getStudents = async () => {
  const response = await axios.get(`${API_URL}api/students`);
  return response.data;
};

const createStudent = async (data) => {
  const response = await axios.post(`${API_URL}api/students`, data);
  return response.data;
};

const updateStudent = async (id, data) => {
  const response = await axios.put(`${API_URL}api/students/${id}`, data);
  return response.data;
};

const deleteStudent = async (id) => {
  const response = await axios.delete(`${API_URL}api/students/${id}`);
  return response.data;
};

const getStudentPaymentStatus = async (id) => {
  const response = await axios.get(`${API_URL}api/students/${id}/payment-status`);
  return response.data;
};

// Schedules
const getSchedules = async () => {
  const response = await axios.get(`${API_URL}api/schedules`);
  return response.data;
};

const createSchedule = async (data) => {
  const response = await axios.post(`${API_URL}api/schedules`, data);
  return response.data;
};

const updateSchedule = async (id, data) => {
  const response = await axios.put(`${API_URL}api/schedules/${id}`, data);
  return response.data;
};

const deleteSchedule = async (id) => {
  const response = await axios.delete(`${API_URL}api/schedules/${id}`);
  return response.data;
};

// Attendance
const getAttendances = async (params = {}) => {
  let url = `${API_URL}api/attendances`;
  const queryParams = [];
  if (params.studentId) queryParams.push(`studentId=${params.studentId}`);
  if (params.groupId) queryParams.push(`groupId=${params.groupId}`);
  if (params.startDate) queryParams.push(`startDate=${params.startDate}`);
  if (params.endDate) queryParams.push(`endDate=${params.endDate}`);
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  const response = await axios.get(url);
  return response.data;
};

const getAttendanceDates = async (params = {}) => {
  let url = `${API_URL}api/attendances/dates`;
  const queryParams = [];
  if (params.studentId) queryParams.push(`studentId=${params.studentId}`);
  if (params.groupId) queryParams.push(`groupId=${params.groupId}`);
  if (params.startDate) queryParams.push(`startDate=${params.startDate}`);
  if (params.endDate) queryParams.push(`endDate=${params.endDate}`);
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  const response = await axios.get(url);
  return response.data;
};

const createAttendance = async (data) => {
  const response = await axios.post(`${API_URL}api/attendances`, data);
  return response.data;
};

const updateAttendance = async (id, data) => {
  const response = await axios.put(`${API_URL}api/attendances/${id}`, data);
  return response.data;
};

const deleteAttendance = async (id) => {
  const response = await axios.delete(`${API_URL}api/attendances/${id}`);
  return response.data;
};

// Payments
const getPayments = async (params = {}) => {
  let url = `${API_URL}api/payments`;
  const queryParams = [];
  if (params.studentId) queryParams.push(`studentId=${params.studentId}`);
  if (params.groupId) queryParams.push(`groupId=${params.groupId}`);
  if (params.startDate) queryParams.push(`startDate=${params.startDate}`);
  if (params.endDate) queryParams.push(`endDate=${params.endDate}`);
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  const response = await axios.get(url);
  return response.data;
};

const createPayment = async (data) => {
  const response = await axios.post(`${API_URL}api/payments`, data);
  return response.data;
};

const updatePayment = async (id, data) => {
  const response = await axios.put(`${API_URL}api/payments/${id}`, data);
  return response.data;
};

const deletePayment = async (id) => {
  const response = await axios.delete(`${API_URL}api/payments/${id}`);
  return response.data;
};

const confirmPayment = async (id) => {
  const response = await axios.post(`${API_URL}api/payments/${id}/confirm`);
  return response.data;
};

// Reports
const getAttendanceReport = async (params = {}) => {
  let url = `${API_URL}api/reports/attendance`;
  const queryParams = [];
  if (params.studentId) queryParams.push(`studentId=${params.studentId}`);
  if (params.groupId) queryParams.push(`groupId=${params.groupId}`);
  if (params.startDate) queryParams.push(`startDate=${params.startDate}`);
  if (params.endDate) queryParams.push(`endDate=${params.endDate}`);
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  const response = await axios.get(url);
  return response.data;
};

const getPaymentReport = async (params = {}) => {
  let url = `${API_URL}api/reports/payments`;
  const queryParams = [];
  if (params.studentId) queryParams.push(`studentId=${params.studentId}`);
  if (params.groupId) queryParams.push(`groupId=${params.groupId}`);
  if (params.startDate) queryParams.push(`startDate=${params.startDate}`);
  if (params.endDate) queryParams.push(`endDate=${params.endDate}`);
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  const response = await axios.get(url);
  return response.data;
};

export default {
  getClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  getClassroomSchedule,
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherGroups,
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupSchedule,
  getGroupAttendanceReport,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentPaymentStatus,
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAttendances,
  getAttendanceDates,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  confirmPayment,
  getAttendanceReport,
  getPaymentReport
};
