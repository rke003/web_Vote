// Setup express and ejs
var express = require('express')
var ejs = require('ejs')
var mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
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

// 告诉 Express 我们要使用 EJS 作为模板引擎
app.set('view engine', 'ejs');

// Set up the body parser 
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser()); // ✅ 这里启用 `cookie-parser`

// 使用 express-session 中间件管理用户登录状态：
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

//verify page
const verifyRoutes = require('./routes/verify');
app.use('/', verifyRoutes);

// Start listening for HTTP requests
app.listen(port, '0.0.0.0',() => console.log(`Node server is runing on port ${port}!...`));


