import api from './api';

export const registerUser = async (data) => {
  const res = await api.post('/api/auth/register', data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post('/api/auth/login', data);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get('/api/auth/me');
  return res.data;
};
