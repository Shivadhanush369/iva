const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    scan_profile: { type: String, default: 'FullScan' },
    vulnerability: { type: VulnerabilitySchema, required: true },
    status: { type: String, default: 'Completed' },
    filteredAlerts: { type: filteredAlertsSchema, required: true },
    scanid: { type: String, unique: true },
    ticket: { type: Number, default: 0 }
}, { collection: 'History' });

// Middleware to handle scanid increment
ScanResultSchema.pre('save', async function (next) {
    if (!this.scanid) {
        try {
            const lastEntry = await mongoose.model('History').findOne().sort({ scanid: -1 }).exec();
            const lastScanId = lastEntry ? parseInt(lastEntry.scanid, 10) : 0;
            this.scanid = (lastScanId + 1).toString();
        } catch (err) {
            return next(err);
        }
    }
    next();
});

const History = mongoose.model('History', ScanResultSchema);

module.exports = History;
