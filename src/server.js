const e = require("express");
const fs = require('fs');
require('./scheduler1');
const express = require("express");
const socketIo = require('socket.io');
const http = require('http');
const scan = require("./commons/scan");
const path = require("path");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const verifyToken = require('./authVerify'); // Import the JWT middleware
const returnUsername = require('./jwtextract'); 
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
const secretKey = "secretKey";
const NodeCache = require('node-cache');
const { URLSearchParams } = require("url");
const asidealert =  require('./models/asidealert');
const { decode } = require("punycode");
// Middleware to parse JSON bodies
const server = http.createServer(app);
const io = socketIo(server);
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // Cache for 5 minutes


const partials_path = path.join(__dirname, "../templates/partials");
 
let sockets = [];
console.log();
app.use(express.json());
connectDB();
app.use(express.static('public'));
app.set("view engine","hbs");
app.set("views", [path.join(__dirname, "../templates/views"),path.join(__dirname, "../templates/partials")]);
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


app.post("/history",verifyToken,async (req,res)=>{
    const { name } = req.authData;  // Assuming `authData` contains user information from JWT payload
    const { url } = req.body;
    console.log(url);
    try {
        // Fetch history data filtered by username "shiva"
        const histories = await History.find({ username: name, url: url }).select('-_id');

        res.json(histories);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }

});
app.post("/analytics", verifyToken,async (req,res)=>{
    const { name } = req.authData;  // Assuming `authData` contains user information from JWT payload
    const { url } = req.body;
    const date =[];
    const medium = [];
    const high =[];
    const low =[];
    console.log(url);
    try {
        // Fetch history data filtered by username "shiva"
        const histories = await History.find({ username: name, url: url }).select('-_id');
        
        histories.forEach(history => {
            date.push(history.date);
            medium.push(history.vulnerability.Medium);
            high.push(history.vulnerability.High);
            low.push(history.vulnerability.Low);
        });
        const response = {
            dates: date,
            mediumVulnerabilities: medium,
            highVulnerabilities: high,
            lowVulnerabilities: low
          };
          res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})






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

app.get("/newdashboard.html",(req, res) => {
    res.render("newdashboard");
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


app.post('/alertCount', verifyToken,async (req, res) => {

    const { name } = req.authData;  // Assuming `authData` contains user information from JWT payload
    const { url } = req.body;
    const date =[];
    const medium = [];
    const high =[];
    const low =[];
    let alertCount=0;
    console.log(url);
    try {
        // Fetch history data filtered by username "shiva"
        const histories = await History.find({ username: name, url: url }).select('-_id');
        
        histories.forEach(history => {
           
            alertCount = alertCount +history.vulnerability.Medium + history.vulnerability.High + history.vulnerability.Low;
            
            
        });
       
          res.json({alertCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }







    // const { url } = req.body;
    // try {
    //     const reportData = await Report.find({ 'report.url.url': url });
    //     if (!reportData || reportData.length === 0) {
    //         return res.status(404).json({ error: 'No reports found for this URL' });
    //     }
    //     let alertCount = 0;
    //     reportData.forEach(report => {
    //         if (report.report && Array.isArray(report.report.site)) {
    //             report.report.site.forEach(site => {
    //                 if (Array.isArray(site.alerts)) {
    //                    site.alerts.forEach(instance =>{
    //                      let riskdesc =instance.riskdesc;
                         
    //                      if(riskdesc.includes("Informational"))
    //                      {

    //                      }
    //                  else
    //                     {
                            
    //                         alertCount += instance.instances.length;
    //                     }
    //                    });
                        
    //                 }
    //             });
    //         }
    //     });
    //     res.json({ alertCount });
    // } catch (error) {
    //     console.error('Error counting alerts:', error);
    //     res.status(500).json({ error: 'Failed to count alerts' });
    // }
});


setInterval(() => {
    console.log('Clearing cache');
    cache.flushAll();
}, 300000);
server.listen(5002, () => {
    console.log(`Server is running on port `);
});

// app.listen(5002, () => {
//     console.log("App is running on port 5000");
// });

app.get("/manual", (req, res) => {
    res.render("manual");
});
app.get("/manualscan", (req, res) => {
    res.render("manualscan");
});
app.get("/setting", (req, res) => {
    res.render("setting");
});

app.get("/analytic", (req, res) => {
    res.render("analytics");
});

app.get('/partials/:name', (req, res) => {
    const name = req.params.name;
    console.log(name);
    res.render(name); // Render the requested partial
  });
  
//new code

app.post('/alerts',  verifyToken,async (req, res) => {
    const { name } = req.authData;  
   
    let url =req.body.url;
    try {
        const alerts = await asidealert.find({ 'username': name })
    .sort({ _id: -1 }) // Sort by _id in descending order (latest first)
    .limit(3); // Limit the result to the latest three entries
console.log(JSON.stringify(alerts));
        res.json(alerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

  // for manual scan 

  io.on('connection', (socket) => {
    console.log('New client connected');
    sockets.push(socket);

    socket.on('startScan', (targetUrl,token) => {
        main(targetUrl,token);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        sockets = sockets.filter(s => s !== socket);
    });
});

  async function main(targetUrl,token) {

    console.log("token "+token);
let username;
  returnUsername(token)
    .then(decoded => {
        // Store the decoded result in a variable
        username = decoded.name; // Adjust based on your token payload
      
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
    // Extract username from the decoded token
   // Adjust this according to the structure of your token

    try {
        console.log("main");
        const log = (message) => {
            sockets.forEach(socket => socket.emit('log', message));
        };
console.log(targetUrl);
        log(`Starting spider for URL: ${targetUrl}`);
       
        const spiderScanId = await scan.spiderUrl(targetUrl);
        log(`Spider started with ID: ${spiderScanId}`);

        let spiderStatus = '0';
        while (spiderStatus !== '100') {
            console.log("s");
            spiderStatus = await scan.checkSpiderStatus(spiderScanId);
            
            sockets.forEach(socket => socket.emit('spiderStatus', { url: targetUrl, status: spiderStatus }));
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
        }

        log('Spider completed. Starting active scan...');
        const scanId = await scan.startScan(targetUrl);
        log(`Scan started with ID: ${scanId}`);

        let scanStatus = '0';
        while (scanStatus !== '100') {
            scanStatus = await scan.checkScanStatus(scanId);
            console.log("ss")
            sockets.forEach(socket => socket.emit('scanStatus', { url: targetUrl, status: scanStatus }));
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
        }
        sockets.forEach(socket => socket.emit('scanComplete', { url: targetUrl }));

        // Emit scanComplete event after all steps are completed
        console.log('Scan completed. Generating report...');
        console.log("username "+username);
        await scan.generateReportforManualScan(targetUrl, sockets,scanId,username);

    } catch (error) {
        sockets.forEach(socket => socket.emit('error', { url: targetUrl, message: error.message }));
    }
}