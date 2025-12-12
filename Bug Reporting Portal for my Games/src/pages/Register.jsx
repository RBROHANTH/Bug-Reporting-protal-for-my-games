import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = 'https://bug-reporting-protal-for-my-games.onrender.com/api'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (response.ok) {
        // Auto-login after successful registration
        const loginResponse = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
        if (loginResponse.ok) {
          const data = await loginResponse.json()
          localStorage.setItem('token', data.token)
          navigate('/home')
        }
      } else {
        const data = await response.json()
        setError(data.message || 'Registration failed.')
      }
    } catch (error) {
      setError('Error during registration')
    }
  }

  return (
    <div className="container">
      <h1>Register for Bug Reporting Portal</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div>
          <button type="submit">Register</button>
        </div>
        {error && <p className="error">{error}</p>}
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  )
}

export default Register
