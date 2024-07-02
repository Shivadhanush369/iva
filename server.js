const axios = require('axios');
const fs = require('fs');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const connectDB = require('./db');
const History = require('./models/History');
const Scan = require('./models/History');
const ZAP_HOST = 'http://127.0.0.1:8080';  // Include protocol
const API_KEY = 'sf1l9d7pvavoh4qfbkkvrh14h3';  // Replace with your actual API key

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.static('public'));

let sockets = [];
console.log('started');
// Connect to MongoDB
connectDB();

async function spiderUrl(url) {
    try {
        const response = await axios.get(`${ZAP_HOST}/JSON/spider/action/scan/`, {
            params: {
                url: url,
                apikey: API_KEY
            }
        });
        return response.data.scan;
    } catch (error) {
        throw new Error(`Failed to start spider: ${error.message}`);
    }
}

async function checkSpiderStatus(scanId) {
    try {
        const response = await axios.get(`${ZAP_HOST}/JSON/spider/view/status/`, {
            params: {
                scanId: scanId,
                apikey: API_KEY
            }
        });
        return response.data.status;
    } catch (error) {
        throw new Error(`Failed to check spider status: ${error.message}`);
    }
}

async function startScan(url) {
    try {
        const response = await axios.get(`${ZAP_HOST}/JSON/ascan/action/scan/`, {
            params: {
                url: url,
                apikey: API_KEY
            }
        });
        return response.data.scan;
    } catch (error) {
        throw new Error(`Failed to start scan: ${error.message}`);
    }
}

async function checkScanStatus(scanId) {
    try {
        const response = await axios.get(`${ZAP_HOST}/JSON/ascan/view/status/`, {
            params: {
                scanId: scanId,
                apikey: API_KEY
            }
        });
        return response.data.status;
    } catch (error) {
        throw new Error(`Failed to check scan status: ${error.message}`);
    }
}

async function generateReport(url, sockets) {
    try {
        const parsedUrl = new URL(url);
    // Extract the hostname
    const domain = parsedUrl.hostname;
    
        const response = await axios.get(`${ZAP_HOST}/OTHER/core/other/jsonreport/`, {
            params: {
                apikey: API_KEY
            }
            
        });
        const report1 = JSON.stringify(response.data, null, 2);

        // Write the report to a file
        fs.writeFileSync(domain+'.json', report1);

        const report = response.data;
        console.log("Report generated");

        // Emit the generated JSON event to clients
        sockets.forEach(socket => socket.emit('generatedjson', { url: url }));

        // Save report to MongoDB
        const history = new History({ url,date: new Date() });
        await history.save();

        console.log('JSON Report generated and saved to MongoDB');
    } catch (error) {
        throw new Error(`Failed to generate JSON report: ${error.message}`);
    }
}

async function main(targetUrl) {
    try {
        console.log("main");
        const log = (message) => {
            sockets.forEach(socket => socket.emit('log', message));
        };

        log(`Starting spider for URL: ${targetUrl}`);
        const spiderScanId = await spiderUrl(targetUrl);
        log(`Spider started with ID: ${spiderScanId}`);

        let spiderStatus = '0';
        while (spiderStatus !== '100') {
            console.log("s");
            spiderStatus = await checkSpiderStatus(spiderScanId);
            
            sockets.forEach(socket => socket.emit('spiderStatus', { url: targetUrl, status: spiderStatus }));
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
        }

        log('Spider completed. Starting active scan...');
        const scanId = await startScan(targetUrl);
        log(`Scan started with ID: ${scanId}`);

        let scanStatus = '0';
        while (scanStatus !== '100') {
            scanStatus = await checkScanStatus(scanId);
            console.log("ss")
            sockets.forEach(socket => socket.emit('scanStatus', { url: targetUrl, status: scanStatus }));
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
        }
        sockets.forEach(socket => socket.emit('scanComplete', { url: targetUrl }));

        // Emit scanComplete event after all steps are completed
        console.log('Scan completed. Generating report...');
        await generateReport(targetUrl, sockets);

    } catch (error) {
        sockets.forEach(socket => socket.emit('error', { url: targetUrl, message: error.message }));
    }
}

io.on('connection', (socket) => {
    console.log('New client connected');
    sockets.push(socket);

    socket.on('startScan', (targetUrl) => {
        main(targetUrl);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        sockets = sockets.filter(s => s !== socket);
    });
});

// Endpoint to fetch data from MongoDB
app.get('/data', async (req, res) => {
    try {
        const histories = await History.find();
        res.json(histories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/data/:url(*)', async (req, res) => {
    const targetUrl = req.params.url;
    console.log(targetUrl);
    console.log("name");
  
    try {
      // Find the latest scan record for the target URL
      const lastScan = await Scan.findOne({ url: targetUrl }).sort({ date: -1 });
      console.log(lastScan);
      if (!lastScan) {
        return res.status(200).json({ error: 'db is empty' });
      }
  
      const lastScanDate = lastScan.date;
      const currentDate = new Date();
      const diffInMonths = currentDate.getMonth() - lastScanDate.getMonth();
  
      console.log(diffInMonths);
  
      if (diffInMonths < 3) {
        console.log("Last scan within three months");
        // If last scan is within three months, inform the client
        return res.status(400).json({ message: 'Website has been scanned recently. Cannot start a new scan.' });
      }
  
      console.log("kak");
      // If it has been more than three months, return historical data
      const histories = await History.find({ url: targetUrl });
      res.json(histories);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  app.get('/startscan/:url(*)', (req, res) => {
    const targetUrl = req.params.url;
    main(targetUrl);
    res.send(`Scan started for ${targetUrl}. Check server logs and UI for progress.`);
     // Emit the event to all connected clients
});
app.get('/proceed', (req, res) => {
    const targetUrl = req.params.url;
    main(targetUrl);
    res.send(`Scan started for ${targetUrl}. Check server logs and UI for progress.`);
    // io.emit('checkTime', targetUrl);
});
app.get('/:url(*)', (req, res) => {
    console.log("start-in");
    const targetUrl = req.params.url;
    //  main(targetUrl);
    res.send(`Scan started for ${targetUrl}. Check server logs and UI for progress.`);
    io.emit('hideTypewriter');
     io.emit('checkTime', targetUrl);
});


const PORT = 3003;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
