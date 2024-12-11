-- Insert test data from the users table
INSERT INTO users (username, email, password_hash, votes_remaining, occupation, organization_country, organization_name, phone)
VALUES
('Ruike Zhang', '1315431846@qq.com', '123456789', 1, 'Student', 'United Kingdom', NULL, NULL, '2024-12-07 00:01:05', '2024-12-10 12:38:07'),
('Keke Zhang', 'rzhan004@campus.goldsmiths.ac.uk', '123456789', 2, 'Student', 'United Kingdom', NULL, NULL, '2024-12-08 18:15:27', '2024-12-08 18:29:21');

-- Insert test data from the works table
INSERT INTO works (user_id, title, description, image_url, votes_received)
VALUES
(1, 'Test picture', 'This is describe', '/uploads/image-1733584895519.jpg', 2),
(2, 'Test', 'Test describe', '/uploads/image-1733682522210.JPG', 1);

-- Insert test data from the votes table
INSERT INTO votes (user_id, work_id)
VALUES
(1, 2),
(2, 1);
