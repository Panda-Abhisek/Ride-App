import React, { useState, useEffect } from 'react';
import { getDriverCompletedRides } from '../../api/profile.api.js';
import { formatDuration, formatCompletedTime } from '../../utils/formatters.js';

const DriverRideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const ridesData = await getDriverCompletedRides();
        console.log("rides data in ride history in driver history ", ridesData);
        setRides(ridesData);
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
              <td>{formatDuration(ride.duration)}</td>
              <td>{formatCompletedTime(ride.startTime)}</td>
              <td>{formatCompletedTime(ride.endTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverRideHistory;