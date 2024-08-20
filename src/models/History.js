// models/ScanResult.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VulnerabilitySchema = new Schema({
    High: { type: Number, default: 0 },
    Medium: { type: Number, default: 0 },
    Low: { type: Number, default: 0 },
    Informational: { type: Number, default: 0 }
});

const filteredAlertsSchema = new Schema({
    high: { type: [Schema.Types.Mixed], default: [] },
    medium: { type: [Schema.Types.Mixed], default: [] },
    low: { type: [Schema.Types.Mixed], default: [] },
    informational: { type: [Schema.Types.Mixed], default: [] }
});
const ScanResultSchema = new Schema({
    username: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: Date, default: Date.now },
    scan_profile: { type: String, default: 'FullScan' }, // Default value added
    vulnerability: { type: VulnerabilitySchema, required: true }, // Single object
    status: { type: String, default: 'Completed' },
    filteredAlerts:{ type: filteredAlertsSchema, required: true },
    scanid:{type:String, required:true}
}, { collection: 'History' });


module.exports = mongoose.model('History', ScanResultSchema);
