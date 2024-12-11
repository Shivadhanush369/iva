// models/Counter.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 } // Store the sequence number
});

module.exports = mongoose.model('Counter', CounterSchema);
