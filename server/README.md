# Task Management App – NestJS Backend

This project is the backend for a Trello-inspired task management application built using **NestJS**. It provides a secure REST API for user authentication (including Google OAuth) and task management operations.

---

> **Node Version:** 18.x  
> **NestJS Version:** 11.x


## Features

### Core Functionality

- RESTful APIs for creating, reading, updating, and deleting tasks
- JWT-based authentication for secure API access
- Google Login support via OAuth 2.0
- Server-side validation using DTOs
- Protected routes using Guards
- Error handling with standardized responses
- Modular and scalable code structure

---

## Libraries & Tools

| Tool/Library          | Purpose                                |
|-----------------------|----------------------------------------|
| `NestJS`              | Node.js framework                      |
| `@nestjs/jwt`         | JWT authentication                     |
| `@nestjs/passport`    | Auth strategies                        |
| `passport-google-oauth20` | Google login strategy             |
| `class-validator`     | Input validation via DTOs              |
| `Mongoose` | ORM for DB communication               |
| `bcrypt`              | Password hashing                       |
| `Helmet`              | Security headers                       |
| `MongoDB`              | NO SQL Database                       |

---

## Authentication Flow

- Users register or log in using email/password or Google login
- A JWT is issued and returned to the frontend
- Each protected route requires a valid Bearer token in the `Authorization` header
- Middleware/guards verify and decode tokens for secure access

---

## API Endpoints

### Auth Routes

- `POST /auth/signup` – Register a new user
- `POST /auth/login` – Login with email & password
- `POST /auth/google-login` – Login with Google

### Task Routes (Protected)

- `GET /tasks` – Get all tasks for logged-in user
- `POST /tasks` – Create a new task
- `PUT /tasks/:id` – Update a task
- `DELETE /tasks/:id` – Delete a task

---

## Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Create environment file
cp .env.example .env


