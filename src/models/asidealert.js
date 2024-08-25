const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScanReportSchema = new Schema({
    username: { type: String, required: true }, // USERNAME
    url: { type: String, required: true }, // URL
    scanid: { type: String, required: true }, // SCANID
    medium: { type: Number, required: true }, // MEDIUM
    high: { type: Number, required: true }, // HIGH
    low: { type: Number, required: true } // LOW
}, { collection: 'asidealerts' }); // Specify the collection name
const asidealert = mongoose.model('asidealerts', ScanReportSchema);
module.exports = mongoose.model('asidealerts', ScanReportSchema); // Use a capitalized model name


// const insertData = async () => {
//     const newReport = new asidealert({
//         username: 'avekshaa', // Replace with actual data
//         url: 'https://example.com', // Replace with actual data
//         scanid: '123456', // Replace with actual data
//         medium: 5, // Replace with actual data
//         high: 2, // Replace with actual data
//         low: 1 // Replace with actual data
//     });

//     try {
//         const result = await newReport.save();
//         console.log('Data inserted successfully:', result);
//     } catch (error) {
//         console.error('Error inserting data:', error);
//     } finally {
//         mongoose.connection.close(); // Close the connection after insertion
//     }
// };

// // Call the function to insert data
// insertData();