# Frontend (React + Vite)

Minimal To-do UI that calls the Django REST API at `/api/todos/`. See the
repository root [README.md](../README.md) for how to run the full stack
with Docker Compose.

## Local development (without Docker)

```bash
npm install
npm run dev      # http://localhost:5173, expects the API at VITE_API_BASE_URL
npm run build    # production build -> dist/ (this is what the Dockerfile builds)
```
