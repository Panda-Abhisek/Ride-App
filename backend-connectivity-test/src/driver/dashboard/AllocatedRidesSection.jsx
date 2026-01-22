import React from 'react';
import { acceptRide, declineRide } from '../../api/rides.api.js';
import { formatCompletedTime } from '../../utils/formatters.js';

const AllocatedRidesSection = ({ rides, onRideUpdate }) => {
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

  if (!rides || rides.length === 0) {
    return (
      <div style={{
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        backgroundColor: '#fff',
        padding: '40px',
        textAlign: 'center',
        color: 'black'
      }}>
        <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>
          No Rides Available
        </h3>
        <p style={{ color: '#666' }}>
          You're all caught up! Check back later for new ride requests.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        backgroundColor: '',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          color: '#28a745', 
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          🚗 New Ride Request{rides.length > 1 ? 's' : ''} ({rides.length})
        </h3>
      </div>

      {rides.map((ride) => (
        <div 
          key={ride.id} 
          style={{
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '15px',
            backgroundColor: '',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '10px' }}>
                {ride.pickupArea} → {ride.destinationArea}
              </h4>
              <p style={{ color: '#fff', fontSize: '14px' }}>
                Fare: <strong>₹{ride.fare}</strong> | 
                Distance: <strong>{ride.distance} km</strong>
              </p>
              <p style={{ color: '#fff', fontSize: '14px' }}>
                Requested: {formatCompletedTime(ride.createdAt)}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              {ride.rider && (
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Rider: <strong>{ride.rider.name}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginTop: '10px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => handleDeclineRide(ride.id)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Decline
            </button>
            <button
              onClick={() => handleAcceptRide(ride.id)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                minWidth: '120px'
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

export default AllocatedRidesSection;