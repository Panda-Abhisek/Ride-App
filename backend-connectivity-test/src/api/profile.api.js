import api from './axios.js';

export const getRiderProfile = async () => {
  const response = await api.get('/api/users/profile');
  return response.data;
};

export const getRiderCompletedRides = async () => {
  const response = await api.get('/api/users/rides/completed');
  return response.data;
};

export const getDriverProfile = async () => {
  const response = await api.get('/api/drivers/profile');
  return response.data;
};

export const getDriverCompletedRides = async () => {
  const response = await api.get('/api/drivers/rides/completed');
  console.log("response of driver ride history ", response);
  return response.data;
};