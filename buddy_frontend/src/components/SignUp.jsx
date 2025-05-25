import { useState } from 'react'
import axiosInstance from '../api/Axios' // Import the configured Axios instance

function SignUp() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    password2: '',
    email: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getCookie = (name) => {
    let cookieValue = null
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
          break
        }
      }
    }
    return cookieValue
  }

  const fetchCSRFToken = async () => {
    try {
      await axiosInstance.get('/api/auth/csrf/')
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await fetchCSRFToken()

    try {
      const response = await axiosInstance.post('/api/auth/register/', credentials, {
        headers: {
          'X-CSRFToken': getCookie('csrftoken')
        }
      })

      if (response.status === 201 || response.status === 200) {
        setError('Registration successful! Please login.')
        setCredentials({
          username: '',
          password: '',
          password2: '',
          email: ''
        })
        window.location.href = '/login'
      } else {
        setError('Registration failed with status: ' + response.status)
      }
    } catch (err) {
      console.error('Registration error:', err)
      if (err.response) {
        const errorData = err.response.data
        if (errorData.username) {
          setError(`Username error: ${errorData.username.join(', ')}`)
        } else if (errorData.email) {
          setError(`Email error: ${errorData.email.join(', ')}`)
        } else if (errorData.password) {
          setError(`Password error: ${errorData.password.join(', ')}`)
        } else if (errorData.password2) {
          setError(`Password confirmation error: ${errorData.password2.join(', ')}`)
        } else {
          setError(errorData.detail || 'Registration failed. Please try again.')
        }
      } else {
        setError('Server error. Please try again later.')
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
            placeholder="Choose a username"
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            autoComplete="email"
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
            placeholder="Choose a password"
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={credentials.password2}
            onChange={handleChange}
            required
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp
