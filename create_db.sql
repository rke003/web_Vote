-- 创建数据库
CREATE DATABASE IF NOT EXISTS vote_project2024;
USE vote_project2024;

-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    votes_remaining INT DEFAULT 3,  -- 🛠️ 默认 3 票
    occupation VARCHAR(50),
    organization_country VARCHAR(100),
    organization_name VARCHAR(100),
    phone VARCHAR(15),
    verification_token VARCHAR(255) DEFAULT NULL, -- 🛠️ 邮箱验证
    email_verified TINYINT(1) DEFAULT 0,          -- 🛠️ 是否已验证
    reset_token VARCHAR(255) DEFAULT NULL,        -- 🛠️ 密码重置 Token
    reset_token_expiry DATETIME DEFAULT NULL      -- 🛠️ 密码重置 Token 过期时间
);

-- 创建 works 表
CREATE TABLE IF NOT EXISTS works (
    work_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    votes_received INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE -- 🛠️ 删除用户时，作品也删除
);

-- 创建 votes 表
CREATE TABLE IF NOT EXISTS votes (
    vote_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    work_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (work_id) REFERENCES works(work_id) ON DELETE CASCADE
);

-- 创建 temp_users 表 (用于邮箱验证)
CREATE TABLE IF NOT EXISTS temp_users (
    temp_user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    occupation VARCHAR(50),
    organization_country VARCHAR(100),
    organization_name VARCHAR(100),
    phone VARCHAR(15),
    verification_token VARCHAR(255) NOT NULL, -- 🛠️ 存储临时 Token
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME DEFAULT NULL -- 🛠️ 过期时间 (可设置 24 小时后)
);

-- 插入一个测试用户 (默认密码: password123)
INSERT INTO users (username, email, password_hash, occupation, organization_country, organization_name, phone, email_verified)
VALUES ('Test User', 'test@example.com', '$2b$10$VbN1E0U/9JFqgWUIXQ0e/ehRjBqDOPHYY.ZI/7r1Y6o.2DU8TqC7S', 
        'Student', 'United Kingdom', 'University', '1234567890', 1);

