### VibeNest - Publish Your Own Blogs
A modern, full-stack blogging platform where users can create, read, rate, and manage blogs with real-time notifications and cloud-based image uploads.

### Features
> User authentication (Signup/Login) with JWT tokens

> Create, edit, delete, and read blogs with categories

> Upload images directly to Cloudinary via the app

> Rate blogs with star ratings (including average ratings)

> Real-time notifications for new events

> Responsive UI with React and Bootstrap

> Backend API with Express, MongoDB, and Cloudinary integration

> Pagination and filtering by categories and authors

> Secure CORS handling and environment variables

### Technologies Used
> Frontend: React, React Router, Bootstrap, DOMPurify

> Backend: Node.js, Express.js, MongoDB, Mongoose

> Image Upload: Multer, Cloudinary

> Authentication: JWT (JSON Web Tokens)

> Deployment: Render (Frontend and Backend)

### Getting Started

## Prerequisites
> Node.js installed

> MongoDB URI (MongoDB Atlas or local)

> Cloudinary account for image uploads

## Installation
1. Clone the repo:
    git clone https://github.com/yourusername/vibenest.git
    cd vibenest

2. Setup backend environment variables in .env file:
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

3. Install backend dependencies and start the server:
    cd backend
    npm install
    npm run start

4. Setup frontend environment variables in .env file:
    REACT_APP_BACKEND_URL=http://localhost:5000

5. Install frontend dependencies and start React app:
    npm install
    npm start

6. Deployment
    Both frontend and backend are deployed on Render
    Make sure to configure environment variables properly on Render dashboard

7. Folder Structure
/backend
  /routes
  /models
  server.js
  ...

/src
    /components
    /context
    /pages
    ...

8. API Endpoints
/api/auth - Authentication routes (login, signup)

/api/blogs - CRUD operations for blogs, rating, fetching by categories or authors

/api/notifications - Notification fetching

9. Contributing
Feel free to open issues or submit pull requests for improvements and bug fixes.

10. License
MIT License

### Let me know if you want a README tailored for specific details or additional sections!

## Screenshots of the interface










Ask ChatGPT



Tools



ChatG