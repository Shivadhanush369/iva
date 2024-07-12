const e = require("express");
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
const secretKey = "secretKey";
// Middleware to parse JSON bodies


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
            jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' }, (err, token) => {
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
    const { username } = req.authData.user; // Assuming `authData` contains user information from JWT payload
    try {
        // Fetch history data filtered by username "shiva"
        const histories = await History.find({ username: username });
        res.json(histories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }

});

app.get("/dashboard.html",(req, res) => {
    res.render("dashboard");
});
app.get("/navbar.html",(req, res) => {
    res.render("../partials/navbar");
});

app.post('/profile', verifyToken, (req, res) => {
    res.json({
        message: 'Profile accessed',
        authData: req.authData
    });
});




app.listen(5001, () => {
    console.log("App is running on port 5000");
});
