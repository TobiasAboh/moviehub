# MovieHub

A full-stack movie discovery and tracking application with a **Next.js/React frontend** and a **Go backend**.

## Features

The backend exposes API routes for:
- Account creation and login
- Authenticated user profile
- Popular movie/TV content and content details
- Search across media
- Liking content
- Tracking watched content
- Managing a watchlist
- Retrieving liked and watched items

## Tech stack

**Frontend**
- Next.js 15
- React 19
- Tailwind CSS
- Framer Motion

**Backend**
- Go
- Gin
- PostgreSQL driver (lib/pq)
- JWT-based authentication middleware
- Environment configuration with godotenv

## Repository structure

```text
frontend/   Next.js application
backend/    Go API, handlers, middleware, models, and database setup
```

## Run locally

### Backend

Requires Go and a PostgreSQL database configured for the application.

```bash
cd backend
go mod download
```

Create a local .env file with the environment values expected by the database initialization and authentication code. Do not commit secrets or production credentials.

Run the API:

```bash
go run .
```

The current server starts on port 8080.

### Frontend

Requires Node.js and npm.

```bash
cd frontend
npm install
npm run dev
```

The Next.js development server normally runs at http://localhost:3000.

## Notes

- The backend's current CORS configuration allows the local frontend origin http://localhost:3000.
- Configure database and authentication environment variables before running the full application.
- This project is a work in progress; verify the current source and configuration when setting it up.

## Links

- [Source code](https://github.com/TobiasAboh/moviehub)
