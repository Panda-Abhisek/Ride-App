import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getRideById } from '../api/rides.api.js';
import MapView from '../components/MapView.jsx';
import { ErrorMessage, LoadingSpinner } from '../common';
import { formatDuration, analyzeDurationUnit } from '../utils/formatters.js';

const DriverRideDetails = () => {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refetching, setRefetching] = useState(false);
  const previousStatusRef = useRef(null);

  // Duration analysis function
  const analyzeDuration = (rideData) => {
    if (!rideData) return null;

    const { duration, startTime, endTime } = rideData;
    console.log('=== DURATION ANALYSIS ===');
    console.log('Backend duration field:', duration);
    console.log('Type:', typeof duration);
    
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const realDurationMs = end - start;
      const realDurationSeconds = Math.floor(realDurationMs / 1000);
      
      console.log('Start time:', startTime);
      console.log('End time:', endTime);
      console.log('Real duration (ms):', realDurationMs);
      console.log('Real duration (seconds):', realDurationSeconds);
      
      // Compare with backend duration
      if (duration !== undefined) {
        const isSeconds = Math.abs(duration - realDurationSeconds) < 60; // Within 1 minute
        const isMilliseconds = Math.abs(duration - realDurationMs) < 60000; // Within 1 minute
        
        console.log('Backend vs Real (seconds):', duration, 'vs', realDurationSeconds);
        console.log('Backend vs Real (ms):', duration, 'vs', realDurationMs);
        
        if (isSeconds) {
          console.log('✅ CONCLUSION: Duration field is in SECONDS');
          return { unit: 'seconds', value: duration, realSeconds };
        } else if (isMilliseconds) {
          console.log('✅ CONCLUSION: Duration field is in MILLISECONDS');
          return { unit: 'milliseconds', value: duration, realSeconds };
        } else {
          console.log('❓ CONCLUSION: Duration unit unclear');
          return { unit: 'unknown', value: duration, realSeconds };
        }
      }
    }
    
    console.log('=== END ANALYSIS ===');
    return null;
  };

  useEffect(() => {
    if (!rideId) return;

// NOTE: Polling removed to prevent excessive API calls
    // Real-time updates will need to be implemented via WebSocket or SSE in the future

    // Initial fetch
    const fetchInitialRide = async () => {
      try {
        console.log("Initial fetch driver ride", rideId);
        const rideData = await getRideById(rideId);
        setRide(rideData);
        previousStatusRef.current = rideData.status;
        setLoading(false);
        
        if (rideData.status === 'COMPLETED' || rideData.status === 'CANCELLED') {
          clearInterval(intervalId);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch ride details');
        setLoading(false);
      }
    };

    fetchInitialRide();

    return () => clearInterval(intervalId);
  }, [rideId]);

  if (loading) {
    return <LoadingSpinner text="Loading ride details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!ride) {
    return <ErrorMessage message="Ride not found" variant="info" />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'REQUESTED':
      case 'ALLOCATED':
        return '#ffa500'; // orange
      case 'ACCEPTED':
        return '#007bff'; // blue
      case 'STARTED':
        return '#28a745'; // green
      case 'COMPLETED':
        return '#6c757d'; // gray
      case 'CANCELLED':
        return '#dc3545'; // red
      default:
        return '#6c757d'; // gray
    }
  };

  return (
    <div>
      <p><strong>Ride ID:</strong> {rideId}</p>
      <div style={{ marginTop: '20px' }}>
        <h3>
          Status: 
          <span 
            style={{ 
              marginLeft: '10px',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: getStatusColor(ride.status),
              color: 'white',
              fontSize: '14px',
              fontWeight: 'normal'
            }}
          >
            {ride.status}
          </span>
          {refetching && (
            <span style={{ 
              marginLeft: '10px', 
              color: '#666', 
              fontSize: '12px',
              fontStyle: 'italic'
            }}>
              updating...
            </span>
          )}
        </h3>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Ride Information (Read-Only View)</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          color: 'black'
        }}>
          <div>
            <p><strong>Pickup:</strong> {ride.pickupArea}</p>
            <p><strong>Destination:</strong> {ride.destinationArea}</p>
            {ride.rider && <p><strong>Rider:</strong> {ride.rider.name}</p>}
            {ride.startTime && <p><strong>Start:</strong> {new Date(ride.startTime).toLocaleString()}</p>}
            {ride.endTime && <p><strong>End:</strong> {new Date(ride.endTime).toLocaleString()}</p>}
          </div>
          <div>
            {ride.otp && <p><strong>OTP:</strong> {ride.otp}</p>}
            <p><strong>Fare:</strong> ₹{ride.fare}</p>
            <p><strong>Distance:</strong> {ride.distance} km</p>
            {ride.duration !== undefined && (
              <div>
                {(() => {
                  const analysis = analyzeDurationUnit(ride);
                  if (analysis && analysis.unit !== 'unknown') {
                    return <p><strong>Duration:</strong> {formatDuration(ride.duration, analysis.unit)}</p>;
                  } else {
                    // Fallback for unknown duration
                    return <p><strong>Duration:</strong> {ride.duration} (unit: unknown)</p>;
                  }
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {ride.pickupLatitude && ride.pickupLongitude && ride.destinationLatitude && ride.destinationLongitude && (
        <div style={{ marginTop: '20px' }}>
          <h3>Map View</h3>
          <MapView 
            pickupLat={ride.pickupLatitude}
            pickupLng={ride.pickupLongitude}
            destinationLat={ride.destinationLatitude}
            destinationLng={ride.destinationLongitude}
          />
        </div>
      )}
      
      {/* <div style={{ marginTop: '20px' }}>
        <h3>Raw Data:</h3>
        <pre style={{ backgroundColor: '#f5f5f5', color: 'black', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(ride, null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

export default DriverRideDetails;