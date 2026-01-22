import React, { useState, useEffect } from 'react';
import { getAllDrivers } from '../../api/admin.api.js';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversData = await getAllDrivers();
        setDrivers(driversData || []);
      } catch (err) {
        console.error('Error fetching drivers:', err);
        setError(err.response?.data?.message || 'Failed to fetch drivers');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) {
    return <div>Loading drivers...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Drivers</h2>
      {drivers.length === 0 ? (
        <p>No drivers found</p>
      ) : (
        <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.name}</td>
                <td>{driver.email}</td>
                <td>{driver.mobile}</td>
                <td>{driver.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Drivers;