// routes/login.js
const express = require("express");
const router = express.Router();

// 登录页面
router.get("/login", function (req, res) {
    res.render("login.ejs", { errors: [], formData: {} });
});

// 登录处理逻辑
router.post('/logined', function (req, res) {
    const { email, password } = req.body;
    let errors = [];

    // 验证邮箱和密码是否为空
    if (!email || email.trim() === '') {
        errors.push({ field: 'email', message: 'Email is required.' });
    }
    if (!password || password.trim() === '') {
        errors.push({ field: 'password', message: 'Password is required.' });
    }

    // 如果有错误，重新渲染登录页面并附带错误信息
    if (errors.length > 0) {
        res.render('login.ejs', { errors, formData: req.body });
        return;
    }


    //数据库
    const sqlquery = "SELECT * FROM users Where email = ? AND password_hash = ?";
    db.query(sqlquery, [email, password], (err, results) => {
        if (err) {
            console.error("Database error: ", err.message);
            return res.status(500).send("Internal server error");
        }

        //如果找不到匹配用户
        if (results.length === 0) {
            errors.push({ field: 'email', message: 'Incorrect wmail or password.' });
            return res.render('login.ejs', { errors, formData: req.body });
        }

        // 找到用户并创建会话
        const user = results[0]; // 确保只在有结果时访问
        req.session.user = {
            id: user.user_id,
            email: user.email,
            username: user.username
        };

        // 重定向到主页
        res.redirect('/');
    });
});

// 导出路由模块
module.exports = router;
