// 引入 express
const express = require('express');
const router = express.Router();

router.get('/search', function () {
    res.render("search.ejs");
});

router.get('/search-result', function (req, res) {
    res.send("You searched for:" + req.query.keyword)
});

module.exports = router;