// 引入 express
const express = require('express');
// 引入 bcrypt 进行密码加密
const bcrypt = require('bcrypt');
const router = express.Router();
const countries = require('countries-list').countries;
const { promisify } = require('util');

// 直接使用 `global.db`，因为 `index.js` 里已经定义了 `db`
const query = promisify(global.db.query).bind(global.db);

// Registration page
router.get("/register", function (req, res) {
    const countryList = Object.values(countries).map(country => country.name);
    // console.log("Loaded Countries:", countryList);
    res.render("register.ejs", { errors: [], formData: {}, countryList });
});

// Register for feedback processing
router.post('/registered', async function (req, res) {
    console.log("Received Country:", req.body.country);
    const { first, last, email, password, confirmPassword, phone, Occupation, country, organization } = req.body;
    let errors = [];

    // 1️⃣  **数据校验**
    if (!first || first.trim() === '') errors.push({ field: 'first', message: 'First name is required.' });
    if (!last || last.trim() === '') errors.push({ field: 'last', message: 'Last name is required.' });
    if (!email || email.trim() === '') errors.push({ field: 'email', message: 'Email is required.' });
    if (!password || password.trim() === '') errors.push({ field: 'password', message: 'Password is required.' });
    if (!confirmPassword || confirmPassword.trim() === '') errors.push({ field: 'confirmPassword', message: 'Confirm password is required.' });
    if (!Occupation || Occupation.trim() === '') errors.push({ field: 'Occupation', message: 'Occupation is required.' });
    if (!country || country.trim() === '') errors.push({ field: 'country', message: 'Country is required.' });
    if (!organization || organization.trim() === '') errors.push({ field: 'organization', message: 'Organization name is required.' });
    // console.log("Loaded Countries:", Object.values(countries).map(country => country.name));


    // 2️⃣ **密码校验**
    if (password !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Passwords do not match.' });
    }
    if (password.length < 6) {
        errors.push({ field: 'password', message: 'Password must be at least 6 characters long.' });
    }

    // 3️⃣ **如果有错误，重新渲染页面**
    const countryList = Object.values(countries).map(country => country.name);
    if (errors.length > 0) {
        return res.render('register.ejs', { errors, formData: req.body, countryList });
    }

    try {
        // 4️⃣ **查询邮箱是否已注册**
        const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
        const results = await query(checkEmailQuery, [email]); // ✅ `await` 查询

        if (results.length > 0) {
            errors.push({ field: 'email', message: 'Email is already registered.' });
            return res.render('register.ejs', { errors, formData: req.body, countryList });
        }

        // 5️⃣ **加密密码**
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6️⃣ **插入数据库**
        let username = `${first} ${last}`;
        let sqlquery = `
            INSERT INTO users (username, email, password_hash, occupation, organization_country, organization_name, phone, votes_remaining, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 3, NOW(), NOW())`;

        let newrecord = [username, email, hashedPassword, Occupation, country, organization, phone];
        await query(sqlquery, newrecord); // ✅ `await` 插入数据库

        console.log("User Registered Successfully:", email);
        res.redirect('/login'); // ✅ **注册成功后跳转**

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).send("Internal server error");
    }
});

module.exports = router;
