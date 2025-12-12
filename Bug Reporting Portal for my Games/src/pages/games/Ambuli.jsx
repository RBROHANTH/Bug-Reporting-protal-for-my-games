import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AmbuliImage from '../../assets/Ambuli.png';

const API_URL = 'http://localhost:3000/api'

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
    <img src={AmbuliImage} alt='Ambuli' />
    <h1>Ambuli - page </h1>
    <div className="app">
      <div className="bug-report-container">
        <div className="header">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

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
        <button onClick={gotoHome} className="logout-btn">Back to Home</button>
      </div>
    </div>
</>);   
}

export default Ambuli;   