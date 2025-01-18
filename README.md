
# MentorMate

This repository contains the backend implementation of a user and buddy management system. It features user authentication, session management, and role-specific functionalities for "buddies."

## Features

- User Authentication with JWT
- Role-based operations for users and buddies
- Session creation, management, and approval
- Redis caching for improved performance
- Error handling middleware
- Email notification support using Nodemailer

## Technologies Used

- **Node.js**: Backend runtime
- **Express.js**: Web framework
- **MongoDB**: Database
- **Redis**: Caching layer
- **JWT**: Token-based authentication
- **Nodemailer**: Email notifications

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `config` directory with the following variables:
   ```env
   PORT=5000
   DB_LOCAL_URI=mongodb://localhost:27017/your-db-name
   JWT_SECRET=your_jwt_secret
   COOKIE_EXPIRES_TIME=7
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_EMAIL=your-email@example.com
   SMTP_PASSWORD=your-email-password
   SMTP_FROM_NAME=YourName
   SMTP_FROM_EMAIL=no-reply@example.com
   REDIS_URI=localhost
   REDIS_PORT=6379
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Project Structure

```
/
├── config/               # Configuration files (database, Redis, environment)
├── controllers/          # Route handler logic
├── middleWares/          # Custom middleware (auth, error handling)
├── models/               # Mongoose schemas
├── routes/               # Route definitions
├── utils/                # Utility functions (JWT, email handling)
├── app.js                # Main app configuration
├── server.js             # Server initialization
└── package.json          # Dependencies and scripts
```

## API Endpoints

### User Routes

| Method | Endpoint               | Description                         |
|--------|------------------------|-------------------------------------|
| GET    | `/api/v1/user/test`    | Test the API connection             |
| POST   | `/api/v1/user/signup`  | Create a new user                   |
| POST   | `/api/v1/user/login`   | Log in a user                       |
| GET    | `/api/v1/user/logout`  | Log out a user                      |
| POST   | `/api/v1/user/profile` | Get or update user profile          |

### Buddy Routes

| Method | Endpoint                          | Description                          |
|--------|-----------------------------------|--------------------------------------|
| GET    | `/api/v1/buddy/requests`          | Get pending session requests         |
| GET    | `/api/v1/buddy/schedule`          | Get scheduled sessions               |
| GET    | `/api/v1/buddy/previousSessions`  | Get completed sessions               |
| PATCH  | `/api/v1/buddy/approveSession`    | Approve a session request            |
| PATCH  | `/api/v1/buddy/rejectSession`     | Reject a session request             |

## Middleware

- **Authentication**: Validates JWT tokens for secure routes.
- **Error Handling**: Provides structured error responses.
- **Async Handling**: Wraps async functions to handle promise rejections.

## Contribution

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.
