import React, { useState, useEffect } from 'react';
import { getCurrentRide, getAllocatedRides } from '../../api/rides.api.js';
import { useAuth } from '../../api/auth.api.jsx';
import ActiveRideSection from './ActiveRideSection.jsx';
import AllocatedRidesSection from './AllocatedRidesSection';
import EmptyState from './EmptyState.jsx';

const DriverDashboard = () => {
    const { user } = useAuth();
    const [currentRide, setCurrentRide] = useState(null);
    const [allocatedRides, setAllocatedRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Extract driver ID from user object
    const getDriverId = () => {
        return user?.id || user?.userId;
    };

    // Determine driver availability status
    const getAvailabilityStatus = () => {
        if (loading) return 'Loading...';
        if (currentRide) return 'On Ride';
        if (allocatedRides.length > 0) return 'Available';
        return 'Idle';
    };

    // Smart polling that only runs when needed
    useEffect(() => {
        if (!user) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        const fetchDriverState = async () => {
            console.log('Improved Driver Dashboard is working');
            try {
                const driverId = getDriverId();
                console.log('Fetching driver state for ID:', driverId);

                if (!driverId) {
                    throw new Error('Driver ID not found');
                }

                const [currentRideData, allocatedRidesData] = await Promise.all([
                    getCurrentRide(driverId).catch(err => {
                        console.log('Current ride API error:', err);
                        return null;
                    }),
                    getAllocatedRides(driverId).catch(err => {
                        console.log('Allocated rides API error:', err);
                        return [];
                    })
                ]);

                console.log('Driver state fetched:', { currentRideData, allocatedRidesData });
                setCurrentRide(currentRideData);
                setAllocatedRides(allocatedRidesData || []);
                setLoading(false);
                setError('');

                // Return whether we should continue polling
                return !!(currentRideData || (allocatedRidesData && allocatedRidesData.length > 0));
            } catch (err) {
                console.error('Failed to fetch driver state:', err);
                setError('Failed to load driver dashboard');
                setLoading(false);
                return false;
            }
        };

        let intervalId = null;
        let shouldPoll = true;

        const startPolling = async () => {
            const continuePolling = await fetchDriverState();

            if (continuePolling && shouldPoll) {
                intervalId = setTimeout(startPolling, 5000);
            } else {
                console.log('DriverDashboard: Stopping polling - completely idle');
                intervalId = null;
            }
        };

        // Start smart polling cycle
        startPolling();

        // Cleanup
        return () => {
            shouldPoll = false;
            if (intervalId) {
                clearTimeout(intervalId);
            }
        };
    }, [user]);

    const getAvailabilityColor = () => {
        const status = getAvailabilityStatus();
        switch (status) {
            case 'On Ride': return '#dc3545'; // red
            case 'Available': return '#28a745'; // green
            case 'Idle': return '#6c757d'; // gray
            default: return '#ffc107'; // yellow
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <DashboardHeader
                    driverName={user?.username || 'Driver'}
                    availabilityStatus="Loading..."
                    availabilityColor="#ffc107"
                />
                <div style={{ textAlign: 'center', padding: '40px', color: 'black' }}>
                    Loading dashboard...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <DashboardHeader
                    driverName={user?.username || 'Driver'}
                    availabilityStatus="Error"
                    availabilityColor="#dc3545"
                />
                <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
                    {error}
                </div>
            </div>
        );
    }

    const availabilityStatus = getAvailabilityStatus();
    const availabilityColor = getAvailabilityColor();

    return (
        <div style={{ padding: '20px' }}>
            {/* Persistent Header */}
            <DashboardHeader
                driverName={user?.username || 'Driver'}
                availabilityStatus={availabilityStatus}
                availabilityColor={availabilityColor}
            />

            {/* Primary Action Section */}
            <div style={{ marginTop: '30px' }}>
                {currentRide ? (
                    <ActiveRideSection
                        ride={currentRide}
                        onRideComplete={() => setCurrentRide(null)}
                    />
                ) : allocatedRides.length > 0 ? (
                    <AllocatedRidesSection
                        rides={allocatedRides}
                        onRideUpdate={() => {
                            // Refetch state after ride is accepted/declined
                            // Polling will handle this automatically
                        }}
                    />
                ) : (
                    <EmptyState status="idle" />
                )}
            </div>
        </div>
    );
};

// Header Component
const DashboardHeader = ({ driverName, availabilityStatus, availabilityColor }) => {
    return (
        <div style={{
            backgroundColor: '',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: '0', color: '#fff', fontSize: '18px' }}>
                        {driverName}
                    </h3>
                    <p style={{ margin: '5px 0 0 0', color: '#fff', fontSize: '14px' }}>
                        Driver Dashboard
                    </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        backgroundColor: availabilityColor,
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}>
                        {availabilityStatus}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;