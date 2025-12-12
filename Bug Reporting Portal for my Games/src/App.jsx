import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Ambuli from './pages/games/Ambuli'
import EcoQuest from './pages/games/Eco-Quest'
import NeuronX from './pages/games/NeuronX'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/games/ambuli" element={<Ambuli />} />
        <Route path="/games/eco-quest" element={<EcoQuest />} />
        <Route path="/games/neuronx" element={<NeuronX />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
