import api from './api';

export const getPendingFiles = async (params = {}) => {
  const res = await api.get('/api/approval/pending', { params });
  return res.data;
};

export const performAction = async (id, action, remarks = '') => {
  const res = await api.put(`/api/approval/${id}/action`, { action, remarks });
  return res.data;
};
