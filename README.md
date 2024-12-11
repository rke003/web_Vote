# 1. Outline

This web application is a platform for a photography competition aimed at promoting fairness and inclusiveness in the chemical science community. It allows users from various backgrounds, including students, researchers, and professionals, to share their creativity through photography. The platform is designed to be simple, user-friendly, and accessible.

Users can register and log in to upload their photos along with titles and descriptions. The photos are displayed in an online gallery where other users can view and vote for their favorite entries. The voting system ensures that everyone has an equal opportunity to participate and be recognized. The competition is open to all and encourages submissions from underrepresented groups to foster diversity.

This project was originally developed for an upcoming external chemistry education photography competition event, where I am solely responsible for the website's design and development. Due to the time constraints of my coursework, I have submitted the current incomplete version of the project as part of my final assignment. Despite being a work in progress, this version fully meets the requirements of my coursework and demonstrates my technical skills in web development, including frontend and backend integration, responsive design, and user interaction features.

---
# 2. Links
[github repo](https://github.com/rke003/web_Vote.git)

---
# 3. Architecture
![Detailed Application  Architecture](./photo/1.png)

This project uses a **three-tier architecture**. The frontend includes 6 pages (Home, Login, Register, Upload, Search, About), built with HTML, CSS, JavaScript, and EJS templates. The backend is developed using Node.js and Express.js to manage routing, user authentication, file uploads, and communication with the database. The database is MySQL, with three main tables: Users for user information, Photos for picture details, and Votes for voting records. The frontend connects to the backend using HTTP requests, and the backend uses SQL queries to store and retrieve data from the database.

---
# 4.Database
This is the MySQL database EER diagram for my project.

![](./photo/2.png)

### Database relationships

users and works: 
- The user_id of the users table is the primary key.
- The user_id of the works table is a foreign key, indicating to which user a work belongs.

(One-to-many relationship: one user can upload multiple works.)

works and votes: 
- The work_id of the works table is the primary key.
- The work_id of the votes table is a foreign key, which indicates the work corresponding to a vote record.

(One-to-many relationship: a work can receive multiple votes.)

users and votes: 
- The user_id of the users table is the primary key.
- The user_id of the votes table is a foreign key representing the user of a vote record.

One-to-many relationship: a user can vote multiple times (but i limit it to one vote per work in the logic)

---
# 5. User Functionality
## Home page
The operation of this application is relatively simple, the main page features six main options, about, search, upload, login, register, and vote.

![](./photo/3.png)

The homepage comes with a responsive design.It is currently designed so that the width of the page is less than 760px and the navigation bar will be enabled.The goal is to put the three options in the middle of the homepage somewhere else and look more aesthetically pleasing.

![](./photo/4.png) 
![](./photo/5.png)

## About page
I added an extra option on this side for returning to the main page.
![](./photo/6.png)

## Login page
I added a little animation to this page, where the characters jump upwards as the user mouses over the input line.The bottom has the navigation for the back home page and the registration page.

The two features, remember password and retrieve password, have not been finished with the back-end logic yet due to time issues, and are currently only being written on the front-end.
![](./photo/7.png)

## Register page
The functionality of this page is as follows, similar to login, the backend verifies the user account and password by checking the database content.In the initial design, if the user does not fill in the content, it should be alerted by the front-end, and the back-end alert logic has also been completed.However, the current situation is that, because I wrote a js as an alert reminder when writing the back-end logic, but in the final css style adjustment, this style overrides the previous alerts, and needs to be further adjusted, but still time constraints, have not yet carried out the bug update.I have kept the validation logic in the file though.And the popups and parts of the display, for reasons I still need some research.

![](./photo/8.png)

![](./photo/9.png)

## Upload page
This page is mainly used to upload user's work, and in the back-end logic to achieve the user must be logged in to upload, if the user is not logged in to click on the upload option of the home page page, then it will be directly jumped into the login page to assist the user to operate.

Explanation for the Chinese part: I checked my original code and I didn't see the Chinese part of my settings, so I'm not sure why the button to upload a file would show Chinese at the moment.It's possible that some part of the Chinese comments are confusing, and since the number of code is so large at the moment, I'll try to find the problem and fix it in the final commit.

![](./photo/10.png)

## Search page
The search page currently only supports searching by typing in a user ID, so the search field is limited to just numbers (the user ID is shown on the home page).
![](./photo/11.png)

## Search-result page
This page is divided into two cases.One is when the search is successful and the corresponding user's work can be displayed.One is when the search is not successful and the page not found is displayed.

To make it more intuitive, I've currently reduced the screen to 67% to see the full effect, and the actual image will be bigger.
![](./photo/12.png)

![](./photo/13.png)
