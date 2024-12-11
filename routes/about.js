// Create a new channel
const express = require("express");
const router = express.Router();

// Details page (currently)
router.get("/about", function (req, res) {
    res.render("about.ejs")
});

module.exports = router;