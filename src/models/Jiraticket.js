const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketConfigSchema = new Schema({
    jirausername: { type: String, required: true }, // Jira username for authentication
    jiratoken: { type: String, required: true }, // Jira API token for authentication
    jiraurl: { type: String, required: true }, // Base URL for Jira (e.g., https://your-domain.atlassian.net)
    orgname: { type: String, required: true }, // Organization name associated with the Jira account
    projectKey:{type:String, required:true}
}, { collection: 'Jiraticket' });

module.exports = mongoose.model('Jiraticket', TicketConfigSchema); // Use a capitalized model name
