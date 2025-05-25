// Login.jsx
import { useState, useEffect } from 'react'
import axiosInstance from '../api/Axios'

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [csrfToken, setCsrfToken] = useState('')

  const getCSRFToken = () => {
    const name = 'csrftoken'
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1))
      }
    }
    return ''
  }

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/auth/csrf/', {
          method: 'GET',
          credentials: 'include'
        })
        console.log('✅ CSRF token response:', response.status)

        // Wait briefly to allow the browser to store the cookie
        setTimeout(() => {
          const token = getCSRFToken()
          setCsrfToken(token)
          console.log('✅ CSRF token set (delayed read):', token)
        }, 100)
      } catch (err) {
        console.error('❌ Failed to fetch CSRF token:', err)
      }
    }

    fetchCSRFToken()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!csrfToken || csrfToken.length < 32) {
      setError('CSRF token missing. Please refresh the page.')
      return
    }

    try {
      const response = await axiosInstance.post(
        '/api/token/',
        credentials,
        {
          headers: {
            'X-CSRFToken': csrfToken
          }
        }
      )

      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
      window.location.href = '/dashboard'
    } catch (err) {
      console.error('Login error:', err)
      if (err.response && err.response.status === 403) {
        setError('CSRF error. Try refreshing the page.')
      } else {
        setError('Invalid credentials or server error.')
      }
    }
  }

  return (
    <div className="login-container">
      <h1>BuddyPlanner</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
