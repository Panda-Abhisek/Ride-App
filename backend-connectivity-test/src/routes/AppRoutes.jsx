import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../Login.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import BackendTest from '../BackendTest.jsx';
import RideDetails from '../rider/RideDetails.jsx';
import RiderHome from '../rider/RiderHome.jsx';
import RiderProfilePage from '../rider/profile/ProfilePage.jsx';
import RideRequestPage from '../rider/ride/RideRequestPage.jsx';
import RideHistory from '../rider/profile/RideHistory.jsx';
import DriverDashboard from '../driver/DriverDashboard.jsx';
import DriverHome from '../driver/DriverHome.jsx';
import DriverRideDetails from '../driver/DriverRideDetails.jsx';
import DriverProfilePage from '../driver/profile/ProfilePage.jsx';
import MapTest from '../components/MapTest.jsx';
import Navbar from '../components/Navbar.jsx';
import RiderDashboard from '../rider/RiderDashboard.jsx';
import ActiveRidesPanel from '../rider/components/ActiveRidesPanel.jsx';
import HomePage from '../HomePage.jsx';
import DriverRideHistory from '../driver/profile/DriverRideHistory.jsx';
import AdminDashboard from '../admin/AdminDashboard.jsx';
import AdminHome from '../admin/AdminHome.jsx';
import Users from '../admin/pages/Users.jsx';
import Drivers from '../admin/pages/Drivers.jsx';
import Rides from '../admin/pages/Rides.jsx';

// const AdminArea = () => <div>Admin Area</div>;

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <main style={{ padding: '20px', minHeight: 'calc(100vh - 60px)' }}>
        <Routes>
          {/* <Route path="/" element={<BackendTest />} /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/rider"
            element={
              <ProtectedRoute requiredRoles={['ROLE_RIDER']}>
                <RiderDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<RiderHome />} />
            <Route path="request" element={<RideRequestPage />} />
            <Route path="request/active" element={<ActiveRidesPanel />} />
            <Route path="ride/:id" element={<RideDetails />} />
            <Route path="history" element={<RideHistory />} />
            <Route path="/rider/profile" element={<RiderProfilePage />} />
          </Route>

          <Route
            path="/driver"
            element={
              <ProtectedRoute requiredRoles={['ROLE_DRIVER']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DriverHome />} />
            <Route path="history" element={<DriverRideHistory />} />
            <Route path="ride/:rideId" element={<DriverRideDetails />} />
            <Route path="/driver/profile" element={<DriverProfilePage />} />
          </Route>

          <Route path="/map-test" element={<MapTest />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="users" element={<Users />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="rides" element={<Rides />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
};

export default AppRoutes;