const express = require("express");
const router = express.Router();
// multer is the middleware used to process form data for uploading files.Simplifies the file upload process.
const multer = require("multer");
const path = require("path");


// multer middleware: for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //File Save Path
        cb(null, './public/uploads');
    },

    filename: function (req, file, cb) {
        // Set the file name
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }
});

// session middleware: check if the user is logged in or not
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/login'); // Redirect to login page
    }
}


// get is used to handle GET requests
// upload page
router.get("/upload", ensureAuthenticated, function (req, res) {
    res.render("upload.ejs");
});

// Handling post requests
// Handle upload request logic
router.post("/upload", ensureAuthenticated, upload.single("image"), function (req, res) {
    // Verify that the image was uploaded
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // Generate file path
    const imageUrl = '/uploads/' + req.file.filename;

    // Insert data into works table
    let sqlquery = "INSERT INTO works (user_id, title, description, image_url) VALUES (?, ?, ?, ?)";
    let newrecord = [req.session.user.id, req.body.title, req.body.description, imageUrl];


    // Execute a SQL query to add the new work to the database
    db.query(sqlquery, newrecord, function (err, result) {
        if (err) {
            console.error(err.message);
            return res.render("upload.ejs", { error: "Failed to upload work. Please try again later." });
        }

        res.redirect('/');
    });// end mysql

}); // end router.post



// use for loading middleware functions
router.use(function (err, req, res, next) {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send('File size exceeds the limit of 2MB.');
    }
    next(err);
});// end router.use


module.exports = router;



