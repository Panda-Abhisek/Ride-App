import React from 'react';
import { acceptRide, declineRide } from '../../api/rides.api.js';
import { formatCompletedTime } from '../../utils/formatters.js';

const DriverIdleStateCard = ({ ride }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleAcceptRide = async (rideId) => {
    if (loading) return; // Prevent double clicks
    
    setLoading(true);
    setError('');
    try {
      await acceptRide(rideId);
    } catch (err) {
      console.error('Failed to accept ride:', err);
      setError('Failed to accept ride. Please try again.');
      setTimeout(() => setError(''), 10000); // Clear error after 3 seconds
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineRide = async (rideId) => {
    if (loading) return; // Prevent double clicks
    
    setLoading(true);
    setError('');
    try {
      await declineRide(rideId);
    } catch (err) {
      console.error('Failed to decline ride:', err);
      setError('Failed to decline ride. Please try again.');
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Error Banner */}
      {error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '8px',
          backgroundColor: '#dc3545',
          color: 'white',
          fontSize: '14px',
          textAlign: 'center',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          {error}
        </div>
      )}

      {/* Top Section - Pickup & Destination (Most Prominent) */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '4px'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginRight: '8px'
          }}>
            📍
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#2c3e50',
            textAlign: 'center',
            flex: 1
          }}>
            {ride.pickupArea}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <div style={{
            fontSize: '16px',
            color: '#6c757d',
            marginRight: '8px'
          }}>
            ➡️
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#2c3e50',
            textAlign: 'center',
            flex: 1
          }}>
            {ride.destinationArea}
          </div>
        </div>
      </div>

      {/* Middle Section - Rider & Secondary Info */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#fff'
      }}>
        {ride.rider && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#e7f3ff',
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '16px',
              color: '#2c3e50',
              marginRight: '8px'
            }}>
              👤
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              {ride.rider.name}
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          <div>
            <div style={{ marginBottom: '4px', color: '#666' }}>
              Fare
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              ₹{ride.fare}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '4px', color: '#666' }}>
              Distance
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {ride.distance} km
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Action Buttons */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#f8f9fa',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => handleDeclineRide(ride.id)}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: loading ? '#6c757d' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              minWidth: '100px'
            }}
          >
            {loading ? '...' : 'Decline'}
          </button>
          
          <button
            onClick={() => handleAcceptRide(ride.id)}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#ffc107' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(40,167,69,0.3)',
              minWidth: '120px'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Accepting</span>
                <span>⏳</span>
              </span>
            ) : 'Accept Ride'}
          </button>
        </div>

        {/* Request Time */}
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#999',
          textAlign: 'center'
        }}>
          Requested: {formatCompletedTime(ride.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default DriverIdleStateCard;