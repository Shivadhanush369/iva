const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScanResultSchema = new Schema({
    username: { type: String, required: true },
    scope: { type: String, required: true },
    cvssScore: { type: String, required: true },
  
    scheduleTime: { type: String, required: true }
}, { collection: 'oneday' });

module.exports = mongoose.model('oneday', ScanResultSchema); // Use a capitalized model name
