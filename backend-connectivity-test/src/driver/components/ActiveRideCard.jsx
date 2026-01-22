import React, { useState, useEffect, useRef } from 'react';
import { acceptRide, startRide, completeRide, getRideById } from '../../api/rides.api.js';
import { useNavigate } from 'react-router-dom';
import { formatDuration, analyzeDurationUnit } from '../../utils/formatters.js';

const ActiveRideCard = ({ ride, onRideComplete }) => {
  const [rideData, setRideData] = useState(ride);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const previousStatusRef = useRef(ride.status);

  // Validate ride data
  useEffect(() => {
    console.log('ActiveRideCard received ride:', ride);
    if (!ride?.id) {
      console.error('ActiveRideCard: No valid ride ID found');
      onRideComplete();
      return;
    }
    setRideData(ride);
    previousStatusRef.current = ride.status;
  }, [ride, onRideComplete]);

  // NOTE: Polling removed to prevent excessive API calls
  // Real-time updates will need to be implemented via WebSocket or SSE in the future

  const getStatusInfo = () => {
    switch (rideData.status) {
      case 'REQUESTED':
      case 'ALLOCATED':
        return {
          icon: '🚗',
          label: 'Ride Available',
          color: '#ffc107', // yellow
          bgColor: '#fff3cd',
          actionLabel: 'Accept Ride'
        };
      case 'ACCEPTED':
        return {
          icon: '🔢',
          label: 'Waiting for OTP',
          color: '#17a2b8', // blue
          bgColor: '#e7f3ff',
          actionLabel: 'Start Ride'
        };
      case 'STARTED':
        return {
          icon: '🚗',
          label: 'Ride In Progress',
          color: '#28a745', // green
          bgColor: '#d4edda',
          actionLabel: 'Complete Ride'
        };
      case 'COMPLETED':
        return {
          icon: '✅',
          label: 'Ride Completed',
          color: '#28a745', // green
          bgColor: '#d4edda',
          actionLabel: null
        };
      default:
        return {
          icon: '❓',
          label: 'Unknown Status',
          color: '#6c757d', // gray
          bgColor: '#e2e3e2',
          actionLabel: null
        };
    }
  };

  const handleStartRide = async () => {
    if (!rideData?.id) {
      setError('No valid ride ID');
      return;
    }

    if (!otp.trim()) {
      setError('Please enter the OTP to start the ride');
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

  const statusInfo = getStatusInfo();

  if (!rideData?.id) {
    return (
      <div style={{
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        backgroundColor: '#fff',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        color: 'black'
      }}>
        <div style={{ fontSize: '18px', color: '#6c757d' }}>
          No valid ride data
        </div>
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #e9ecef',
      borderRadius: '12px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Error Display */}
      {error && (
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          fontSize: '16px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Main Status Display */}
      <div style={{
        padding: '24px',
        backgroundColor: statusInfo.bgColor,
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          fontSize: '32px',
          marginBottom: '8px'
        }}>
          {statusInfo.icon}
        </div>
        
        <h2 style={{
          color: statusInfo.color,
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0',
          textTransform: 'uppercase'
        }}>
          {statusInfo.label}
        </h2>
      </div>

      {/* Route Information */}
      <div style={{
        padding: '0 24px 24px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#f8f9fa',
          border: '2px solid #e9ecef',
          borderRadius: '8px',
          fontSize: '18px',
          color: 'black'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>
            📍 {rideData.pickupArea}
          </div>
          <div style={{ fontSize: '24px', margin: '8px 0' }}>
            ↓
          </div>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>
            🏁 {rideData.destinationArea}
          </div>
        </div>
      </div>

      {/* Rider Information (if available) */}
      {rideData.user && (
        <div style={{
          padding: '0 24px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#e7f3ff',
            borderRadius: '20px',
            fontSize: '16px',
            color: 'black'
          }}>
            👤 {rideData.user.userName}
          </div>
        </div>
      )}

      {/* Duration Display (for completed rides) */}
      {rideData.duration !== undefined && (
        <div style={{
          padding: '0 24px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            fontSize: '16px',
            color: 'black'
          }}>
            ⏱️ {(() => {
              const analysis = analyzeDurationUnit(rideData);
              return analysis && analysis.unit !== 'unknown' 
                ? formatDuration(rideData.duration, analysis.unit)
                : `${rideData.duration} (unit: unknown)`;
            })()}
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <div style={{
        padding: '24px',
        textAlign: 'center'
      }}>
        {statusInfo.actionLabel && (
          <button
            onClick={() => {
              if (statusInfo.actionLabel === 'Start Ride') {
                handleStartRide();
              } else if (statusInfo.actionLabel === 'Complete Ride') {
                handleCompleteRide();
              } else if (statusInfo.actionLabel === 'Accept Ride') {
                navigateToDetails();
              }
            }}
            disabled={loading}
            style={{
              padding: '16px 32px',
              backgroundColor: statusInfo.color,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              minWidth: '200px'
            }}
          >
            {loading ? 'Processing...' : statusInfo.actionLabel}
          </button>
        )}
      </div>

      {/* OTP Input Section (Only for ACCEPTED status) */}
      {rideData.status === 'ACCEPTED' && (
        <div style={{
          padding: '0 24px 24px',
          textAlign: 'center',
          borderTop: '1px solid #e9ecef'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              display: 'block',
              marginBottom: '8px'
            }}>
              🔢 Enter OTP to Start
            </label>
          </div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            autoFocus
            maxLength={6}
            style={{
              padding: '16px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '18px',
              width: '250px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ActiveRideCard;