# Task Management App – React Frontend

This project is a Trello-inspired task management application built using **React.js**. It allows users to manage tasks across multiple columns with drag-and-drop functionality, and includes full authentication (including Google OAuth).

---

> **React Version:** 19.x  
> **TypeScript Version:** 4.9.x

## Features

### Core Functionality

- Build UI based on provided mock designs
- Drag-and-drop task management between columns
- Create, update, and delete tasks
- Authentication required for all routes/pages
- Google Login support
- Client-side routing with protected pages
- Responsive and user-friendly interface

---

## Libraries & Tools

| Tool/Library            | Purpose                                |
|-------------------------|----------------------------------------|
| `React`                 | Core library                           |
| `React Router DOM`      | Routing                                |
| `Redux Toolkit` | State management           |
| `axios`      | API calls                              |
| `@hello-pangea/dnd` | Drag and drop functionality  |
| `Formik` + `Yup`        | Form handling and validation           |
| `react-oauth/google` | Google login |
| `MUI` | Styling UI            |

---

## Authentication Flow

- Users must **log in or sign up** before accessing any page.
- After login, a token is stored in localStorage.
- Protected routes will redirect unauthorized users to the login page.

---

## Drag-and-Drop Functionality

- Drag tasks between columns (e.g., Todo → In Progress → Done)
- Use state update or API call to persist the task's new position
- Dragging should feel smooth and intuitive

## Setup Instructions

```bash
# Install dependencies
npm install

# Run development server
npm start

# Create environment file
cp .env.example .env