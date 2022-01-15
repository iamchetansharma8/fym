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
4. Mails are sent using **nodemailer**, **kue** and **redis** are used to implement delayed jobs.
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

# Screenshots
<img width="1440" alt="Screenshot 2022-01-15 at 23 52 25" src="https://user-images.githubusercontent.com/54721715/149633500-cbf4a3c5-8e11-4af6-94e0-eaf8c9907156.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 52 34" src="https://user-images.githubusercontent.com/54721715/149633521-07e7fca1-38d1-48b8-ae6d-e8dd06089546.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 52 41" src="https://user-images.githubusercontent.com/54721715/149633536-de0b6a5a-601f-4665-9367-e5c08ee264c1.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 52 51" src="https://user-images.githubusercontent.com/54721715/149633554-b64915d6-b438-4063-af49-2e1740d146be.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 52 59" src="https://user-images.githubusercontent.com/54721715/149633561-6622b561-4f26-4254-a725-7d62c8bb67b4.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 53 35" src="https://user-images.githubusercontent.com/54721715/149633592-80993ee4-55f3-40a8-9682-4bc79175beba.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 53 45" src="https://user-images.githubusercontent.com/54721715/149633596-fb8337ec-ac04-4bbe-a1f4-04b57071e296.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 54 13" src="https://user-images.githubusercontent.com/54721715/149633599-1934336b-682a-4076-9939-96d189651f16.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 54 25" src="https://user-images.githubusercontent.com/54721715/149633615-2e64c898-c617-4bcf-ae9e-940e87161a3f.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 54 33" src="https://user-images.githubusercontent.com/54721715/149633626-2b2ccce6-f1bd-41ed-9163-98bedec9cef9.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 54 50" src="https://user-images.githubusercontent.com/54721715/149633639-d27fd9bc-40d7-49c7-a28d-7e43f3bb0a15.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 55 10" src="https://user-images.githubusercontent.com/54721715/149633654-349ac81c-fbc9-4127-84a3-260ed504b018.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 55 36" src="https://user-images.githubusercontent.com/54721715/149633668-cdfe54a2-f7a0-4699-8949-ddc013731363.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 55 57" src="https://user-images.githubusercontent.com/54721715/149633688-d7cea4ae-6580-459a-92b6-5be4975f4a67.png">
<img width="1440" alt="Screenshot 2022-01-15 at 23 56 31" src="https://user-images.githubusercontent.com/54721715/149633697-5b736cac-ee37-4937-868c-e24d0aaa36cf.png">
<img width="1440" alt="Screenshot 2022-01-16 at 00 08 25" src="https://user-images.githubusercontent.com/54721715/149633885-77f6d826-2f17-48f3-8ae4-972abc5850b8.png">
