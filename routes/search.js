// 引入 express
const express = require('express');
const router = express.Router();

router.get('/search', function (req, res) {
    res.render("search.ejs");
});

router.get('/search-result', function (req, res) {
    const userId = req.query.user_id;
    console.log("Received user_id:", userId);


    if (!userId || isNaN(userId)) {
        return res.status(400).send("Invalid User ID. Please provide a valid User ID.");
    }


    //查询数据库获取用户作品
    const sqlquery = "SELECT * FROM works WHERE user_id = ?";
    db.query(sqlquery, [userId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Internal server error.")
        }

        //检查是否有作品
        if (results.length === 0) {
            return res.status(404).send("No works found for the given User ID.");
        }
        res.render("search_results", { works: results, user_id: userId });
    });

});

module.exports = router;