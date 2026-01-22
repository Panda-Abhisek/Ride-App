// Utility functions for formatting ride data

/**
 * Formats duration from backend (seconds or milliseconds) into human-readable format
 * @param {number} duration - Duration value from backend API
 * @param {string} unit - Expected unit: 'seconds' or 'milliseconds' 
 * @returns {string} Formatted duration string
 */
export const formatDuration = (duration, unit = 'seconds') => {
  if (!duration || duration === 0) return '0 min 0 sec';
  
  // Convert to seconds if in milliseconds
  let totalSeconds = duration;
  if (unit === 'milliseconds') {
    totalSeconds = Math.floor(duration / 1000);
  }
  
  // Handle edge cases
  if (totalSeconds < 0) return '0 min 0 sec';
  if (!isFinite(totalSeconds)) return 'Invalid duration';
  
  // Calculate hours, minutes, seconds
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  // Format based on duration length
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  } else if (minutes > 0) {
    return `${minutes} min ${seconds} sec`;
  } else {
    return `${seconds} sec`;
  }
};

/**
 * Formats completed time from backend timestamp into human-readable format
 * @param {string} completedAt - ISO timestamp string
 * @returns {string} Formatted date/time string
 */
export const formatCompletedTime = (completedAt) => {
  if (!completedAt) return 'N/A';
  
  try {
    const date = new Date(completedAt);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    // Format: DD MMM YYYY, HH:MM AM/PM
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting completed time:', error);
    return 'Invalid date';
  }
};

/**
 * Analyzes duration unit by comparing with real calculated duration
 * @param {object} rideData - Ride object with duration, startTime, endTime
 * @returns {object} Analysis result with unit and realDuration
 */
export const analyzeDurationUnit = (rideData) => {
  if (!rideData) return null;

  const { duration, startTime, endTime } = rideData;
  
  if (!startTime || !endTime || duration === undefined) {
    return null;
  }

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const realDurationMs = end - start;
    const realDurationSeconds = Math.floor(realDurationMs / 1000);
    
    console.log('Duration Analysis:');
    console.log('- Backend duration:', duration);
    console.log('- Real duration (seconds):', realDurationSeconds);
    console.log('- Real duration (ms):', realDurationMs);
    
    // Compare backend duration with calculated duration
    const isSeconds = Math.abs(duration - realDurationSeconds) < 60; // Within 1 minute
    const isMilliseconds = Math.abs(duration - realDurationMs) < 60000; // Within 1 minute
    
    let detectedUnit = 'unknown';
    if (isSeconds) {
      detectedUnit = 'seconds';
    } else if (isMilliseconds) {
      detectedUnit = 'milliseconds';
    }
    
    console.log('- Detected unit:', detectedUnit);
    
    return {
      unit: detectedUnit,
      realDurationSeconds,
      realDurationMs,
      backendDuration: duration
    };
  } catch (error) {
    console.error('Error analyzing duration:', error);
    return null;
  }
};