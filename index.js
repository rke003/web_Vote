// Setup express and ejs
var express = require('express')
var ejs = require('ejs')
var mysql = require('mysql2');


// app是用于创建了一个新的Express的英语实例。一般放在主文件当中。
// route可以看做一个微型的app，可以把大应用中将路由和中间件的逻辑拆分为多个摸了，简化代码的管理和复用性。
const app = express();
const port = 8000;


const db = mysql.createConnection({
    // MYSQL服务器的主机名，通常是‘localhost’。如果数据库托管在远程服务器上，填写该服务器的IP地址或域名
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

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser 
app.use(express.urlencoded({ extended: true }));


// 用 express-session 中间件来管理用户登录状态：
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

// 导入注册相关的路由
const registerRoutes = require('./routes/register');
app.use('/', registerRoutes);

// 导入login page route
const loginRoutes = require('./routes/login');
app.use('/', loginRoutes);

// 导入上传页面
const uploadRoutes = require('./routes/upload');
app.use('/', uploadRoutes)

// about页面
const aboutRoutes = require('./routes/about');
app.use('/', aboutRoutes);

// search page
const searchRoutes = require('./routes/search');
app.use('/', searchRoutes);


// Set up css
app.use(express.static(__dirname + '/public'));


// Start listening for HTTP requests
app.listen(port, () => console.log(`Node server is runing on port ${port}!...`));


