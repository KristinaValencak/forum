# Forum Project

A web forum application with separated frontend and backend parts. The project supports user registration/login, thread creation, posting replies, and searching through threads.

## Historical Context

This project was originally built in **2023** and mainly represents an early learning phase. Because of that, the architecture and code organization are not at the same level as in newer projects (today, this would be built in a more modular way), and the frontend would be designed in a significantly more modern way. Some improvements are also missing, such as stronger tests, broader input validation, and more robust error handling. Even so, this project was a great foundation for learning and understanding both backend and frontend development, while showing the complete flow: React frontend + Node.js/Express API + MySQL database.

## Main Features

- User accounts: registration and login
- JWT authentication for protected actions
- Displaying a list of forum threads
- Creating new threads (protected endpoint)
- Displaying posts inside a specific thread
- Creating posts in a thread (protected endpoint)
- Searching threads by title

## Technologies

### Frontend
- React 18
- React Router DOM
- Axios
- Bootstrap

### Backend
- Node.js + Express
- MySQL
- JSON Web Token (JWT)
- bcrypt
- CORS, dotenv, helmet

## Project Structure

```text
forum/
├─ frontend/   # React application
├─ Backend/    # Express API and database connection
└─ README.md
```

## Installation and Run

### 1) Environment Setup

Install dependencies in the root folder and subfolders:

```bash
npm install
cd Backend && npm install
cd ../frontend && npm install
```

### 2) Backend (API)

Start the backend from the `Backend` folder:

```bash
npm start
```

Default port: `8081`

### 3) Frontend

Start the frontend from the `frontend` folder:

```bash
npm start
```

Default port: `3000`

## Environment Variables

Create a `.env` file in the `Backend` folder:

```env
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
ACCESS_TOKEN_SECRET=your_jwt_secret
```

## API Overview

Main backend endpoints:

- `POST /signup` - user registration
- `POST /login` - login and JWT return
- `GET /threads` - list all threads
- `POST /thread` - create a thread (requires Bearer token)
- `GET /posts/:thread_id` - get posts for a thread
- `GET /postsCount/:thread_id` - get number of posts in a thread
- `POST /createPost/:thread_id` - create a post (requires Bearer token)
- `GET /search?term=...` - search threads by title

## Possible Improvements

- Migrate backend to a more modern structure (controller/service/repository)
- Redesign frontend with a more modern component architecture and improved UI/UX approach
- Introduce TypeScript
- Add automated tests (unit + integration)
- Apply unified lint/format configuration
- Add Docker setup for easier local deployment

---
