import React from 'react';

const EmptyState = ({ status }) => {
  const getStateContent = () => {
    switch (status) {
      case 'idle':
        return {
          emoji: '⏸',
          title: 'You\'re All Caught Up',
          message: 'No new ride requests available at the moment.',
          submessage: 'We\'ll notify you when rides are available in your area.'
        };

      case 'loading':
        return {
          emoji: '⏳',
          title: 'Loading...',
          message: 'Fetching your current status...',
          submessage: 'This should only take a moment.'
        };

      case 'error':
        return {
          emoji: '⚠️',
          title: 'Something Went Wrong',
          message: 'Unable to load driver dashboard.',
          submessage: 'Please refresh the page or try again later.'
        };

      default:
        return {
          emoji: '❓',
          title: 'No Information',
          message: 'Unable to determine current status.',
          submessage: 'Please contact support if this continues.'
        };
    }
  };

  const content = getStateContent();

  return (
    <div style={{
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      backgroundColor: '',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>
        {content.emoji}
      </div>
      
      <h3 style={{ 
        color: '#6c757d', 
        marginBottom: '15px',
        fontSize: '20px'
      }}>
        {content.title}
      </h3>
      
      <p style={{ 
        color: '#666', 
        fontSize: '16px',
        marginBottom: '10px',
        lineHeight: '1.5'
      }}>
        {content.message}
      </p>
      
      {content.submessage && (
        <p style={{ 
          color: '#999', 
          fontSize: '14px',
          fontStyle: 'italic'
        }}>
          {content.submessage}
        </p>
      )}
    </div>
  );
};

export default EmptyState;