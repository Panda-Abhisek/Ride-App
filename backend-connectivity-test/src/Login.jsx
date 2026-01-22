import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './api/auth.api.jsx';
import { ErrorMessage } from './common';

const Login = () => {
  const [credentials, setCredentials] = useState({
    userName: '',
    password: ''
  });
  const [error, setError] = useState('');

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  console.log("User from login jsx - ", user);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(credentials);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  useEffect(() => {
    if (!loading && user) {
      const role = user.roles?.[0];

      if (role === 'ROLE_ADMIN') {
        navigate('/admin', { replace: true });
      } else if (role === 'ROLE_DRIVER') {
        navigate('/driver', { replace: true });
      } else if (role === 'ROLE_RIDER') {
        navigate('/rider', { replace: true });
      }
    }
  }, [user, loading, navigate]);
  console.log("Login page auth state:", { user, loading });


  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="userName" style={{ display: 'block', marginBottom: '5px' }}>
            Username:
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={credentials.userName}
            onChange={handleChange}
            disabled={loading}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            disabled={loading}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default Login;
