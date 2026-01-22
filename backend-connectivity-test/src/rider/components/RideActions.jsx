import React from 'react';
import { cancelRide } from '../../api/rides.api.js';
import { useNavigate } from 'react-router-dom';

const RideActions = ({ ride, onActionComplete, disabled = false }) => {
  const [loading, setLoading] = React.useState(null);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/rider/ride/${ride.id}`);
  };

  const handleCancelRide = async () => {
    if (!window.confirm('Are you sure you want to cancel this ride?')) {
      return;
    }
    
    try {
      setLoading('cancel');
      await cancelRide(ride.id);
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (err) {
      console.error('Failed to cancel ride:', err);
      alert('Failed to cancel ride. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleContactDriver = () => {
    if (ride.driver?.mobile) {
      window.location.href = `tel:${ride.driver.mobile}`;
    } else {
      alert('Driver contact information not available');
    }
  };

  const canCancelRide = (status) => {
    return status === 'REQUESTED' || status === 'ACCEPTED';
  };

  const canContactDriver = (status) => {
    return status === 'ACCEPTED' || status === 'STARTED';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <button 
        onClick={handleViewDetails}
        disabled={disabled}
        style={{ 
          padding: '6px 12px', 
          backgroundColor: disabled ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: '12px',
          minWidth: '80px'
        }}
      >
        View Details
      </button>
      
      {canCancelRide(ride.status) && (
        <button 
          onClick={handleCancelRide}
          disabled={disabled || loading === 'cancel'}
          style={{ 
            padding: '6px 12px', 
            backgroundColor: (disabled || loading === 'cancel') ? '#ccc' : '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: (disabled || loading === 'cancel') ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            minWidth: '80px'
          }}
        >
          {loading === 'cancel' ? 'Cancelling...' : 'Cancel'}
        </button>
      )}
      
      {canContactDriver(ride.status) && ride.driver && (
        <button 
          onClick={handleContactDriver}
          disabled={disabled}
          style={{ 
            padding: '6px 12px', 
            backgroundColor: disabled ? '#ccc' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            minWidth: '80px'
          }}
        >
          Call Driver
        </button>
      )}
    </div>
  );
};

export default RideActions;