// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('inside');
    try {
        await mongoose.connect('mongodb://localhost:27017/zap_dashboard', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
