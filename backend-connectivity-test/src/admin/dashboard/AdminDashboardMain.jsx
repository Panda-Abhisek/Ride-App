import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../api/auth.api.jsx';
import { getAllRiders, getAllDrivers, getAllRides } from '../../api/admin.api.js';

const AdminDashboardMain = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDrivers: 0,
        totalRides: 0,
        activeRides: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [ridersData, driversData, ridesData] = await Promise.all([
                    getAllRiders(),
                    getAllDrivers(),
                    getAllRides()
                ]);

                // Calculate stats from real data
                const totalUsers = ridersData?.length || 0;
                const totalDrivers = driversData?.length || 0;
                const totalRides = ridesData?.length || 0;
                const activeRides = ridesData?.filter(ride => ride.status === 'ACTIVE' || ride.status === 'IN_PROGRESS')?.length || 0;

                setStats({
                    totalUsers,
                    totalDrivers,
                    totalRides,
                    activeRides
                });
            } catch (err) {
                console.error('Error fetching admin stats:', err);
                setError('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: '👥',
            color: '#3498db',
            link: '/admin/users'
        },
        {
            title: 'Total Drivers',
            value: stats.totalDrivers,
            icon: '🚗',
            color: '#2ecc71',
            link: '/admin/drivers'
        },
        {
            title: 'Total Rides',
            value: stats.totalRides,
            icon: '📍',
            color: '#f39c12',
            link: '/admin/rides'
        }
    ];

    const quickActions = [
        {
            title: 'Manage Users',
            description: 'View and manage all user accounts',
            icon: '👤',
            link: '/admin/users'
        },
        {
            title: 'Driver Management',
            description: 'Approve drivers and manage their profiles',
            icon: '🚙',
            link: '/admin/drivers'
        },
        {
            title: 'Ride Monitoring',
            description: 'Track active rides and ride history',
            icon: '🗺️',
            link: '/admin/rides'
        }
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <div style={{ fontSize: '18px', color: '#666' }}>Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* Header Section */}
            <div style={{
                border: '1px solid #fff',
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '30px',
                color: 'white',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <p style={{ margin: '0', fontSize: '16px', opacity: '0.9' }}>
                    Welcome back, {user?.userName || user?.username || 'Admin'}
                </p>
                <div style={{ marginTop: '15px', fontSize: '14px', opacity: '0.8' }}>
                    Role: {user?.roles?.join(', ') || 'No roles assigned'}
                </div>
            </div>

            {error && (
                <div style={{
                    // backgroundColor: '#fee',
                    color: '#c33',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    border: '1px solid #fcc'
                }}>
                    {error}
                </div>
            )}

            {/* Statistics Cards and Quick Actions Side by Side */}
            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '30px'
            }}>
                {/* Statistics Cards */}
                <div style={{ flex: '1' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#fff' }}>
                        Statistics
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '15px'
                    }}>
                        {statCards.map((card, index) => (
                            <Link
                                key={index}
                                to={card.link}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}
                            >
                                <div
                                    style={{
                                        borderRadius: '10px',
                                        padding: '20px',
                                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                                        border: '1px solid #e1e8ed',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        color: 'white'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{
                                            fontSize: '28px',
                                            marginRight: '15px',
                                            width: '45px',
                                            height: '45px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: card.color + '20',
                                            borderRadius: '8px',
                                        }}>
                                            {card.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '13px', color: '#fff', marginBottom: '5px' }}>
                                                {card.title}
                                            </div>
                                            <div style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
                                                {card.value.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardMain;