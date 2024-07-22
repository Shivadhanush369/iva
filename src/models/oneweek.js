const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScanResultSchema = new Schema({
    username: { type: String, required: true },
    scope: { type: String, required: true },
    cvssScore: { type: String, required: true },
  
    scheduleTime: { type: String, required: true }
}, { collection: 'oneweek' });

module.exports = mongoose.model('oneweek', ScanResultSchema); // Use a capitalized model name
