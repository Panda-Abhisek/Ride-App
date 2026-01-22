import React from 'react';
import QuickRideRequest from '../components/QuickRideRequest.jsx';
import RecentActivity from '../components/RecentActivity.jsx';
import QuickActiveRides from '../components/QuickActiveRides.jsx';

const RiderDashboardMain = () => {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h3>Welcome back!</h3>
        <p>Manage your rides and view your activity</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <QuickRideRequest />
        <QuickActiveRides />
      </div>
      
      <RecentActivity />
    </div>
  );
};

export default RiderDashboardMain;