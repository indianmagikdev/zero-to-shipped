# 0→Shipped Resume Parser

The repository contains a React/Vite frontend in `frontend/` and an Express/MongoDB API in `backend/`.
The API accepts a PDF resume and a job description and saves a queued submission. AI scoring and
skill matching are not implemented yet.

The backend is organized into `routes/`, `controller/`, `service/`, `config/`, and `middleware/`.
`backend/server.js` configures and starts the API, and `backend/utils.js` contains shared helpers.

## Requirements

- Node.js 18+
- MongoDB running locally or a MongoDB connection URI

## Run locally

1. Install frontend dependencies: `npm install --prefix frontend`
2. Install backend dependencies: `npm install --prefix backend`
3. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`.
4. In one terminal, run `npm run dev --prefix backend`.
5. In another terminal, run `npm run dev --prefix frontend`.
6. Open the Vite URL shown in the frontend terminal (usually `http://localhost:5173`).

Vite proxies `/api` requests to the API on port 5000. The backend exposes `GET /api/health` and
`POST /api/analyses` (multipart fields: `resume` and `jobDescription`).

The PDF is validated and stored in MongoDB as binary data (up to 5 MB per upload), alongside
its filename and size, the supplied job description, the queued status, and timestamps.
