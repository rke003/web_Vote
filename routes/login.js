// routes/login.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { promisify } = require("util");

const query = promisify(global.db.query).bind(global.db);

// [1] 登录页面
router.get("/login", function (req, res) {
    const rememberedEmail = req.cookies.rememberedEmail || '';
    const rememberMeChecked = req.cookies.rememberMe === "true" ? true : false; // 读取 Remember Me 状态
    // 默认 errors=[], 并且把 rememberedEmail 作为初始 formData
    res.render("login.ejs", { errors: [], formData: { email: rememberedEmail }, rememberMe: rememberMeChecked });
});

// [2] 登录表单处理
router.post('/logined', async function (req, res) {
    const { email, password, rememberMe } = req.body;
    let errors = [];

    // 1) 简单验证
    if (!email || email.trim() === '') {
        errors.push({ field: 'email', message: 'Email is required.' });
    }
    if (!password || password.trim() === '') {
        errors.push({ field: 'password', message: 'Password is required.' });
    }

    if (errors.length > 0) {
        return res.render('login.ejs', { errors, formData: req.body, rememberMe });
    }

    try {
        // 2) 查询数据库
        const sqlquery = "SELECT * FROM users WHERE email = ?";
        const results = await query(sqlquery, [email]);

        // 用户不存在
        if (results.length === 0) {
            errors.push({ field: 'email', message: 'Incorrect email or password.' });
            return res.render('login.ejs', { errors, formData: req.body });
        }

        const user = results[0];

        // 3) 检查是否已经验证邮箱
        if (user.email_verified == 0) {
            return res.render('login.ejs', {
                errors: [{ field: 'email', message: 'Please verify your email before logging in.' }],
                formData: req.body
            });
            console.log("user.email_verified:", user.email_verified, typeof user.email_verified);
        }

        // 4) bcrypt 对比密码哈希
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            errors.push({ field: 'email', message: 'Incorrect email or password.' });
            return res.render('login.ejs', { errors, formData: req.body });
        }

        // 5) 密码正确，写入 session
        req.session.user = {
            id: user.user_id,
            email: user.email,
            username: user.username
        };

        // 6) Remember Me 功能：如果勾选则设置 cookie，否则清除
        if (rememberMe) {
            res.cookie("rememberedEmail", email, {
                maxAge: 7 * 24 * 60 * 60 * 1000,  // 1 周
                httpOnly: true,
                secure: false  // 若使用 HTTPS，请改为 true
            });

            res.cookie("rememberMe", "true", {
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        } else {
            res.clearCookie("rememberedEmail");
            res.clearCookie("rememberMe")
        }

        // 7) 登录成功，重定向到主页或其他页面
        return res.redirect('/');

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).send("Internal server error.");
    }
});

module.exports = router;
