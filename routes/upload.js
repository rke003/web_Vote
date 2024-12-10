const express = require("express");
const router = express.Router();
// multer是用于处理上传文件的表单数据的中间件。简化文件上传过程。
const multer = require("multer");
const path = require("path");


// multer中间件：用于文件上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');//文件保存路径
    },

    filename: function (req, file, cb) {
        // 设置文件名
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }
});

// session中间件：检查用户是否已登录
// 在 Express 框架中，session 中间件是用来管理用户会话的工具，可以帮助你在不同的请求之间保存用户信息。
// 它通常用于实现登录状态管理、购物车等功能。
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/login'); // 重定向到登录页面
    }
}



// get用于处理GET请求
// 上传页面
router.get("/upload", ensureAuthenticated, function (req, res) {
    res.render("upload.ejs");
});

// 处理post请求
// 处理上传请求逻辑
router.post("/upload", ensureAuthenticated, upload.single("image"), function (req, res) {
    // 验证是否上传了图片
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // 生成文件路径
    const imageUrl = '/uploads/' + req.file.filename;

    // 插入数据到works表
    let sqlquery = "INSERT INTO works (user_id, title, description, image_url) VALUES (?, ?, ?, ?)";
    let newrecord = [req.session.user.id, req.body.title, req.body.description, imageUrl];


    // 执行SQL查询，将新作品添加到数据库中
    db.query(sqlquery, newrecord, function (err, result) {
        if (err) {
            console.error(err.message);
            return res.render("upload.ejs", { error: "Failed to upload work. Please try again later." });
        }

        res.redirect('/');
    });// end mysql

}); // end router.post



// use 用于加载中间件函数
router.use(function (err, req, res, next) {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send('File size exceeds the limit of 2MB.');
    }
    next(err);
});// end router.use


module.exports = router;



