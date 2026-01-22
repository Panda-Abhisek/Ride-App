import React, { useState, useEffect, useRef } from 'react';
import { acceptRide, startRide, completeRide, getRideById } from '../../api/rides.api.js';
import { useNavigate } from 'react-router-dom';
import { formatDuration, analyzeDurationUnit } from '../../utils/formatters.js';

const ActiveRideManager = ({ ride, onRideComplete }) => {
  const [rideData, setRideData] = useState(ride);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const previousStatusRef = useRef(ride.status);
  console.log("Ride Data: ", rideData);

  // Validate ride data
  useEffect(() => {
    console.log('ActiveRideManager received ride:', ride);
    if (!ride?.id) {
      console.error('ActiveRideManager: No valid ride ID found');
      onRideComplete(); // Go back to idle state
      return;
    }
    setRideData(ride);
    previousStatusRef.current = ride.status;
  }, [ride, onRideComplete]);

  // Real-time polling for active ride
  useEffect(() => {
    if (!rideData?.id) {
      return;
    }

// NOTE: Polling removed to prevent excessive API calls
    // Real-time updates will need to be implemented via WebSocket or SSE in the future
  }, [rideData.id, onRideComplete]);

  const handleAcceptRide = async () => {
    if (!rideData?.id) {
      setError('No valid ride ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updatedRide = await acceptRide(rideData.id);
      setRideData(updatedRide);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept ride');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRide = async () => {
    if (!rideData?.id) {
      setError('No valid ride ID');
      return;
    }

    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updatedRide = await startRide(rideData.id, otp);
      setRideData(updatedRide);
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start ride');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRide = async () => {
    if (!rideData?.id) {
      setError('No valid ride ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updatedRide = await completeRide(rideData.id);
      setRideData(updatedRide);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete ride');
    } finally {
      setLoading(false);
    }
  };

  const navigateToDetails = () => {
    if (rideData?.id) {
      navigate(`/driver/ride/${rideData.id}`);
    }
  };

  const renderActionButtons = () => {
    if (!rideData?.id) {
      return null;
    }

    switch (rideData.status) {
      case 'REQUESTED':
      case 'ALLOCATED':
        return (
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button
              onClick={handleAcceptRide}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Processing...' : 'Accept Ride'}
            </button>
            <button
              onClick={navigateToDetails}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View Details
            </button>
          </div>
        );

      case 'ACCEPTED':
        return (
          <div style={{ marginTop: '15px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label>OTP: </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleStartRide}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Starting...' : 'Start Ride'}
              </button>
              <button
                onClick={navigateToDetails}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>
            </div>
          </div>
        );

      case 'STARTED':
        return (
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button
              onClick={handleCompleteRide}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Completing...' : 'Complete Ride'}
            </button>
            <button
              onClick={navigateToDetails}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View Details
            </button>
          </div>
        );

      case 'COMPLETED':
        return (
          <div style={{ marginTop: '15px' }}>
            <p style={{ color: '#28a745', fontWeight: 'bold' }}>✅ Ride Completed</p>
          </div>
        );

      default:
        return null;
    }
  };

  if (!rideData?.id) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Invalid ride data. Please check back later.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Active Ride</h3>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        color: 'black'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <p><strong>Ride ID:</strong> {rideData.id}</p>
            <p><strong>Status:</strong> {rideData.status}</p>
            <p><strong>Pickup:</strong> {rideData.pickupArea}</p>
            <p><strong>Destination:</strong> {rideData.destinationArea}</p>
            {rideData.user && (
              <p><strong>Rider:</strong> {rideData.user.userName}</p>
            )}
          </div>
          <div>
            {rideData.otp && (
              <p><strong>OTP:</strong> {rideData.otp}</p>
            )}
            {rideData.fare && (
              <p><strong>Fare:</strong> ₹{rideData.fare}</p>
            )}
            {rideData.distance && (
              <p><strong>Distance:</strong> {rideData.distance} km</p>
            )}
          </div>
        </div>

        {renderActionButtons()}
      </div>
    </div>
  );
};

export default ActiveRideManager;