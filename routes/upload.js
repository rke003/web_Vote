const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// multer middleware: for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads'); // 存放上传的文件
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 限制文件大小为 2MB
});

// session middleware: 检查用户是否登录
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/login'); // 跳转到登录页面
    }
}

// 处理 GET 请求，渲染上传页面
router.get("/upload", ensureAuthenticated, function (req, res) {
    res.render("upload.ejs", { error: null, success: null });
});

// 处理上传请求
router.post("/upload", ensureAuthenticated, upload.single("image"), function (req, res) {
    if (!req.file) {
        return res.render("upload.ejs", { error: "No file uploaded. Please select an image.", success: null });
    }

    const imageUrl = '/uploads/' + req.file.filename;
    const { title, description } = req.body;
    const userId = req.session.user.id;

    // 2️⃣ **检查该用户是否已经上传过作品**
    let checkUserUploadQuery = "SELECT * FROM works WHERE user_id = ?";
    db.query(checkUserUploadQuery, [userId], function (err, results) {
        if (err) {
            console.error("Database error: ", err);
            return res.render("upload.ejs", { error: "Database error. Please try again later.", success: null });
        }

        if (results.length > 0) {
            return res.render("upload.ejs", { error: "You have already uploaded a work. Each user can only upload one work.", success: null });
        }

        //  **用户未上传过作品，执行插入**
        let sqlquery = "INSERT INTO works (user_id, title, description, image_url) VALUES (?, ?, ?, ?)";
        let newrecord = [userId, title, description, imageUrl];

        db.query(sqlquery, newrecord, function (err, result) {
            if (err) {
                console.error(err.message);
                return res.render("upload.ejs", { error: "Failed to upload work. Please try again later.", success: null });
            }

            // **上传成功，显示成功提示**
            return res.render("upload.ejs", { error: null, success: "Your work has been successfully uploaded! Please return to the homepage." });
        });
    });
});

// 处理上传文件超出大小的错误
router.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.render("upload.ejs", { error: "File size exceeds the limit of 2MB.", success: null });
    }
    next(err);
});

module.exports = router;
