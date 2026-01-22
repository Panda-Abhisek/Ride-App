import React, { useState } from 'react';
import { acceptRide, declineRide } from '../api/rides.api.js';

const RideCard = ({ ride, onActionComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = async () => {
    setLoading(true);
    setError('');
    try {
      await acceptRide(ride.id);
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept ride');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    setError('');
    try {
      await declineRide(ride.id);
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to decline ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
      <h4>Ride #{ride.id}</h4>
      <p><strong>Pickup:</strong> {ride.pickupArea}</p>
      <p><strong>Destination:</strong> {ride.destinationArea}</p>
      {ride.distance && <p><strong>Distance:</strong> {ride.distance} km</p>}
      <p><strong>Status:</strong> {ride.status}</p>
      
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={handleAccept} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '5px 10px' }}
        >
          {loading ? 'Processing...' : 'Accept'}
        </button>
        <button 
          onClick={handleDecline} 
          disabled={loading}
          style={{ padding: '5px 10px' }}
        >
          {loading ? 'Processing...' : 'Decline'}
        </button>
      </div>
      
      {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
    </div>
  );
};

export default RideCard;