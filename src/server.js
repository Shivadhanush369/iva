const e = require("express");
const fs = require('fs');
require('./scheduler1');
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const verifyToken = require('./authVerify'); // Import the JWT middleware
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./db/db');
const History = require('./models/History');
const Register = require('./models/Register');
const oneweek = require('./models/oneweek');
const onemonth = require('./models/onemonth');
const Report = require('./models/Report');
const oneday = require('./models/oneday');
const subscribe = require('./models/subscribe');
const ReportSchema = require('./models/ReportSchema'); 
const secretKey = "secretKey";
const NodeCache = require('node-cache');
// Middleware to parse JSON bodies

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // Cache for 5 minutes

const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
 

console.log();
app.use(express.json());
connectDB();
app.use(express.static('public'));
app.set("view engine","hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/register",async (req,res)=>{

    const { name , email, password } = req.body;

    try {
      // Check if the email exists in the database
      const existingUser = await Register.findOne({ email });
  
      if (existingUser) {
        // User already exists
        return res.status(400).json({ error: 'User already exists' });
      }
          // Create a new user in the database
    const newUser = new Register({ name, email, password });
    await newUser.save();

    // Respond with a success message or any other data as needed
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    // Handle any errors
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }



})





app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    Register.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Compare plaintext passwords (not recommended in production)
            if (user.password !== password) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            // User is authenticated, generate a JWT token
            jwt.sign({ id: user._id, email: user.email,name:user.name }, secretKey, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    return res.status(500).json({ error: 'Error generating token' });
                }
                res.json({ username: user.name, token });
            });
        })
        .catch(err => {
            console.error('Error finding user by email:', err);
            res.status(500).json({ error: 'Server error' });
        });
});


app.get("/history",verifyToken,async (req,res)=>{
    const { name } = req.authData;  // Assuming `authData` contains user information from JWT payload
     console.log(req.authData);
    try {
        // Fetch history data filtered by username "shiva"
        const histories = await History.find({ username: name });
        res.json(histories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }

});

app.get('/scopes', verifyToken, async (req, res) => {
    const { name } = req.authData;
    try {
        const scopes = await subscribe.find({ username: name });

        // Extract URL and derive the domain name
        const formattedScopes = scopes.map(scope => {
            const url = scope.scope;
            const domainName = new URL(url).hostname;

            return { url, name: domainName };
        });

        res.json(formattedScopes);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



app.post("/settingsb", verifyToken, async (req, res) => {
    console.log("Request Body:", req.body); // Log the request body

    const { username, scope, cvssScore, scheduleTime } = req.body;

    


    if (!username || !scope || !cvssScore || !scheduleTime) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const update = { username, cvssScore, scheduleTime };
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const subs = await subscribe.findOneAndUpdate({ scope }, update, options);
    if (scheduleTime == 7) {
        console.log(scheduleTime+" india");
        try {
            const update = { username, cvssScore, scheduleTime };
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };

            const newUser = await oneweek.findOneAndUpdate({ scope }, update, options);
            res.json({ message: 'Data received and saved successfully', data: newUser });
        } catch (error) {
            console.error('Error saving data:', error); // Log the error for debugging
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    else if(scheduleTime == 1)
    {
        console.log(scheduleTime+" india");
        try {
            const update = { username, cvssScore, scheduleTime };
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };

            const newUser = await oneday.findOneAndUpdate({ scope }, update, options);
            res.json({ message: 'Data received and saved successfully', data: newUser });
        } catch (error) {
            console.error('Error saving data:', error); // Log the error for debugging
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } 
    else if(scheduleTime == 28)
    {
        console.log(scheduleTime+" india");
        try {
            const update = { username, cvssScore, scheduleTime };
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };

            const newUser = await onemonth.findOneAndUpdate({ scope }, update, options);
            res.json({ message: 'Data received and saved successfully', data: newUser });
        } catch (error) {
            console.error('Error saving data:', error); // Log the error for debugging
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } 
});



app.get("/dashboard.html",(req, res) => {
    res.render("dashboard");
});
app.get("/history.html",(req, res) => {
    res.render("history");
});

app.get("/settings",(req, res) => {
    res.render("settings");
});

app.post('/profile', verifyToken, (req, res) => {
    res.json({
        message: 'Profile accessed',
        authData: req.authData
    });
});


app.post('/getIssues', verifyToken, async (req, res) => {
    const { name } = req.authData; // not used in this function

    let url = req.body.url;

    const cachedAlerts = cache.get(url);
    if (cachedAlerts) {
        return res.json(cachedAlerts);
    }

    try {
        const reportData = await Report.find({ 'report.url.url': url });

        if (!reportData || reportData.length === 0) {
            return res.status(404).json({ error: 'No reports found for this URL' });
        }

        const alertsArray = [];

        reportData.forEach(report => {
            if (report.report && Array.isArray(report.report.site)) {
                report.report.site.forEach(site => {
                    if (Array.isArray(site.alerts)) {
                        site.alerts.forEach(alert => {
                            alertsArray.push({
                                alertName: alert.alert || 'N/A',
                                description: alert.desc || 'N/A',
                                riskdesc: alert.riskdesc || 'N/A',
                                solution: alert.solution || 'N/A',
                                cweid: alert.cweid || 'N/A',
                                wascid: alert.wascid || 'N/A',
                            });
                        });
                    } else {
                        console.warn('No alerts found for site:', site);
                    }
                });
            } else {
                console.warn('No sites found in report:', report);
            }
        });

        cache.set(url, alertsArray);
        res.json(alertsArray);
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/report',  verifyToken,async (req, res) => {
    let url =req.body.url;
    try {
        const reports = await Report.find({ 'report.url.url': url });
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});


app.post('/scanned', verifyToken, async (req, res) => {
    const { name } = req.authData; // not used in this function
    
    let url = req.body.url;

    try {
        const reportData = await Report.find({ 'report.url.url': url });
        if (!reportData || reportData.length === 0) {
            return res.status(404).json({ error: 'No reports found for this URL' });
        }

        // Counting the number of URLs scanned
        const urlCount = reportData.length;

        return res.json({ urlCount, reportData });
    } catch (error) {
        console.error('Error fetching report data:', error);
        return res.status(500).json({ error: 'An error occurred while fetching report data' });
    }
});


app.post('/alertCount', async (req, res) => {
    const { url } = req.body;
    try {
        const reportData = await Report.find({ 'report.url.url': url });
        if (!reportData || reportData.length === 0) {
            return res.status(404).json({ error: 'No reports found for this URL' });
        }
        let alertCount = 0;
        reportData.forEach(report => {
            if (report.report && Array.isArray(report.report.site)) {
                report.report.site.forEach(site => {
                    if (Array.isArray(site.alerts)) {
                        alertCount += site.alerts.length;
                    }
                });
            }
        });
        res.json({ alertCount });
    } catch (error) {
        console.error('Error counting alerts:', error);
        res.status(500).json({ error: 'Failed to count alerts' });
    }
});


setInterval(() => {
    console.log('Clearing cache');
    cache.flushAll();
}, 300000);

app.listen(5001, () => {
    console.log("App is running on port 5000");
});
