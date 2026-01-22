import React from 'react';

const EmptyList = ({ 
  icon,
  title,
  description,
  action,
  size = 'medium',
  centered = true
}) => {
  const getContainerStyles = () => {
    const baseStyles = {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#666'
    };

    const sizes = {
      small: {
        padding: '20px 16px'
      },
      medium: {
        padding: '40px 20px'
      },
      large: {
        padding: '60px 30px'
      }
    };

    return {
      ...baseStyles,
      ...sizes[size],
      ...(centered && {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      })
    };
  };

  const iconStyle = {
    fontSize: size === 'small' ? '32px' : size === 'large' ? '64px' : '48px',
    color: '#cbd5e1',
    marginBottom: '16px'
  };

  const titleStyle = {
    fontSize: size === 'small' ? '16px' : size === 'large' ? '20px' : '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#475569'
  };

  const descriptionStyle = {
    fontSize: '14px',
    margin: '0 0 20px 0',
    lineHeight: '1.5',
    maxWidth: '400px'
  };

  return (
    <div style={getContainerStyles()}>
      {icon && <div style={iconStyle}>{icon}</div>}
      {title && <h3 style={titleStyle}>{title}</h3>}
      {description && <p style={descriptionStyle}>{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

// Preset configurations for common use cases
EmptyList.Presets = {
  NoRides: ({ onRefresh }) => ({
    icon: '🚗',
    title: 'No rides available',
    description: 'There are currently no rides matching your criteria.',
    action: onRefresh && (
      <button 
        onClick={onRefresh}
        style={{
          padding: '8px 16px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Refresh
      </button>
    )
  }),

  NoAllocatedRides: ({ onAcceptRide }) => ({
    icon: '📍',
    title: 'No allocated rides',
    description: 'You have no rides assigned to you at the moment.',
    action: onAcceptRide && (
      <button 
        onClick={onAcceptRide}
        style={{
          padding: '8px 16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Find Rides
      </button>
    )
  }),

  NoData: ({ message = 'No data available' }) => ({
    icon: '📋',
    title: message,
    description: 'Check back later for updates.'
  }),

  NetworkError: ({ onRetry }) => ({
    icon: '🔌',
    title: 'Connection issues',
    description: 'Unable to load data. Please check your connection and try again.',
    action: onRetry && (
      <button 
        onClick={onRetry}
        style={{
          padding: '8px 16px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
    )
  })
};

export default EmptyList;