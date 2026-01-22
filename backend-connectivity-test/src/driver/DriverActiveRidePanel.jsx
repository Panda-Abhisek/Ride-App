import React, { useState, useEffect } from 'react';
import { getRideById, startRide, completeRide } from '../api/rides.api.js';
import { ErrorMessage, LoadingSpinner } from '../common';

const DriverActiveRidePanel = ({ rideId, onRideCompleted }) => {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [startingRide, setStartingRide] = useState(false);
  const [completingRide, setCompletingRide] = useState(false);

  useEffect(() => {
    const initialFetch = async () => {
      try {
        const rideData = await getRideById(rideId);
        // Defensive: Ensure we have valid ride data
        if (!rideData || !rideData.id) {
          throw new Error('Invalid ride data received');
        }
        
        setRide(rideData);
        setError('');
        
        // If ride is completed on initial load, notify parent
        if (rideData.status === 'COMPLETED' && onRideCompleted) {
          onRideCompleted();
        }
      } catch (err) {
        console.error('Failed to fetch ride details:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load ride details';
        setError(errorMessage);
      } finally {
        // Defensive: Always clear loading state
        setLoading(false);
      }
    };

    if (!rideId) {
      setError('Ride ID is required');
      setLoading(false);
      return;
    }

    initialFetch();
  }, [rideId]);

  if (loading) {
    return <LoadingSpinner text="Loading ride details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!ride) {
    return <ErrorMessage message="Ride not found" />;
  }

  const fetchRideDetails = async () => {
    try {
      const rideData = await getRideById(rideId);
      // Defensive: Ensure we have valid ride data
      if (!rideData || !rideData.id) {
        throw new Error('Invalid ride data received');
      }
      
      setRide(rideData);
      setError('');
      
      // If ride is completed, notify parent
      if (rideData.status === 'COMPLETED' && onRideCompleted) {
        onRideCompleted();
      }
    } catch (err) {
      console.error('Failed to fetch ride details:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load ride details';
      setError(errorMessage);
      
      // Defensive: Clear loading states on fetch error
      setStartingRide(false);
      setCompletingRide(false);
    }
  };

  const handleStartRide = async (e) => {
    e.preventDefault();
    
    // Defensive: Prevent multiple submissions
    if (startingRide || completingRide) {
      return;
    }
    
    // Defensive: OTP validation
    if (!otp.trim()) {
      setError('Please enter OTP');
      return;
    }
    
    // Defensive: Only allow start if ride is still in ACCEPTED state
    if (!ride || ride.status !== 'ACCEPTED') {
      setError('Ride cannot be started in current status');
      return;
    }

    setStartingRide(true);
    setError('');

    try {
      await startRide(rideId, parseInt(otp.trim()));
      await fetchRideDetails();
      setOtp('');
    } catch (err) {
      console.error('Failed to start ride:', err);
      setError(err.response?.data?.message || 'Failed to start ride');
    } finally {
      setStartingRide(false);
    }
  };

  const handleCompleteRide = async () => {
    // Defensive: Prevent multiple submissions
    if (startingRide || completingRide) {
      return;
    }
    
    // Defensive: Only allow complete if ride is still in STARTED state
    if (!ride || ride.status !== 'STARTED') {
      setError('Ride cannot be completed in current status');
      return;
    }

    setCompletingRide(true);
    setError('');

    try {
      await completeRide(rideId);
      await fetchRideDetails();
    } catch (err) {
      console.error('Failed to complete ride:', err);
      setError(err.response?.data?.message || 'Failed to complete ride');
    } finally {
      setCompletingRide(false);
    }
  };

  const getStatusMessage = () => {
    switch (ride.status) {
      case 'ACCEPTED':
        return 'Ride accepted. Waiting to start.';
      case 'STARTED':
        return 'Ride in progress.';
      case 'COMPLETED':
        return 'Ride completed.';
      default:
        return `Status: ${ride.status}`;
    }
  };

  return (
    <div>
      <h3>Active Ride</h3>
      <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <p><strong>Ride ID:</strong> {ride.id}</p>
        <p><strong>Pickup:</strong> {ride.pickupArea}</p>
        <p><strong>Destination:</strong> {ride.destinationArea}</p>
        <p><strong>{getStatusMessage()}</strong></p>
        {ride.estimatedFare && <p><strong>Estimated Fare:</strong> ${ride.estimatedFare}</p>}
        {ride.estimatedDuration && <p><strong>Estimated Duration:</strong> {ride.estimatedDuration} mins</p>}
        
        {ride.status === 'ACCEPTED' && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff8dc', borderRadius: '5px' }}>
            <h4>Start Ride</h4>
            <form onSubmit={handleStartRide}>
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="otp" style={{ display: 'block', marginBottom: '5px' }}>
                  OTP:
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    width: '150px'
                  }}
                  disabled={startingRide}
                  maxLength={6}
                  pattern="[0-9]*"
                />
              </div>
              <button
                type="submit"
                disabled={startingRide || completingRide || !otp.trim()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: (startingRide || completingRide) ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (startingRide || completingRide) ? 'not-allowed' : 'pointer'
                }}
              >
                {startingRide ? 'Starting...' : 'Start Ride'}
              </button>
            </form>
          </div>
        )}

        {ride.status === 'STARTED' && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
            <h4>Complete Ride</h4>
            <button
              onClick={handleCompleteRide}
              disabled={startingRide || completingRide}
              style={{
                padding: '8px 16px',
                backgroundColor: (startingRide || completingRide) ? '#ccc' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (startingRide || completingRide) ? 'not-allowed' : 'pointer'
              }}
            >
              {completingRide ? 'Completing...' : 'Complete Ride'}
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <ErrorMessage message={error} />
      )}
    </div>
  );
};

export default DriverActiveRidePanel;