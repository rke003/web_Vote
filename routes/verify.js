// routes/verify.js
const express = require('express');
const router = express.Router();
const { promisify } = require('util');
const query = promisify(global.db.query).bind(global.db);

// GET /verify-email?token=xxxx
router.get('/verify', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.send("Invalid verification link");
    }

    try {
        // 1) 查询temp_users
        const findSql = `
        SELECT * FROM temp_users
        WHERE verification_token = ? AND expires_at > NOW()
        LIMIT 1
        `
        const records = await query(findSql, [token]);
        if (records.length === 0) {
            return res.send("Verification failed or token expired.");
        }

        const tempUser = records[0];

        // 2) 组合名字
        const fullName = `${tempUser.first_name} ${tempUser.last_name}`;

        // 3) 插入到正式的users
        const insertUserSql = `
        INSERT INTO users
        (username, email, password_hash, occupation, organization_country, organization_name, phone, email_verified, votes_remaining, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 3, NOW(), NOW())
        `;

        const userParams = [
            fullName,
            tempUser.email,
            tempUser.password_hash,
            tempUser.occupation,
            tempUser.organization_country,
            tempUser.organization_name,
            tempUser.phone
        ];
        await query(insertUserSql, userParams);

        // 4) 删除 temp_users的记录
        const deleteSql = `DELETE FROM temp_users WHERE temp_user_id = ?`;
        await query(deleteSql, [tempUser.temp_user_id]);


        // 5) 验证成功，跳转回登录页面，带上成功提示
        return res.render("login.ejs", {
            success: "Email verified! You can now log in.",
            errors: [],
            formData: {},
            rememberMe: false
        });

    } catch (err) {
        console.error("Email verification error:", err);
        return res.status(500).send("Internal server error.");
    }
});

module.exports = router;
