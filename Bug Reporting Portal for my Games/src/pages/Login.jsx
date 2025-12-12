import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = 'http://localhost:3000/api'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        navigate('/home')
      } else {
        const data = await response.json()
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to login')
    }
  }

  return (
    <div className="container">
      <h1>Login to Bug Reporting Portal</h1>
      <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </div>
        {error && <p className="error">{error}</p>}
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  )
}

export default Login
