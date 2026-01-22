import React, { useState, useEffect } from 'react';
import { getDriverProfile } from '../../api/profile.api.js';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getDriverProfile();
        setProfile(profileData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div>
      <h2>Driver Profile</h2>
      <div style={{ marginTop: '20px' }}>
        <p><strong>Name:</strong> {profile.userName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Mobile:</strong> {profile.mobile}</p>
        <p><strong>Rating:</strong> {profile.rating}</p>
        <p><strong>Vehicle:</strong> {profile.vehicle.make} {profile.vehicle.model}</p>
        <p><strong>License:</strong> {profile.license.licenseNumber}</p>
      </div>
    </div>
  );
};

export default ProfilePage;