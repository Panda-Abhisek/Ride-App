import { useNavigate } from "react-router-dom";
import RideRequestForm from "../RideRequestForm.jsx";

const RideRequestPage = () => {
  const navigate = useNavigate();

  const handleRideCreated = (id) => {
    // Store the ride ID for active rides panel
    localStorage.setItem('recentRideId', id);
    navigate(`/rider/ride/${id}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Request a Ride</h2>
      <RideRequestForm onRideCreated={handleRideCreated} />
    </div>
  );
};

export default RideRequestPage;