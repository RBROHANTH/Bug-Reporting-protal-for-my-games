import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NeuronXImage from '../../assets/NeuronX.png';

const API_URL = 'https://bug-reporting-protal-for-my-games.onrender.com/api'

function NeuronX() {
    const [bugReports, setBugReports] = useState([])
    const [description, setDescription] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editDescription, setEditDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const gameName = "NeuronX"

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
        } else {
            fetchBugReports()
        }
    }, [navigate])

    const fetchBugReports = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/Bug_Reports`)
            const data = await response.json()
            // Filter only NeuronX bug reports
            setBugReports(data.filter(report => report.gameName === "NeuronX"))
            setError('')
        } catch (err) {
            setError('Failed to fetch bug reports')
        } finally {
            setLoading(false)
        }
    }

    const handleAddBugReport = async (e) => {
        e.preventDefault()
        if (!description.trim()) return

        try {
            const response = await fetch(`${API_URL}/Bug_Reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameName, description })
            })
            if (response.ok) {
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
        setEditDescription(bugReport.description || '')
    }

    const handleSaveEdit = async (bugReport) => {
        if (!editDescription?.trim()) return

        try {
            const response = await fetch(`${API_URL}/Bug_Reports/${bugReport._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameName, description: editDescription })
            })
            if (response.ok) {
                setEditingId(null)
                setEditDescription('')
                fetchBugReports()
            }
        } catch (err) {
            setError('Failed to update bug report')
        }
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditDescription('')
    }

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

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }
        const gotoHome = () => {
        navigate('/home')
    }
    return (<>
    <div className="game-page-header">
      <img src={NeuronXImage} alt='NeuronX' className="game-page-image" />
      <h1>NeuronX</h1>
      <div className="game-summary">
        <p>NeuronX is an interactive gamified learning platform prototype designed to make quizzes more engaging and rewarding. Built entirely in Unity with C# and graphics support from Blender, it transforms traditional learning into a fun gaming experience.</p>
        <p>Instead of standard question-and-answer formats, NeuronX adds game elements like points for correct answers, levels to show progress, and rewards for achievements. At the end of each quiz, players can review their performance dashboard to track total points, levels earned, and areas of strength or weakness.</p>
        <p>The goal of NeuronX is to explore how game design principles can transform passive learning into a more interactive and motivating experience. This is an early prototype, and feedback is highly encouraged to improve future versions!</p>
      </div>
    </div>
    <div className="app">
      <div className="bug-report-container">
        <form onSubmit={handleAddBugReport} className="add-form">
          <div className="game-select">
            <p>Select Game:</p>
            <label>
              <input
                type="radio"
                name="game"
                value="NeuronX"
                checked={gameName === "NeuronX"}
                onChange={(e) => setGameName(e.target.value)}
              />
              NeuronX
            </label>
          </div>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Add Bug Report</button>
        </form>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading...</p>}

        <ul className="Game-list">
          {bugReports.map((bugReport) => (
            <li key={bugReport._id} className="Game-item">
              {editingId === bugReport._id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editGameName}
                    onChange={(e) => setEditGameName(e.target.value)}
                    placeholder="Game name"
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <button onClick={() => handleSaveEdit(bugReport)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="Game-content">
                    <span className="Game-name">{bugReport.gameName}</span>
                    <span className="Game-description">{bugReport.description}</span>
                  </div>
                  <div className="Game-actions">
                    <button onClick={() => handleStartEdit(bugReport)}>Edit</button>
                    <button onClick={() => handleDeleteBugReport(bugReport._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {bugReports.length === 0 && !loading && (
          <p className="empty-message">No bug reports yet. Add one above!</p>
        )}
        <div className="page-actions">
          <button onClick={gotoHome} className="logout-btn">Back to Home</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </div>
    </>);   
}

export default NeuronX;