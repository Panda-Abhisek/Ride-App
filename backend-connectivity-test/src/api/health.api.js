import api from './axios.js';

export const pingApiRoot = async () => {
  const response = await api.get('/api');
  return response.data;
};

export const pingHome = async () => {
  const response = await api.get('/api/home');
  return response.data;
};