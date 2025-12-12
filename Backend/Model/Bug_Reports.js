const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  gameName: {
    type: String,
    enum: ['Ambuli', 'Eco-Quest', 'NeuronX'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['open','in-review','fixed'],
    default: 'open'
  }
});

const BugReport = mongoose.model('BugReport', bugSchema);
module.exports = BugReport;
