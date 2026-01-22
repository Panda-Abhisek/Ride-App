import { useState } from 'react';
import { pingApiRoot, pingHome } from './api/health.api.js';
import { ErrorMessage, LoadingSpinner } from './common';

function BackendTest() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePingApiRoot = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    console.log('Request fired: GET /api');

    try {
      const data = await pingApiRoot();
      console.log('Response received from /api');
      console.log('Cookies present:', document.cookie ? 'Yes' : 'No');
      setMessage(`Success: ${JSON.stringify(data)}`);
    } catch (err) {
      console.log('Error response from /api');
      console.log('Cookies present:', document.cookie ? 'Yes' : 'No');
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePingHome = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    console.log('Request fired: GET /api/home');

    try {
      const data = await pingHome();
      console.log('Response received from /api/home');
      console.log('Cookies present:', document.cookie ? 'Yes' : 'No');
      setMessage(`Success: ${JSON.stringify(data)}`);
    } catch (err) {
      console.log('Error response from /api/home');
      console.log('Cookies present:', document.cookie ? 'Yes' : 'No');
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backend-test">
      <div className="buttons">
        <button
          onClick={handlePingApiRoot}
          disabled={loading}
        >
          Ping /api
        </button>

        <button
          onClick={handlePingHome}
          disabled={loading}
        >
          Ping /api/home
        </button>
      </div>

      {loading && <LoadingSpinner text="Pinging server..." />}

      {message && <div className="success">{message}</div>}

      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default BackendTest;