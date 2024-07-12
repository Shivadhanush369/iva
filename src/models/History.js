// models/ScanResult.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScanResultSchema = new Schema({
    url: { type: String, required: true },
    date: { type: Date, default: Date.now },
},{ collection: 'History' });

module.exports = mongoose.model('History', ScanResultSchema);
