import React from 'react';

// Reusable UI Components

const StatusIndicator = ({ status, color, size = 'medium' }) => {
  const sizeStyles = {
    small: { width: '24px', height: '24px', fontSize: '14px' },
    medium: { width: '32px', height: '32px', fontSize: '16px' },
    large: { width: '48px', height: '48px', fontSize: '20px' }
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e9ecef',
      borderRadius: '50%',
      ...sizeStyles[size],
      color: '#666'
    }}>
      {status}
    </div>
  );
};

const LoadingSpinner = () => (
  <div style={{
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '2px solid #e9ecef',
      borderTop: '2px solid #fff',
      borderRight: '2px solid #fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
);

const Button = ({ children, variant = 'primary', size = 'medium', disabled = false, onClick, style = {}, ...props }) => {
  const getButtonStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '600',
      fontFamily: 'inherit'
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? '#6c757d' : '#28a745',
        color: 'white',
        boxShadow: disabled ? 'none' : '0 4px 6px rgba(40,167,69,0.3)'
      },
      secondary: {
        backgroundColor: disabled ? '#6c757d' : '#6c757d',
        color: disabled ? '#999' : 'white',
        boxShadow: disabled ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
      },
      ghost: {
        backgroundColor: disabled ? '#f8f9fa' : 'transparent',
        color: disabled ? '#999' : '#28a745',
        border: `2px solid ${disabled ? '#e9ecef' : '#28a745'}`,
        backgroundColor: 'transparent'
      }
    };

    const sizeStyles = {
      small: { padding: '8px 16px', fontSize: '14px' },
      medium: { padding: '12px 24px', fontSize: '16px' },
      large: { padding: '16px 32px', fontSize: '18px' }
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          ...baseStyles,
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...style
        }}
        {...props}
      >
        {children}
      </button>
    );
};

const Card = ({ children, shadow = true, style = {}, ...props }) => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        boxShadow: shadow ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const InfoRow = ({ label, value, size = 'medium', ...props }) => {
  const sizeStyles = {
    small: { fontSize: '14px', padding: '4px 0' },
    medium: { fontSize: '16px', padding: '6px 0' },
    large: { fontSize: '18px', padding: '8px 0' }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', ...sizeStyles[size], ...props }}>
      <span style={{ color: '#666', ...sizeStyles[size] }}>{label}</span>
      <span style={{ fontWeight: '600', color: '#2c3e50', ...sizeStyles[size] }}>{value}</span>
    </div>
  );
};

export {
  StatusIndicator,
  LoadingSpinner,
  Button,
  Card,
  InfoRow
};