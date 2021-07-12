# FYM (Find Your Mentor)
It is a fullstack web application made with **MVC** architecture with the idea to connect techies.
It is deployed on **AWS**. You can check it [here](https://www.fymapp.tech).

# Installation
1. Clone the repository
```
git clone "https://github.com/iamchetansharma8/fym.git"
```
2. Open terminal and navigate to fym.
3. Install node_modules
  ```
   npm install
  ```
4. Run application locally by :
  ```
   npm run
  ```

# Technical Details
1. Backend using node.js, express.js and mongoDB.
2. Front end using ejs, css and javascript.
3. Chats using **WebSocket**.
4. Mails are sent using **nodemailer**.
5. Authentication using **passport-local**, **Google OAuth 2.0** and **passport-jwt** strategies.
6. Profile photo upload using **multer**.
7. **Gulpjs** is used to minify css,images and javascript.
8. Delpoyed on AWS, nginx used as reverse proxy, ssl certificate taken from cloudflare.


# Features
1. Signup using google account or email id(**email verification** is done when signing in with email account).
2. **Forgot password** feature.
3. Create and publish **markdown supporting blogs**. Blogs can be **edited, deleted, liked/unliked**. Users can also **comment** on posts.
4. **Follow** other users and receive email notifications about their activity.
5. **One to one chat** with other users in private chatrooms as well as a **community chat** room.
6. Do **Video Calls**.
7. Complete your profile by adding topics of your interest, uploading profile photo.
8. Other users can be found by their name or by searching for topics of interest and finding techies with common topics of interest.
9. JWT authentication is also done for api's, but currently not using it as an active feature.
