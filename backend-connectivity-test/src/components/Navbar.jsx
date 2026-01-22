import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../api/auth.api';

const ROLE_LABELS = {
  ROLE_DRIVER: 'Driver',
  ROLE_RIDER: 'Rider',
  ROLE_ADMIN: 'Admin'
};

const getPrimaryRole = (user) => {
  if (!user?.roles || user.roles.length === 0) return null;
  return user.roles[0];
};

const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = getPrimaryRole(user);

  const getNavigationItems = () => {
    if (!user) {
      return [{ label: 'Login', path: '/login' }];
    }

    if (!role) {
      return [];
    }

    switch (role) {
      case 'ROLE_RIDER':
        return [
          { label: 'Dashboard', path: '/rider' },
          { label: 'History', path: '/rider/history' },
          { label: 'Profile', path: '/rider/profile' }
        ];
      case 'ROLE_DRIVER':
        return [
          { label: 'Dashboard', path: '/driver' },
          { label: 'History', path: '/driver/history' },
          { label: 'Profile', path: '/driver/profile' }
        ];
      case 'ROLE_ADMIN':
        return [
          { label: 'Dashboard', path: '/admin' },
          { label: 'Users', path: '/admin/users' },
          { label: 'Drivers', path: '/admin/drivers' },
          { label: 'Rides', path: '/admin/rides' }
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === '/') return 'Home';
    if (path === '/login') return 'Login';

    if (path === '/rider') return 'Rider Dashboard';
    if (path.startsWith('/rider/ride/')) return 'Ride Details';
    if (path === '/rider/history') return 'Ride History';
    if (path === '/rider/profile') return 'Rider Profile';

    if (path === '/driver') return 'Driver Dashboard';
    if (path.startsWith('/driver/ride/')) return 'Ride Details';
    if (path === '/driver/history') return 'Driver History';
    if (path === '/driver/profile') return 'Driver Profile';

    if (path.startsWith('/admin')) return 'Admin';

    return 'Ride Sharing App';
  };

  return (
    <nav
      style={{
        backgroundColor: '#2c3e50',
        padding: '0 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          height: '60px'
        }}
      >
        {/* Left side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1
            style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
              margin: 0
            }}
          >
            {getPageTitle()}
          </h1>

          <div style={{ display: 'flex', gap: '15px' }}>
            {getNavigationItems().map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    backgroundColor: 'transparent',
                    color: isActive ? '#3498db' : 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.color = '#3498db';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = 'white';
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {role && (
              <span style={{ color: 'white', fontSize: '14px' }}>
                {user.username} ({getRoleLabel(role)})
              </span>
            )}

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#c0392b';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#e74c3c';
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

