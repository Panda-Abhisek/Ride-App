import React, { useState, useEffect } from 'react';
import { getAllRides } from '../../api/admin.api.js';
import { formatCompletedTime } from '../../utils/formatters.js';

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const ridesData = await getAllRides();
        console.log("all rides data - ", ridesData[0]);
        setRides(ridesData || []);
      } catch (err) {
        console.error('Error fetching rides:', err);
        setError(err.response?.data?.message || 'Failed to fetch rides');
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) {
    return <div>Loading rides...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Rides</h2>
      {rides.length === 0 ? (
        <p>No rides found</p>
      ) : (
        <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Status</th>
              <th>Rider</th>
              <th>Driver</th>
              <th>From</th>
              <th>To</th>
              <th>Fare</th>
              <th>Started At</th>
            </tr>
          </thead>
          <tbody>
            {/* Ride ID | Status | Rider | Driver | From → To | Fare | Started At */}
            {rides.map((ride) => (
              <tr key={ride.id}>
                <td>{ride.status}</td>
                <td>{ride.user?.username || 'N/A'}</td>
                <td>{ride.driver?.name || ride.driverName || 'N/A'}</td>
                <td>{ride.pickupArea}</td>
                <td>{ride.destinationArea}</td>
                <td>{ride.fare}</td>
                <td>{formatCompletedTime(ride.startTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Rides;