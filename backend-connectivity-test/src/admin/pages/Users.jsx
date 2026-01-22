import React, { useState, useEffect } from 'react';
import { getAllRiders } from '../../api/admin.api.js';

/* =====================
   HELPERS
   ===================== */
const getPrimaryRoleName = (user) =>
  user?.roles?.[0]?.roleName || 'UNKNOWN';

const formatRole = (roleName) =>
  roleName.replace('ROLE_', '');

/* =====================
   COMPONENT
   ===================== */
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllRiders();
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px'
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>User ID</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const roleName = getPrimaryRoleName(user);

              return (
                <tr key={user.userId}>
                  <td style={tdStyle}>{user.userId}</td>
                  <td style={tdStyle}>{user.username}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>{formatRole(roleName)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left',
  fontWeight: '600'
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px'
};

export default Users;
