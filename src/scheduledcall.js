const oneweek = require('./models/oneweek');
const mongoose = require('mongoose');
const connectDB = require('./db/db');
const scan = require('./commons/scan');
const { start } = require('agenda/dist/agenda/start');

async function weekOne(scopeArray) {
    console.log("dard");
    const scanPromises = [];

    for (let i = 0; i < scopeArray.length; i++) {
        // Start each scan and store the promise in the array
        scanPromises.push(scan.start(scopeArray[i]));
    }

    try {
        // Wait for all scan promises to resolve
        await Promise.all(scanPromises);
        console.log('All scans completed.');
    } catch (error) {
        console.error('Error during scanning:', error);
    }
  
}

async function monthOne(scopeArray) {
    console.log("dard");
    const scanPromises = [];

    for (let i = 0; i < scopeArray.length; i++) {
        // Start each scan and store the promise in the array
        scanPromises.push(scan.start(scopeArray[i]));
    }

    try {
        // Wait for all scan promises to resolve
        await Promise.all(scanPromises);
        console.log('All scans completed.');
    } catch (error) {
        console.error('Error during scanning:', error);
    }
  
}

async function dayOne(scopeArray) {
    console.log("dard");
    const scanPromises = [];

    for (let i = 0; i < scopeArray.length; i++) {
        // Start each scan and store the promise in the array
        scanPromises.push(scan.start(scopeArray[i]));
    }

    try {
        // Wait for all scan promises to resolve
        await Promise.all(scanPromises);
        console.log('All scans completed.');
    } catch (error) {
        console.error('Error during scanning:', error);
    }
  
}


module.exports = { weekOne, monthOne, dayOne };

