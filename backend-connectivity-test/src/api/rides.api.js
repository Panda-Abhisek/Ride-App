import api from './axios.js';

export const requestRide = async (payload) => {
  console.log('Making ride request to: /api/rides/request');
  console.log('Request payload:', payload);
  
  try {
    const response = await api.post('/api/rides/request', payload);
    console.log('Ride request successful:', response);
    return response.data;
  } catch (error) {
    console.error('Ride request failed:', error);
    console.error('Request URL:', error.config?.url);
    console.error('Request method:', error.config?.method);
    console.error('Request data:', error.config?.data);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};

export const getRideById = async (id) => {
  console.log("Reaching this point - get ride by id")
  const response = await api.get(`/api/rides/${id}`);
  console.log(response);
  console.log(response.data);
  return response.data;
};

export const getAllocatedRides = async (driverId) => {
  const response = await api.get(`/api/drivers/${driverId}/allocated`);
  return response.data;
};

export const getCurrentRide = async (driverId) => {
  const response = await api.get(`/api/drivers/${driverId}/current_ride`);
  return response.data;
};

export const acceptRide = async (rideId) => {
  const response = await api.put(`/api/rides/${rideId}/accept`);
  return response.data;
};

export const declineRide = async (rideId) => {
  const response = await api.put(`/api/rides/${rideId}/decline`);
  return response.data;
};

export const startRide = async (rideId, otp) => {
  const response = await api.put(`/api/rides/${rideId}/start`, { otp });
  return response.data;
};

export const completeRide = async (rideId) => {
  const response = await api.put(`/api/rides/${rideId}/complete`);
  return response.data;
};

export const getRiderActiveRides = async () => {
  const response = await api.get('/api/users/rides/active');
  return response.data;
};

export const cancelRide = async (rideId) => {
  const response = await api.put(`/api/rides/${rideId}/cancel`);
  return response.data;
};