// routes/register.js
const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();
const countries = require('countries-list').countries;
const { promisify } = require('util');
const { error } = require('console');

const query = promisify(global.db.query).bind(global.db);

// [1] 获取注册表单页面
router.get("/register", function (req, res) {
    const countryList = Object.values(countries).map(country => country.name);
    // 渲染时给出空的错误数组、空表单数据
    res.render("register.ejs", { errors: [], formData: {}, countryList });
});

// [2] 处理注册表单提交
router.post('/registered', async function (req, res) {
    const { first, last, email, password, confirmPassword, phone, Occupation, country, organization } = req.body;
    let errors = [];

    // 1) 基本字段校验
    if (!first || first.trim() === '') errors.push({ field: 'first', message: 'First name is required.' });
    if (!last || last.trim() === '') errors.push({ field: 'last', message: 'Last name is required.' });
    if (!email || email.trim() === '') errors.push({ field: 'email', message: 'Email is required.' });
    if (!password || password.trim() === '') errors.push({ field: 'password', message: 'Password is required.' });
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

    // 2) 密码一致性与长度校验
    if (password !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Passwords do not match.' });
    }
    if (password.length < 8) {
        errors.push({ field: 'password', message: 'Password must be at least 8 characters long.' });
    }

    // 若有错误，则返回表单并显示错误
    const countryList = Object.values(countries).map(country => country.name);
    if (errors.length > 0) {
        return res.render('register.ejs', {
            errors,
            formData: req.body,
            countryList,
            success: ''
        });
    }

    try {
        // 3) 检查user表格邮箱是否已存在
        const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
        const results = await query(checkEmailQuery, [email]);

        if (results.length > 0) {
            errors.push({ field: 'email', message: 'Email is already registered.' });
            return res.render('register.ejs', {
                errors,
                formData: req.body,
                countryList,
                success: ''
            });
        }

        // 检查temp_users表，看是否有待验证记录
        const sqlCheckTemp = "SELECT temp_user_id FROM temp_users WHERE email = ?"
        const existingTemps = await query(sqlCheckTemp, [email]);

        if (existingTemps.length > 0) {
            errors.push({
                field: 'email',
                message: 'Email is already registered.'
            });
            return res.render('register.ejs', {
                errors,
                formData: req.body,
                countryList,
                success: ''
            });
        }


        // 4) 生成哈希密码 
        const password_hash = await bcrypt.hash(password, 10);

        // 5) 生成验证 token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // 6) 插入用户数据（初始 email_verified=0, votes_remaining=3）
        let insertSql = `
            INSERT INTO temp_users
            (first_name, last_name, email, password_hash, occupation, organization_country,
            organization_name, phone, verification_token, created_at, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR))
        `;

        const params = [
            first.trim(),
            last.trim(),
            email.trim(),
            password_hash,
            Occupation.trim(),
            country.trim(),
            organization.trim(),
            phone ? phone.trim() : null,
            verificationToken
        ];
        await query(insertSql, params);

        // 6) 发送验证邮件
        await sendVerificationEmail(email.trim(), verificationToken);

        // 7) 注册成功，返回提示
        return res.render('register.ejs', {
            success: "Registration successful! Please check your email to verify your account.",
            errors: [],
            formData: {},
            countryList
        });

    } catch (err) {
        console.error("Registered route:", err);
        errors.push({ message: 'Server error, Please check you email to verify.' })
        return res.render('register.ejs', {
            errors,
            formData: req.body,
            countryList,
            success: ''
        });
    }
}); // end of router.post

// 辅助函数: 发送验证邮件
async function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS  // Gmail的App密码或其他SMTP密码
        }
    });

    const verificationLink = `${process.env.BASE_URL}/verify?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: ${verificationLink}`
    };


    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);

}

module.exports = router;
