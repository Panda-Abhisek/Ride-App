import React, { useState, useEffect } from 'react';
import { acceptRide, startRide, completeRide, getRideById } from '../../api/rides.api.js';
import { useNavigate } from 'react-router-dom';
import { formatDuration, analyzeDurationUnit } from '../../utils/formatters.js';

const ActiveRideSection = ({ ride, onRideComplete }) => {
  const [rideData, setRideData] = useState(ride);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  // Validate ride data
  useEffect(() => {
    console.log('ActiveRideSection received ride:', ride);
    if (!ride?.id) {
      console.error('ActiveRideSection: No valid ride ID found');
      onRideComplete();
      return;
    }
    setRideData(ride);
  }, [ride, onRideComplete]);

  // Real-time polling for active ride
  useEffect(() => {
    if (!rideData?.id) {
      return;
    }

    // NOTE: Polling removed to prevent excessive API calls
    // Real-time updates will need to be implemented via WebSocket or SSE in the future
  }, [rideData.id, onRideComplete]);

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

  const renderPrimaryAction = () => {
    if (!rideData?.id) {
      return null;
    }

    switch (rideData.status) {
      case 'REQUESTED':
      case 'ALLOCATED':
        return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ color: '#28a745', marginBottom: '15px' }}>
              🚗 Ride Available
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '20px' }}>
              {rideData.pickupArea} → {rideData.destinationArea}
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={navigateToDetails}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>
              <button
                onClick={() => {
                  // This would need acceptRide API call
                  navigateToDetails();
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Accept Ride
              </button>
            </div>
          </div>
        );

      case 'ACCEPTED':
        return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ color: '#ffc107', marginBottom: '15px' }}>
              🔢 Enter OTP to Start
            </h3>
            {rideData.user && (
              <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                Rider: <strong>{rideData.user.userName}</strong>
              </p>
            )}
            {rideData.otp && (
              <p style={{ fontSize: '18px', marginBottom: '20px', color: '#007bff' }}>
                OTP: <strong>{rideData.otp}</strong>
              </p>
            )}
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                autoFocus
                style={{
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  width: '200px',
                  textAlign: 'center'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={handleStartRide}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: loading ? '#6c757d' : '#ffc107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Starting...' : 'Start Ride'}
              </button>
            </div>
          </div>
        );

      case 'STARTED':
        return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ color: '#28a745', marginBottom: '15px' }}>
              🚗 Ride In Progress
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '20px' }}>
              Going to: <strong>{rideData.destinationArea}</strong>
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={handleCompleteRide}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: loading ? '#6c757d' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Completing...' : 'Complete Ride'}
              </button>
            </div>
          </div>
        );

      case 'COMPLETED':
        return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ color: '#28a745', marginBottom: '15px' }}>
              ✅ Ride Completed
            </h3>
            {rideData.duration !== undefined && (
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                Duration: {(() => {
                  const analysis = analyzeDurationUnit(rideData);
                  return analysis && analysis.unit !== 'unknown' 
                    ? formatDuration(rideData.duration, analysis.unit)
                    : `${rideData.duration} (unit: unknown)`;
                })()}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      backgroundColor: '',
      overflow: 'hidden'
    }}>
      {/* Error Display */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          fontSize: '16px'
        }}>
          {error}
        </div>
      )}

      {/* Primary Action */}
      {renderPrimaryAction()}
    </div>
  );
};

export default ActiveRideSection;