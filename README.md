# Kanban Project Management System
by joanna

## Project Structure

- **client**: React frontend application
- **server**: Strapi backend for data management

## Features

- Project listing in the sidebar
- Kanban board view with columns for different task statuses
- Dedicated Backlog view 
- Task creation functionality
- Modern, clean UI

## Technology Stack

### Frontend

- React for UI components
- TanStack Router for routing
- TanStack Query for data fetching and state management
- Modern CSS for styling

### Backend

- Strapi
- PostgreSQL database
- RESTful API

## Data Structure

- **Projects**: Collection of related tasks
- **Tasks**: Individual work items with title, description, and status
- **Statuses**: Task states (Backlog, Todo, In Progress, In Review, Done)

## Running Locally

### Backend (Server)

```bash
cd server
npm install
npm run develop
```

The Strapi admin panel will be available at http://localhost:1337/admin

### Frontend (Client)

```bash
cd client
npm install
npm run dev
```

The frontend application will be available at http://localhost:5173

## Deployment

- Frontend: Netlify => https://infrastructuur.netlify.app
- Backend API: Render => https://jammin-playground.onrender.com


