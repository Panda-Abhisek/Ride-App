import React from 'react';
import RideCard from './RideCard.jsx';
import { EmptyList } from '../common';

const AllocatedRides = ({ rides }) => {
  if (!rides || rides.length === 0) {
    return (
      <div>
        <h3>Allocated Rides</h3>
        <EmptyList {...EmptyList.Presets.NoAllocatedRides({})} />
      </div>
    );
  }

  return (
    <div>
      <h3>Allocated Rides</h3>
      {rides.map((ride) => (
        <RideCard key={ride.id} ride={ride} />
      ))}
    </div>
  );
};

export default AllocatedRides;