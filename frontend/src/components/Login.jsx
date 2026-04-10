// Login.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/Axios';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState('login');
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [requestEmail, setRequestEmail] = useState('');
  const [resetValues, setResetValues] = useState({
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  useEffect(() => {
    if (uid && token) {
      setMode('confirm');
    }
  }, [uid, token]);

  const resetFeedback = () => {
    setError('');
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetValueChange = (e) => {
    const { name, value } = e.target;
    setResetValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const switchMode = (nextMode) => {
    resetFeedback();
    setMode(nextMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFeedback();
    try {
      await login(credentials);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    resetFeedback();
    try {
      const response = await axiosInstance.post('/api/auth/password-reset/request/', {
        email: requestEmail
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to send reset link. Please try again.');
    }
  };

  const handleResetConfirm = async (e) => {
    e.preventDefault();
    resetFeedback();
    try {
      const response = await axiosInstance.post('/api/auth/password-reset/confirm/', {
        uid,
        token,
        password: resetValues.password,
        password2: resetValues.password2
      });
      setMessage(response.data.message);
      setResetValues({ password: '', password2: '' });
      setSearchParams({});
      setMode('login');
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.password?.[0] || err.response?.data?.password2?.[0] || 'Unable to reset password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>BuddyPlanner</h1>
      {mode === 'login' && (
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username: </label>
            <input type="text" id="username" name="username" value={credentials.username} onChange={handleChange} required autoComplete="username" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} required autoComplete="current-password" />
          </div>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <button type="submit">Login</button>
          <button type="button" onClick={() => switchMode('request')}>Forgot password?</button>
        </form>
      )}
      {mode === 'request' && (
        <form onSubmit={handleResetRequest} className="login-form">
          <div className="form-group">
            <label htmlFor="reset-email">Email: </label>
            <input type="email" id="reset-email" value={requestEmail} onChange={(e) => setRequestEmail(e.target.value)} required autoComplete="email" />
          </div>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <button type="submit">Send reset link</button>
          <button type="button" onClick={() => switchMode('login')}>Back to login</button>
        </form>
      )}
      {mode === 'confirm' && (
        <form onSubmit={handleResetConfirm} className="login-form">
          <div className="form-group">
            <label htmlFor="new-password">New Password: </label>
            <input type="password" id="new-password" name="password" value={resetValues.password} onChange={handleResetValueChange} required autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password: </label>
            <input type="password" id="confirm-password" name="password2" value={resetValues.password2} onChange={handleResetValueChange} required autoComplete="new-password" />
          </div>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <button type="submit">Reset password</button>
        </form>
      )}
    </div>
  );
}

export default Login;
