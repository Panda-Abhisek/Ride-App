import React from 'react';

const MainContentCard = ({ children }) => {
  return (
    <div style={{
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {children}
    </div>
  );
};

export default MainContentCard;