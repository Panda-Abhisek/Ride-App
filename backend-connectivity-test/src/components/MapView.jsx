import React, { useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const MapView = ({ 
  latitude, 
  longitude, 
  pickupLat, 
  pickupLng, 
  destinationLat, 
  destinationLng,
  zoom = 12 
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const center = {
    lat: latitude || 40.7128,
    lng: longitude || -74.0060
  };

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    
    // Add center point if provided
    if (latitude && longitude) {
      bounds.extend(new window.google.maps.LatLng(latitude, longitude));
    }
    
    // Add pickup location if provided
    if (pickupLat && pickupLng) {
      bounds.extend(new window.google.maps.LatLng(pickupLat, pickupLng));
    }
    
    // Add destination location if provided
    if (destinationLat && destinationLng) {
      bounds.extend(new window.google.maps.LatLng(destinationLat, destinationLng));
    }
    
    // If we have bounds with points, fit the map to show all points
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    } else {
      // Otherwise use the default center and zoom
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [latitude, longitude, pickupLat, pickupLng, destinationLat, destinationLng, zoom]);

  const onUnmount = useCallback(function callback() {
    // Cleanup if needed
  }, []);

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Center point marker */}
      {latitude && longitude && (
        <Marker
          position={{ lat: latitude, lng: longitude }}
          title="Location"
        />
      )}
      
      {/* Pickup marker */}
      {pickupLat && pickupLng && (
        <Marker
          position={{ lat: pickupLat, lng: pickupLng }}
          label="P"
          title="Pickup Location"
        />
      )}
      
      {/* Destination marker */}
      {destinationLat && destinationLng && (
        <Marker
          position={{ lat: destinationLat, lng: destinationLng }}
          label="D"
          title="Destination"
        />
      )}
    </GoogleMap>
  );
};

export default MapView;