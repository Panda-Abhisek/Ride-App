import React from 'react'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  }

  return (
    <>
      <div>
        <h1>Home Page</h1>
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Login
        </button>
      </div>
    </>
  )
}

export default HomePage