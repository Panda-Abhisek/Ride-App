import React from 'react';
import MapView from '../components/MapView';

const MapTest = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Map View Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Basic Map (New York City)</h3>
        <MapView 
          latitude={40.7128} 
          longitude={-74.0060} 
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Map with Pickup and Destination</h3>
        <MapView 
          latitude={40.7580}
          longitude={-73.9855}
          pickupLat={40.7489}
          pickupLng={-73.9680}
          destinationLat={40.7614}
          destinationLng={-73.9776}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Map with only Pickup and Destination</h3>
        <MapView 
          pickupLat={40.7580}
          pickupLng={-73.9855}
          destinationLat={40.7489}
          destinationLng={-73.9680}
        />
      </div>
    </div>
  );
};

export default MapTest;