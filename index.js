const express = require('express');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Use session middleware to store the session data
app.use("/customer", session({
    secret: "fingerprint_customer", 
    resave: true, 
    saveUninitialized: true
}));

// Authentication middleware based on session
app.use("/customer/auth/*", (req, res, next) => {
    if (req.session.username) {
        // If username exists in session, proceed to the next middleware
        next();
    } else {
        return res.status(403).json({ message: "User not authenticated. Please log in." });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
