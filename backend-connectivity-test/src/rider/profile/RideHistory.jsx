import React, { useState, useEffect } from 'react';
import { getRiderCompletedRides } from '../../api/profile.api.js';
import { formatDuration, formatCompletedTime, analyzeDurationUnit } from '../../utils/formatters.js';

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [durationUnit, setDurationUnit] = useState('seconds'); // Default assumption
  console.log("Ride Details: ", rides);
  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const ridesData = await getRiderCompletedRides();
        setRides(ridesData || []);
        
        // Analyze first completed ride to determine duration unit
        if (ridesData && ridesData.length > 0) {
          const firstCompletedRide = ridesData.find(ride => 
            ride.status === 'COMPLETED' && ride.duration !== undefined
          );
          
          if (firstCompletedRide) {
            const analysis = analyzeDurationUnit(firstCompletedRide);
            if (analysis && analysis.unit !== 'unknown') {
              setDurationUnit(analysis.unit);
              console.log('Duration unit detected:', analysis.unit);
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch ride history');
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, []);

  if (loading) {
    return <div>Loading ride history...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!rides || rides.length === 0) {
    return <div>No completed rides found</div>;
  }

  return (
    <div>
      <h2>Ride History</h2>
      {/* {durationUnit !== 'unknown' && (
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          Duration format: {durationUnit === 'seconds' ? 'Seconds' : 'Milliseconds'}
        </p>
      )} */}
      <table border="1" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Pickup Area</th>
            <th>Destination Area</th>
            <th>Fare (₹)</th>
            <th>Distance</th>
            <th>Duration</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((ride) => (
            <tr key={ride.id}>
              <td>{ride.pickupArea}</td>
              <td>{ride.destinationArea}</td>
              <td>₹{ride.fare}</td>
              <td>{ride.distance} km</td>
              <td>
                {ride.duration !== undefined ? 
                  formatDuration(ride.duration, durationUnit) : 
                  'N/A'
                }
              </td>
              <td>{formatCompletedTime(ride.startTime)}</td>
              <td>{formatCompletedTime(ride.endTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RideHistory;