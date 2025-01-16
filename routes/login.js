// routes/login.js
const express = require("express");
const bcrypt = require("bcrypt");  // 引入 bcrypt 进行密码比对
const { use } = require("./main");
const router = express.Router();

// Login page
router.get("/login", function (req, res) {
    res.render("login.ejs", { errors: [], formData: {} });
});

// Login processing logic
router.post('/logined', function (req, res) {
    const { email, password } = req.body;
    let errors = [];

    // 1. 验证邮箱和密码是否为空
    if (!email || email.trim() === '') {
        errors.push({ field: 'email', message: 'Email is required.' });
    }
    if (!password || password.trim() === '') {
        errors.push({ field: 'password', message: 'Password is required.' });
    }

    // 2. 如果出现错误，重新渲染登录页面，并显示错误信息
    if (errors.length > 0) {
        res.render('login.ejs', { errors, formData: req.body });
        return;
    }


    // 3️.查询数据库中的用户
    const sqlquery = "SELECT * FROM users Where email = ?";
    db.query(sqlquery, [email], async (err, results) => {
        if (err) {
            console.error("Database error: ", err.message);
            return res.status(500).send("Internal server error");
        }

        //4. If no matching user can be found
        if (results.length === 0) {
            errors.push({ field: 'email', message: 'Incorrect wmail or password.' });
            return res.render('login.ejs', { errors, formData: req.body });
        }

        // 5. 获取用户信息
        const user = results[0];
        const hashedPassword = user.password_hash;

        // 6. 使用bcrypt.compare()检查密码是否匹配数据库里的字符串
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            errors.push({ field: 'email', message: 'Incorrect email or password.' });
            return res.render('login.ejs', { error, formData: req.body });
        }

        // 7.如果密码匹配，创建会话
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
