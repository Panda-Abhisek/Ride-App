import React, { useState, useEffect } from 'react';
import { getRiderActiveRides, getRideById } from '../../api/rides.api.js';
import RideActions from './RideActions.jsx';
import { useNavigate } from 'react-router-dom';

const ActiveRidesPanel = () => {
  const navigate = useNavigate();
  const [activeRides, setActiveRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActiveRides = async () => {
    setLoading(true);
    
    // For now, use the localStorage approach since API endpoint doesn't exist
    const recentRideId = localStorage.getItem('recentRideId');
    console.log("Recent Ride Id: ", recentRideId);
    console.log(typeof(recentRideId));
    
    if (recentRideId) {
      try {
        const rideData = await getRideById(recentRideId);
        console.log("Ride Data : ", rideData);
        if (rideData.status !== 'COMPLETED' && rideData.status !== 'CANCELLED') {
          setActiveRides([rideData]);
        } else {
          localStorage.removeItem('recentRideId');
          setActiveRides([]);
        }
        setError('');
      } catch (rideError) {
        console.error('Failed to fetch ride:', rideError);
        localStorage.removeItem('recentRideId');
        setActiveRides([]);
      }
    } else {
      setActiveRides([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchActiveRides();
    
    // Optional: Set up polling for real-time updates (commented out for now)
    // const intervalId = setInterval(fetchActiveRides, 15000);
    // return () => clearInterval(intervalId);
  }, []);

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

  if (loading) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h4>Active Rides</h4>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: '#666' }}>Loading active rides...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h4>Active Rides</h4>
        <div style={{ color: '#dc3545', textAlign: 'center', padding: '10px' }}>
          {error}
        </div>
        <button 
          onClick={fetchActiveRides}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (activeRides.length === 0) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h4>Active Rides</h4>
        <p style={{ color: '#666' }}>No active rides</p>
      </div>
    );
  } 

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h4 style={{ margin: 0 }}>Active Rides</h4>
        <span style={{ fontSize: '12px', color: '#666' }}>
          Auto-updating every 10 seconds
        </span>
      </div>
      
      {activeRides.map(ride => (
        <div key={ride.id} style={{ 
          marginTop: '10px', 
          padding: '15px', 
          border: '1px solid #eee', 
          borderRadius: '6px',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ 
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: getStatusColor(ride.status),
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginRight: '8px'
                }}>
                  {ride.status}
                </span>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  Ride ID: {ride.id}
                </span>
              </div>
              
              <div style={{ fontSize: '14px', color: '#333' }}>
                <p style={{ margin: '4px 0' }}>
                  <strong>From:</strong> {ride.pickupAddress || 'Loading...'}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>To:</strong> {ride.destinationAddress || 'Loading...'}
                </p>
                {ride.driver && (
                  <div style={{ margin: '8px 0', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}>
                      <strong>Driver:</strong> {ride.driver.name}
                    </p>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}>
                      <strong>Vehicle:</strong> {ride.driver.vehicleMake} {ride.driver.vehicleModel}
                    </p>
                    {ride.status === 'ACCEPTED' && (
                      <p style={{ margin: '4px 0', fontSize: '12px', color: '#007bff' }}>
                        <strong>OTP:</strong> {ride.otp}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <RideActions 
              ride={ride} 
              onActionComplete={fetchActiveRides}
              disabled={loading}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveRidesPanel;