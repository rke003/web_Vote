// Setup express and ejs
var express = require('express')
var ejs = require('ejs')
var mysql = require('mysql2');

const app = express();
const port = 8000;


const db = mysql.createConnection({
    host: 'localhost',
    user: 'VoteUser',
    password: 'ab2024',
    database: 'vote_project2024'
});


// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }

    console.log('Connected to database');
});

global.db = db;

// Set up css
app.use(express.static(__dirname + '/public'));

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser 
app.use(express.urlencoded({ extended: true }));


// Use the express-session middleware to manage user login state:
const session = require('express-session');
app.use(session({
    // 安全秘钥
    secret: '1315431846',
    resave: false,
    saveUninitialized: true
}));


//load the route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

// Importing registration-related routes
const registerRoutes = require('./routes/register');
app.use('/', registerRoutes);

// Import Login Page Route
const loginRoutes = require('./routes/login');
app.use('/', loginRoutes);

// Import upload page
const uploadRoutes = require('./routes/upload');
app.use('/', uploadRoutes)

// about page
const aboutRoutes = require('./routes/about');
app.use('/', aboutRoutes);

// search page
const searchRoutes = require('./routes/search');
app.use('/', searchRoutes);





// Start listening for HTTP requests
app.listen(port, () => console.log(`Node server is runing on port ${port}!...`));


