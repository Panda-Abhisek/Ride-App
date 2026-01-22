import { Outlet } from "react-router-dom";

const RiderDashboard = () => {
  return (
    <div>
      <h2>Rider Dashboard</h2>
      <Outlet />
    </div>
  );
};

export default RiderDashboard;