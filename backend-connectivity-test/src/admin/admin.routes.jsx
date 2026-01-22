import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard.jsx';
import Rides from './pages/Rides.jsx';
import Users from './pages/Users.jsx';
import Drivers from './pages/Drivers.jsx';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="rides" element={<Rides />} />
      <Route path="users" element={<Users />} />
      <Route path="drivers" element={<Drivers />} />
    </Routes>
  );
};

export default AdminRoutes;