const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Food = require('./Model/Bug_Reports.js');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const VerifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

// Home Route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// ==================== AUTH ROUTES ====================

// Register User
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});
// Create Food
app.post('/api/Bug_Reports', async (req, res) => {
    try {
        const { gameName, description } = req.body;
        
        if (!gameName || description === undefined) {
            return res.status(400).json({ message: 'Missing required fields: gameName and description' });
        }
        
        const newBugReport = new Food({ 
            gameName, 
            description 
        });
        await newBugReport.save();
        res.status(201).json({ message: 'Bug report created successfully', bugReport: newBugReport });
    } catch (error) {
        res.status(500).json({ message: 'Error creating bug report', error: error.message });
    }
});

// Get All Bug Reports
app.get('/api/Bug_Reports', async (req, res) => {
    try {
        const bugReports = await Food.find();
        res.json(bugReports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bug reports', error: error.message });
    }
});

// Update Bug Report
app.put('/api/Bug_Reports/:id', async (req, res) => {
    try {
        const { gameName, description } = req.body;
        const updatedBugReport = await Food.findByIdAndUpdate(
            req.params.id,
            { gameName, description },
            { new: true }
        );
        if (!updatedBugReport) {
            return res.status(404).json({ message: 'Bug report not found' });
        }
        res.json({ message: 'Bug report updated successfully', bugReport: updatedBugReport });
    } catch (error) {
        res.status(500).json({ message: 'Error updating bug report', error: error.message });
    }
});

// Delete Bug Report
app.delete('/api/Bug_Reports/:id', async (req, res) => {
    try {
        const deletedBugReport = await Food.findByIdAndDelete(req.params.id);
        if (!deletedBugReport) {
            return res.status(404).json({ message: 'Bug report not found' });
        }
        res.json({ message: 'Bug report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting bug report', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});