import React, { useState } from 'react';
import { requestRide } from '../api/rides.api.js';
import { ErrorMessage, LoadingSpinner } from '../common';

const RideRequestForm = ({ onRideCreated }) => {
  console.log("Inside Ride Request Form");  
  
  const [formData, setFormData] = useState({
    pickupArea: 'Marathahalli',
    destinationArea: 'Silk Board',
    pickupLongitude: 77.699918,
    pickupLatitude: 12.951628,
    destinationLongitude: 77.621410,
    destinationLatitude: 12.916713
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // console.log('Submitting ride request with data:', formData);

    try {
      const response = await requestRide(formData);
      console.log('Ride request response:', response);
      setSuccess('Ride requested successfully!');
      if (response.id && onRideCreated) {
        onRideCreated(response.id);
      }
    } catch (err) {
      // console.error('Ride request error:', err);
      // console.error('Error response:', err.response);
      // console.error('Error data:', err.response?.data);
      // console.error('Error status:', err.response?.status);
      
      const errorMessage = err.response?.data?.message || 
                        err.response?.data?.error || 
                        err.message || 
                        'Failed to request ride';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  console.log("Ride Request Done"); 
  return (
    <div>
      <h3>Request a Ride</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="pickupArea">Pickup Area:</label>
          <input
            type="text"
            id="pickupArea"
            name="pickupArea"
            value={formData.pickupArea}
            onChange={handleChange}
            required
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="destinationArea">Destination Area:</label>
          <input
            type="text"
            id="destinationArea"
            name="destinationArea"
            value={formData.destinationArea}
            onChange={handleChange}
            required
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '8px 16px' }}
        >
          {loading ? 'Requesting...' : 'Request Ride'}
        </button>
      </form>
      
        {error && <ErrorMessage message={error} />}
        {success && <div style={{ color: 'green', marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>{success}</div>}
    </div>
  );
};

export default RideRequestForm;