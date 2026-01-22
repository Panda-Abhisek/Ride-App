import React, { useState, useEffect } from 'react';
import { getRiderCompletedRides } from '../../api/profile.api.js';
import { useNavigate } from 'react-router-dom';
import { formatDuration, formatCompletedTime } from '../../utils/formatters.js';

const RecentActivity = () => {
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentRides = async () => {
      try {
        const rides = await getRiderCompletedRides();
        // Show last 3 rides
        setRecentRides(rides.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch recent rides:', error);
        setLoading(false);
      }
    };

    fetchRecentRides();
  }, []);

  if (loading) {
    return <div>Loading recent activity...</div>;
  }

  if (recentRides.length === 0) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h4>Recent Activity</h4>
        <p style={{ color: '#666' }}>No recent rides</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h4>Recent Activity</h4>
        <button
          onClick={() => navigate('/rider/history')}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          View All
        </button>
      </div>

      {recentRides.map(ride => (
        <div key={ride.id} style={{
          padding: '10px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p><strong>Date:</strong> {formatCompletedTime(ride.startTime)}</p>
            <p><strong>Fare:</strong> ₹{ride.fare}</p>
            <p><strong>Status:</strong> {ride.status}</p>
            {ride.duration !== undefined ?
              formatDuration(ride.duration, 'milliseconds') :
              'N/A'
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;