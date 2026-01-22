import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActiveRides = () => {
  const navigate = useNavigate();

  const handleActiveRides = () => {
    navigate('/rider/request/active');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h4>Active Ride</h4>
      <p style={{ color: '#666', marginBottom: '15px' }}>See Active Rides</p>
      <button 
        onClick={handleActiveRides}
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
        Active Rides
      </button>
    </div>
  );
};

export default QuickActiveRides;