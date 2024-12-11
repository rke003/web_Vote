// routes/login.js
const express = require("express");
const router = express.Router();

// Login page
router.get("/login", function (req, res) {
    res.render("login.ejs", { errors: [], formData: {} });
});

// Login processing logic
router.post('/logined', function (req, res) {
    const { email, password } = req.body;
    let errors = [];

    // Verify that the mailbox and password are empty
    if (!email || email.trim() === '') {
        errors.push({ field: 'email', message: 'Email is required.' });
    }
    if (!password || password.trim() === '') {
        errors.push({ field: 'password', message: 'Password is required.' });
    }

    // If there is an error, re-render the login page with the error message
    if (errors.length > 0) {
        res.render('login.ejs', { errors, formData: req.body });
        return;
    }


    // Database
    const sqlquery = "SELECT * FROM users Where email = ? AND password_hash = ?";
    db.query(sqlquery, [email, password], (err, results) => {
        if (err) {
            console.error("Database error: ", err.message);
            return res.status(500).send("Internal server error");
        }

        //If no matching user can be found
        if (results.length === 0) {
            errors.push({ field: 'email', message: 'Incorrect wmail or password.' });
            return res.render('login.ejs', { errors, formData: req.body });
        }

        // Find the user and create a session
        const user = results[0]; 
        req.session.user = {
            id: user.user_id,
            email: user.email,
            username: user.username
        };

        // Redirect to homepage
        res.redirect('/');
    });
});

// Export Routing Module
module.exports = router;
