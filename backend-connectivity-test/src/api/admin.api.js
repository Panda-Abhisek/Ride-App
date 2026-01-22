import api from './axios.js';

export const getAllRiders = async () => {
    const response = await api.get('/api/admins/get/riders');
    return response.data;
}

export const getAllDrivers = async () => {
    const response = await api.get('/api/admins/get/drivers');
    return response.data;
}

export const getAllRides = async () => {
    const response = await api.get('/api/admins/get/rides');
    return response.data;
}