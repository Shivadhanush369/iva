// models/ScanResult.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScanResultSchema = new Schema({
    username:{ type: String, required: true },
    url: { type: String, required: true },
    date: { type: Date, default: Date.now },
},{ collection: 'History' });

module.exports = mongoose.model('History', ScanResultSchema);
