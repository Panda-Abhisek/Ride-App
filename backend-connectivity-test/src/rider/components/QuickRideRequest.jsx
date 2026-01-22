import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickRideRequest = () => {
  const navigate = useNavigate();

  const handleQuickRequest = () => {
    navigate('/rider/request');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h4>Quick Ride</h4>
      <p style={{ color: '#666', marginBottom: '15px' }}>Need a ride right now?</p>
      <button 
        onClick={handleQuickRequest}
        style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Request New Ride
      </button>
    </div>
  );
};

export default QuickRideRequest;