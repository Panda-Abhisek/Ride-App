import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getRideById } from '../api/rides.api.js';
import MapView from '../components/MapView.jsx';
import { ErrorMessage, LoadingSpinner } from '../common';
import { formatDuration, analyzeDurationUnit } from '../utils/formatters.js';

const RideDetails = () => {
  console.log("Inside Ride Details");
  const { id } = useParams();
  console.log("Ride Id: ", id);
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refetching, setRefetching] = useState(false);
  const previousStatusRef = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'REQUESTED':
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

  // Duration analysis function
  // const analyzeDuration = (rideData) => {
  //   if (!rideData) return null;

  //   const { duration, startTime, endTime } = rideData;
  //   console.log('=== RIDER DURATION ANALYSIS ===');
  //   console.log('Backend duration field:', duration);
  //   console.log('Type:', typeof duration);
    
  //   if (startTime && endTime) {
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);
  //     const realDurationMs = end - start;
  //     const realDurationSeconds = Math.floor(realDurationMs / 1000);
      
  //     console.log('Start time:', startTime);
  //     console.log('End time:', endTime);
  //     console.log('Real duration (ms):', realDurationMs);
  //     console.log('Real duration (seconds):', realDurationSeconds);
      
  //     // Compare with backend duration
  //     if (duration !== undefined) {
  //       const isSeconds = Math.abs(duration - realDurationSeconds) < 60; // Within 1 minute
  //       const isMilliseconds = Math.abs(duration - realDurationMs) < 60000; // Within 1 minute
        
  //       console.log('Backend vs Real (seconds):', duration, 'vs', realDurationSeconds);
  //       console.log('Backend vs Real (ms):', duration, 'vs', realDurationMs);
        
  //       if (isSeconds) {
  //         console.log('✅ CONCLUSION: Duration field is in SECONDS');
  //         return { unit: 'seconds', value: duration, realDurationSeconds };
  //       } else if (isMilliseconds) {
  //         console.log('✅ CONCLUSION: Duration field is in MILLISECONDS');
  //         return { unit: 'milliseconds', value: duration, realDurationMs };
  //       } else {
  //         console.log('❓ CONCLUSION: Duration unit unclear');
  //         return { unit: 'unknown', value: duration, realDurationMs };
  //       }
  //     }
  //   }
    
  //   console.log('=== END ANALYSIS ===');
  //   return null;
  // };

  useEffect(() => {
    if (!id) return;

    // NOTE: Polling removed to prevent excessive API calls
    // Real-time updates will need to be implemented via WebSocket or SSE in the future

    // Initial fetch immediately on mount
    const fetchInitialRide = async () => {
      try {
        console.log("Fetching ride", id);
        const rideData = await getRideById(id);
        setRide(rideData);
previousStatusRef.current = rideData.status;
        setLoading(false);
        
        // Stop polling if ride is completed or cancelled
        if (rideData.status === 'COMPLETED' || rideData.status === 'CANCELLED') {
          // clearInterval(intervalId);
          localStorage.removeItem('recentRideId');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch ride details');
        setLoading(false);
      }
    };

    fetchInitialRide();

    // Cleanup interval on unmount
    return () => {
      // clearInterval(intervalId);
    };
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading ride details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!ride) {
    return <ErrorMessage message="Ride not found" variant="info" />;
  }

  const renderRideStatus = () => {
    switch (ride.status) {
      case 'REQUESTED':
        return <div>Waiting for driver acceptance</div>;
      case 'ACCEPTED':
        return (
          <div>
            <p><strong>OTP:</strong> {ride.otp}</p>
            {ride.driver && (
              <div>
                <h4>Driver Details</h4>
                <p><strong>Name:</strong> {ride.driver.name}</p>
                <p><strong>Mobile:</strong> {ride.driver.mobile}</p>
                <p><strong>Vehicle:</strong> {ride.driver.vehicle.make} {ride.driver.vehicle.model}</p>
              </div>
            )}
          </div>
        );
      case 'STARTED':
        return <div>Ride in progress</div>;
      case 'COMPLETED':
        return (
          <div>
            <h4>Ride Completed</h4>
            <p><strong>Fare:</strong> ₹{ride.fare}</p>
            <p><strong>Distance:</strong> {ride.distance} km</p>
            {ride.duration !== undefined && (
              <div>
                {/* <p><strong>Duration (backend):</strong> {ride.duration}</p> */}
                {(() => {
                  const analysis = analyzeDurationUnit(ride);
                  if (analysis) {
                    const minutes = Math.floor(analysis.realDurationSeconds / 60);
                    const seconds = analysis.realDurationSeconds % 60;
                    return (
                      <div>
                        <p><strong>Completed in:</strong> {minutes}m {seconds}s</p>
                        {/* <p><strong>Unit detected:</strong> {analysis.unit}</p> */}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>
        );
      case 'CANCELLED':
        return <div>Ride cancelled</div>;
      default:
        return <div>Unknown status: {ride.status}</div>;
    }
  };

  return (
    <div>
      <p><strong>Ride ID:</strong> {id}</p>
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
        {renderRideStatus()}
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
        <h3>Ride Information:</h3>
        <pre style={{ backgroundColor: '#f5f5f5',color: 'black', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(ride, null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

export default RideDetails;