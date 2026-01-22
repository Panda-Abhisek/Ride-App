import React from 'react';

const ErrorMessage = ({ 
  message, 
  variant = 'default',
  size = 'medium',
  dismissible = false,
  onDismiss 
}) => {
  const getStyles = () => {
    const baseStyles = {
      padding: '12px 16px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'inherit'
    };

    const variants = {
      default: {
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        color: '#c53030'
      },
      warning: {
        backgroundColor: '#fffbf0',
        border: '1px solid #fed7aa',
        color: '#d97706'
      },
      info: {
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        color: '#1d4ed8'
      }
    };

    const sizes = {
      small: {
        padding: '8px 12px',
        fontSize: '12px'
      },
      medium: {
        padding: '12px 16px',
        fontSize: '14px'
      },
      large: {
        padding: '16px 20px',
        fontSize: '16px'
      }
    };

    return {
      ...baseStyles,
      ...variants[variant],
      ...sizes[size]
    };
  };

  if (!message) return null;

  return (
    <div style={getStyles()}>
      <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
      <span style={{ flex: 1 }}>{message}</span>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0',
            lineHeight: 1,
            opacity: 0.7
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;