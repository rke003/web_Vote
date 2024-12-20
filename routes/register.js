// 引入 express
const express = require('express');
const router = express.Router();
const countries = require('countries-list').countries;

// Registration page
router.get("/register", function (req, res) {
    const countryList = Object.values(countries).map(country => country.name);
    res.render("register.ejs", { errors: [], formData: {}, countryList });
});

// Register for feedback processing
router.post('/registered', function (req, res) {
    const { first, last, email, password, confirmPassword, phone, Occupation, country, organization } = req.body;
    let errors = [];

    // Validate individual fields
    if (!first || first.trim() === '') {
        errors.push({ field: 'first', message: 'First name is required.' });
    }
    if (!last || last.trim() === '') {
        errors.push({ field: 'last', message: 'Last name is required.' });
    }
    if (!email || email.trim() === '') {
        errors.push({ field: 'email', message: 'Email is required.' });
    }
    if (!password || password.trim() === '') {
        errors.push({ field: 'password', message: 'Password is required.' });
    }
    if (!confirmPassword || confirmPassword.trim() === '') {
        errors.push({ field: 'confirmPassword', message: 'Confirm password is required.' });
    }
    if (!Occupation || Occupation.trim() === '') {
        errors.push({ field: 'Occupation', message: 'Occupation is required.' });
    }
    if (!country || country.trim() === '') {
        errors.push({ field: 'country', message: 'Country is required.' });
    }
    if (!organization || organization.trim() === '') {
        errors.push({ field: 'organization', message: 'Organization name is required.' });
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Passwords do not match.' });
    }

    // If there is an error, re-render the registration page with the error message and list of countries
    const countryList = Object.values(countries).map(country => country.name);
    if (errors.length > 0) {
        res.render('register.ejs', { errors, formData: req.body, countryList });
        return;
    }

    // Query the database for the same mailbox
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).send("Internal server error");
        }

        // If the mailbox already exists
        if (results.length > 0) {
            errors.push({ field: 'email', message: 'Email is already registered.' });
            res.render('register.ejs', { errors, formData: req.body, countryList });
            return;
        }

        // Successful registration
        res.send(`Hello ${first} ${last}, you are now registered! We will send an email to you at ${email}.`);
        // Merge first and last names into username
        let username = first + ' ' + last;
        // Saving data in database
        let sqlquery = "INSERT INTO users (username, email, password_hash, occupation, organization_country, organization_name, phone, votes_remaining) VALUES (?, ?, ?, ?, ?, ?, ?, 3)";
        // execute sql query
        let newrecord = [username, email, password, Occupation, country, organization, phone];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.error(err.message);
            } else {
                res.render('register.ejs', { errors: [{ message: 'Database error. Please try again.' }], formData: req.body, countryList });
            }

        });
    });
});


module.exports = router;
