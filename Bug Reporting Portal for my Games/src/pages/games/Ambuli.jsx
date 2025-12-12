import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AmbuliImage from '../../assets/Ambuli.png';

const API_URL = 'https://bug-reporting-protal-for-my-games.onrender.com/api'

function Ambuli() {
    const [bugReports, setBugReports] = useState([])
    const [description, setDescription] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editDescription, setEditDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const gameName = "Ambuli"

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
            // Filter only Ambuli bug reports
            setBugReports(data.filter(report => report.gameName === "Ambuli"))
            setError('')
        } catch (err) {
            setError('Failed to fetch bug reports')
        } finally {
            setLoading(false)
        }
    }
    const gotoHome = () => {
        navigate('/home')
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

    return (<>
    <div className="game-page-header">
      <img src={AmbuliImage} alt='Ambuli' className="game-page-image" />
      <h1>Ambuli</h1>
      <div className="game-summary">
        <p>Ambuli is a first-person survival horror game set in a cursed forest inspired by South Indian folklore. You play as a 17-year-old boy who ignored his grandmother's warnings and entered a village haunted by Ambuli — a mutated predator that hunts silently through the night.</p>
        <p>With no weapons, survival relies entirely on stealth, timing, and environmental awareness. Hide under corpse piles, cut dead trees to collect logs, and light torches or campfires to create temporary safety zones. The AI-driven Ambuli moves through the forest using node-based pathing, detects sound, and chases using raycast vision.</p>
        <p>A custom day–night cycle runs where 1 real minute equals 20 game minutes. Survive enough cycles to reach sunrise and escape. Explore ruined temples, tunnels, mountains, and forest trails — all designed for chase, evasion, and atmospheric tension. Built in Unity with procedural clock mechanics, dynamic AI, and realistic fog and lighting.</p>
      </div>
    </div>
    <div className="app">
      <div className="bug-report-container">
        <form onSubmit={handleAddBugReport} className="add-form">
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

export default Ambuli;   