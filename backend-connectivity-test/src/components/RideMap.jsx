import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.7128,
  lng: -74.0060
};

const RideMap = ({ pickup, destination }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    
    if (pickup?.lat && pickup?.lng) {
      bounds.extend(new window.google.maps.LatLng(pickup.lat, pickup.lng));
    }
    
    if (destination?.lat && destination?.lng) {
      bounds.extend(new window.google.maps.LatLng(destination.lat, destination.lng));
    }
    
    if (bounds.isEmpty()) {
      map.setCenter(center);
    } else {
      map.fitBounds(bounds);
    }
    
    setMap(map);
  }, [pickup, destination]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {pickup?.lat && pickup?.lng && (
        <Marker
          position={{ lat: pickup.lat, lng: pickup.lng }}
          label="P"
          title="Pickup Location"
        />
      )}
      
      {destination?.lat && destination?.lng && (
        <Marker
          position={{ lat: destination.lat, lng: destination.lng }}
          label="D"
          title="Destination"
        />
      )}
    </GoogleMap>
  );
};

export default RideMap;