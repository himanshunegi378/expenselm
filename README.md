# ExpenseLM

A full-stack expense management application with a React frontend and Express backend.

## Project Structure

```
expenselm/
├── frontend/         # React + TypeScript + Vite frontend
├── backend/          # Express + TypeScript backend
```

## Frontend

The frontend is built with:
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Query for data fetching
- Redux Toolkit for state management
- Redux Logger for logging state changes

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

The backend is built with:
- Express.js
- TypeScript
- Morgan for logging
- CORS for cross-origin resource sharing

### Running the Backend

```bash
cd backend
npm install
npm run dev
```

## Development

For development, run both the frontend and backend concurrently:

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In another terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```
