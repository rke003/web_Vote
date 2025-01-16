# Web Project Development Guide (English & Chinese)

## 1. Project Requirements Analysis and Planning (项目需求分析与规划)

**Main Features (主要功能)**:
1. User login and registration (用户登录和注册)
2. Project introduction page (项目介绍页面)
3. Artwork display page (including voting and commenting) (作品展示页面，包括投票和评论功能)
4. User upload artwork (image only) (用户上传作品，仅限图片)

**Database Selection (数据库选择)**: MySQL

---

## 2. Development Environment Setup (开发环境设置)

**Install Development Tools (安装开发工具)**: Visual Studio Code (or any text editor), Node.js, MySQL.

**Install Required Dependencies (安装必要的依赖)**:
- Backend (后端): Express.js (Node.js framework), EJS (templating engine), MySQL driver (`mysql2` or `sequelize`).
- Frontend (前端): EJS templates, Bootstrap or custom CSS.

**Project Initialization (项目初始化)**:
```bash
npm init -y
npm install express ejs mysql2 body-parser multer bcryptjs express-session
```
- `mysql2`: Connects to the MySQL database (连接 MySQL 数据库).
- `multer`: Handles file uploads (user image uploads) (处理文件上传，用户图片上传).
- `bcryptjs`: Used for encrypting user passwords (用于加密用户密码).
- `express-session`: Manages user session state (管理用户会话状态).

---

## 3. Database Design and Implementation (数据库设计与实现)

**Database Name (数据库名称)**: `web_project`

**Tables Design (数据表设计)**:

1. **Users Table (用户表)**: Stores user information (存储用户信息)
   ```sql
   CREATE TABLE Users (
       user_id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(50) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       email VARCHAR(100) UNIQUE NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Works Table (作品表)**: Stores user-uploaded artwork (images) (存储用户上传的作品，图片)
   ```sql
   CREATE TABLE Works (
       work_id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT,
       title VARCHAR(100),
       image_path VARCHAR(255),
       description TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES Users(user_id)
   );
   ```

3. **Votes Table (投票表)**: Stores user votes for artwork (存储用户对作品的投票)
   ```sql
   CREATE TABLE Votes (
       vote_id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT,
       work_id INT,
       is_upvote BOOLEAN,
       voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES Users(user_id),
       FOREIGN KEY (work_id) REFERENCES Works(work_id)
   );
   ```

4. **Comments Table (评论表)**: Stores user comments for artwork (存储用户对作品的评论)
   ```sql
   CREATE TABLE Comments (
       comment_id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT,
       work_id INT,
       content TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES Users(user_id),
       FOREIGN KEY (work_id) REFERENCES Works(work_id)
   );
   ```

---

## 4. Project Structure Design (项目结构设计)
```
web_project/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── workController.js
│   │   └── commentController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── workModel.js
│   │   └── commentModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── workRoutes.js
│   │   └── commentRoutes.js
│   ├── views/
│   │   ├── login.ejs
│   │   ├── register.ejs
│   │   ├── works.ejs
│   │   ├── upload.ejs
│   │   └── comments.ejs
│   ├── app.js
│   └── config.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── package.json
└── README.md
```

---

## 5. Project Page Design and Functionality (项目页面设计与功能实现)

### 1. User Login/Registration Page (用户登录/注册页面)
- **Page Names (页面名称)**: `views/login.ejs`, `views/register.ejs`
- **Features (功能)**:
  - User registration with hashed password storage (用户注册并使用哈希密码存储).
  - Login validation with `express-session` to maintain user state (使用 `express-session` 进行登录验证，保持用户状态).

**Example Registration Form (注册表单示例)**:
```html
<!-- register.ejs -->
<form action="/auth/register" method="POST">
    <input type="text" name="username" placeholder="Username" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Password" required>
    <button type="submit">Register</button>
</form>
```

### 2. Project Introduction Page (项目介绍页面)
- **Page Name (页面名称)**: `views/works.ejs`
- **Functionality (功能)**: Displays the main purpose of the website, project introduction, and artwork display (显示网站的主要目的，项目介绍和作品展示).

### 3. Artwork Display, Voting, and Commenting Page (作品展示、投票和评论页面)
- **Page Names (页面名称)**: `views/works.ejs` and `views/comments.ejs`
- **Features (功能)**:
  - **Artwork Display (作品展示)**: Retrieve and display all artworks from the `Works` table (从 `Works` 表中检索并显示所有作品).
  - **Voting (投票)**: Users can vote for each artwork (upvote or downvote) (用户可以对每个作品进行投票，点赞或点踩).
  - **Commenting (评论)**: Users can comment on each artwork, comments stored in the `Comments` table (用户可以对每个作品发表评论，评论存储在 `Comments` 表中).

**Artwork Display Example Code (作品展示代码示例)**:
```html
<!-- works.ejs -->
<% works.forEach(function(work) { %>
    <div class="work">
        <img src="<%= work.image_path %>" alt="<%= work.title %>">
        <h3><%= work.title %></h3>
        <p><%= work.description %></p>
        <form action="/vote" method="POST">
            <input type="hidden" name="work_id" value="<%= work.work_id %>">
            <button type="submit" name="is_upvote" value="1">Upvote</button>
            <button type="submit" name="is_upvote" value="0">Downvote</button>
        </form>
        <a href="/comments/<%= work.work_id %>">View Comments</a>
    </div>
<% }); %>
```

### 4. Artwork Upload Page (作品上传页面)
- **Page Name (页面名称)**: `views/upload.ejs`
- **Features (功能)**: Users can upload images, enter title and description, and save the image path to the `Works` table (用户可以上传图片，填写标题和描述，并将图片路径保存到 `Works` 表中).
- Uses `Multer` middleware for file upload (使用 `Multer` 中间件处理文件上传).

**Upload Form Example Code (上传表单代码示例)**:
```html
<!-- upload.ejs -->
<form action="/upload" method="POST" enctype="multipart/form-data">
    <input type="text" name="title" placeholder="Work Title" required>
    <textarea name="description" placeholder="Work Description"></textarea>
    <input type="file" name="image" accept="image/*" required>
    <button type="submit">Upload</button>
</form>
```

---

## 6. Backend Routes and Controller Logic Implementation (后端路由和控制器逻辑实现)

- **User Registration and Login Controller (用户注册和登录控制器)** (`authController.js`):
  - Register: Hash the password and store it in the database (注册：对密码进行哈希处理并存储在数据库中).
  - Login: Validate user credentials and save user session state using `express-session` (登录：验证用户凭证并使用 `express-session` 保存用户会话状态).

- **Artwork Management Controller (作品管理控制器)** (`workController.js`):
  - Handle artwork upload, display, and retrieval (处理作品上传、展示和检索).

- **Voting Controller (投票控制器)** (`voteController.js`):
  - Handle voting logic and ensure users can vote only once per artwork (处理投票逻辑，并确保用户对每个作品只能投票一次).

- **Comment Controller (评论控制器)** (`commentController.js`):
  - Handle commenting on artworks (处理对作品的评论).

---

## 7. Frontend Styling and User Experience Optimization (前端样式和用户体验优化)

- **CSS File (CSS 文件)** (`public/css/style.css`): Add styling to ensure a clean and consistent layout (添加样式以确保页面布局干净一致).
- **JavaScript File (JavaScript 文件)** (`public/js/main.js`): Add JavaScript for form validation and interactive behavior (添加 JavaScript 进行表单验证和交互行为).

---

## 8. Project Launch and Testing (项目启动与测试)

1. **Database Connection (数据库连接)**: Use `config.js` to configure the MySQL connection (使用 `config.js` 配置 MySQL 连接).
2. **Start the Server (启动服务器)**:
   ```bash
   node src/app.js
   ```
3. **Manual Testing (手动测试)**: Test each page, including user registration, login, artwork upload, voting, and commenting. Ensure all functionalities work correctly in the database (测试每个页面，包括用户注册、登录、作品上传、投票和评论，确保所有功能在数据库中正确运行).

---

## 9. Additional Feature Suggestions (附加功能建议)

- **User Management (用户管理)**: Provide a profile page for users to view or update their information (提供个人资料页面，用户可以查看或更新自己的信息).
- **Error Handling and Security (错误处理和安全性)**:
  - Restrict access to certain pages for non-logged-in users (限制未登录用户对某些页面的访问).
  - Validate uploaded files to prevent malicious file uploads (验证上传的文件，以防止恶意文件上传).

- **Pagination (分页)**: Add pagination to the artwork display to enhance user experience (在作品展示中添加分页功能，以提升用户体验).

---

Through this process, you can gradually implement your web project, starting from basic user registration and login, then extending to artwork display, voting, commenting, and uploading. Using MySQL helps efficiently manage user, artwork, comment, and voting data, making the application robust and reliable.

通过这个过程，你可以逐步实现你的 Web 项目，从基本的用户注册和登录开始，然后扩展到作品展示、投票、评论和上传功能。使用 MySQL 可以有效地管理用户、作品、评论和投票数据，使应用程序健壮且可靠。

