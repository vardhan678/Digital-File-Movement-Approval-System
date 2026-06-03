import api from './api';

export const getFiles = async (params = {}) => {
  const res = await api.get('/api/files', { params });
  return res.data;
};

export const getFileById = async (id) => {
  const res = await api.get(`/api/files/${id}`);
  return res.data;
};

export const createFile = async (formData) => {
  const res = await api.post('/api/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateFile = async (id, formData) => {
  const res = await api.put(`/api/files/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteFile = async (id) => {
  const res = await api.delete(`/api/files/${id}`);
  return res.data;
};
