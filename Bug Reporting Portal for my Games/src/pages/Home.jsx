import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AmbuliImage from '../assets/Ambuli.png'
import EcoQuestImage from '../assets/Eco-Quest.png'
import NeuronXImage from '../assets/NeuronX.png'
import WildfireLogo from '../assets/wildfire_studio_logo.png'

const API_URL = 'https://bug-reporting-protal-for-my-games.onrender.com/api'

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
          <div className="title-section">
            <img src={WildfireLogo} alt="Wildfire Studio" className="studio-logo" />
            <h1>Bug Reporting Portal</h1>
          </div>
          <h3>Choose Your Game that has Bugs</h3>
          <div className="game-cards-container">
            <div className="game-card" onClick={gotoAmbuli}>
              <img src={AmbuliImage} alt="Ambuli" className="game-card-image" />
              <div className="game-card-name">Ambuli</div>
            </div>
            <div className="game-card" onClick={gotoEcoQuest}>
              <img src={EcoQuestImage} alt="Eco-Quest" className="game-card-image" />
              <div className="game-card-name">Eco-Quest</div>
            </div>
            <div className="game-card" onClick={gotoNeuronX}>
              <img src={NeuronXImage} alt="NeuronX" className="game-card-image" />
              <div className="game-card-name">NeuronX</div>
            </div>
          </div>
        </div>
  </div>
  </div>
        
  )
}

export default BugReports
