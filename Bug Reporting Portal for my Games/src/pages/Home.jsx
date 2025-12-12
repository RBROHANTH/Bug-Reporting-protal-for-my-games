import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:3000/api'

function BugReports() {
  const [bugReports, setBugReports] = useState([])
  const [gameName, setGameName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editGameName, setEditGameName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    } else {
      fetchBugReports()
    }
  }, [navigate])

  // Fetch all bug reports
  const fetchBugReports = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/Bug_Reports`)
      const data = await response.json()
      setBugReports(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch bug reports')
    } finally {
      setLoading(false)
    }
  }

  // Add new bug report
  const handleAddBugReport = async (e) => {
    e.preventDefault()
    if (!gameName.trim() || !description.trim()) return

    try {
      const response = await fetch(`${API_URL}/Bug_Reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameName: gameName,
          description: description
        })
      })
      if (response.ok) {
        setGameName('')
        setDescription('')
        fetchBugReports()
      } else {
        const data = await response.json()
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to add bug report')
    }
  }

  const handleStartEdit = (bugReport) => {
    setEditingId(bugReport._id)
    setEditGameName(bugReport.gameName || '')
    setEditDescription(bugReport.description || '')
  }

  // Save edit
  const handleSaveEdit = async (bugReport) => {
    if (!editGameName?.trim() || !editDescription?.trim()) return

    try {
      const response = await fetch(`${API_URL}/Bug_Reports/${bugReport._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameName: editGameName,
          description: editDescription
        })
      })
      if (response.ok) {
        setEditingId(null)
        setEditGameName('')
        setEditDescription('')
        fetchBugReports()
      }
    } catch (err) {
      setError('Failed to update bug report')
    }
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditGameName('')
    setEditDescription('')
  }

  // Delete bug report
  const handleDeleteBugReport = async (id) => {
    try {
      const response = await fetch(`${API_URL}/Bug_Reports/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchBugReports()
      }
    } catch (err) {
      setError('Failed to delete bug report')
    }
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }
  const gotoAmbuli = () => {
    navigate('/games/ambuli')
  }
  const gotoEcoQuest = () => {
    navigate('/games/eco-quest')
  }
  const gotoNeuronX = () => {
    navigate('/games/neuronx')
  }

  return (
    <div className="app">
      <div className="bug-report-container">
        <div className="header">
          <h1>🐞 Bug Reporting Portal</h1>
          <h3>Choose Your Game that has Bugs</h3>
          <button onClick={gotoAmbuli} className="logout-btn">Ambuli</button>
          <button onClick={gotoEcoQuest} className="logout-btn">Eco-Quest</button>
          <button onClick={gotoNeuronX} className="logout-btn">NeuronX</button>
        </div>
  </div>
  </div>
        
  )
}

export default BugReports
