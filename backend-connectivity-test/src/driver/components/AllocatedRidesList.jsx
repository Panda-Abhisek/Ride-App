import React from 'react';
import { acceptRide, declineRide } from '../../api/rides.api.js';
import { useNavigate } from 'react-router-dom';
import { formatDuration, formatCompletedTime } from '../../utils/formatters.js';

const AllocatedRidesList = ({ rides, onRideUpdate }) => {
  const navigate = useNavigate();

  const handleAcceptRide = async (rideId) => {
    try {
      await acceptRide(rideId);
      if (onRideUpdate) {
        onRideUpdate();
      }
    } catch (err) {
      console.error('Failed to accept ride:', err);
      alert('Failed to accept ride. Please try again.');
    }
  };

  const handleDeclineRide = async (rideId) => {
    try {
      await declineRide(rideId);
      if (onRideUpdate) {
        onRideUpdate();
      }
    } catch (err) {
      console.error('Failed to decline ride:', err);
      alert('Failed to decline ride. Please try again.');
    }
  };

  const viewRideDetails = (rideId) => {
    navigate(`/driver/ride/${rideId}`);
  };

  return (
    <div>
      <h4>Available Rides ({rides.length})</h4>
      {rides.map(ride => (
        <div 
          key={ride.id} 
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: '#fff',
            color: 'black'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <p><strong>ID:</strong> {ride.id}</p>
              <p><strong>Pickup:</strong> {ride.pickupArea}</p>
              <p><strong>Destination:</strong> {ride.destinationArea}</p>
              <p><strong>Fare:</strong> ₹{ride.fare}</p>
            </div>
            <div>
              {ride.rider && (
                <p><strong>Rider:</strong> {ride.rider.name}</p>
              )}
              <p><strong>Distance:</strong> {ride.distance} km</p>
              <p><strong>Created:</strong> {formatCompletedTime(ride.createdAt)}</p>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginTop: '15px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => viewRideDetails(ride.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View Details
            </button>
            <button
              onClick={() => handleDeclineRide(ride.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Decline
            </button>
            <button
              onClick={() => handleAcceptRide(ride.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllocatedRidesList;