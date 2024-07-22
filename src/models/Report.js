const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    report: { type: Schema.Types.Mixed, required: true } // Store JSON report
}, { collection: 'Reports' });

module.exports = mongoose.model('Reports', ReportSchema);
