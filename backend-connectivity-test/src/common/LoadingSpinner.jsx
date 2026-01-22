import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium',
  text,
  inline = false,
  overlay = false
}) => {
  const getSpinnerSize = () => {
    const sizes = {
      small: '16px',
      medium: '24px',
      large: '32px'
    };
    return sizes[size];
  };

  const getContainerStyles = () => {
    if (inline) {
      return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      };
    }

    if (overlay) {
      return {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      };
    }

    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '20px'
    };
  };

  const spinnerStyle = {
    width: getSpinnerSize(),
    height: getSpinnerSize(),
    border: `3px solid #f3f3f3`,
    borderTop: `3px solid #3498db`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const textStyle = {
    color: '#666',
    fontSize: '14px',
    textAlign: 'center'
  };

  return (
    <div style={getContainerStyles()}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
      {text && <div style={textStyle}>{text}</div>}
    </div>
  );
};

export default LoadingSpinner;