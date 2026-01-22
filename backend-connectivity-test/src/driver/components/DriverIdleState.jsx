import React from 'react';
import AllocatedRidesSection from '../dashboard/AllocatedRidesSection.jsx';
import { formatCompletedTime } from '../../utils/formatters.js';

const DriverIdleState = ({ allocatedRides }) => {
  if (!allocatedRides || allocatedRides.length === 0) {
    return (
      <div style={{ padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ color: '#666', marginBottom: '10px' }}>No Active Rides</h2>
          <p style={{ color: '#999', fontStyle: 'italic' }}>We are actively monitoring for available rides in your area. New ride requests will appear here automatically when assigned to you.</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '16px', color: '#666', marginTop: '10px' }}>Checking for available rides...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '10px',
            color: '#28a745'
          }}>
            🚗
          </div>
        </div>
        <div>
          <h3 style={{ 
            color: '#28a745',
            fontSize: '20px',
            fontWeight: '600',
            margin: '0',
            lineHeight: '1.2'
          }}>
            {allocatedRides.length} Ride{allocatedRides.length > 1 ? 's' : ''} Available
          </h3>
        </div>
      </div>

      <AllocatedRidesSection 
        rides={allocatedRides} 
        onRideUpdate={() => window.location.reload()} 
      />
    </div>
  );
};

export default DriverIdleState;