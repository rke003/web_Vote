// 创建一个新的通道
const express = require("express");
const router = express.Router();

// 详情页面（目前）
router.get("/about", function (req, res) {
    res.render("about.ejs")
});

module.exports = router;