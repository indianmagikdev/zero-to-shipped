# 0→Shipped Resume Parser

The repository contains a React/Vite frontend in `frontend/` and an Express/MongoDB API in `backend/`.
The API accepts a PDF resume and a job description, extracts text from the PDF, and asks Labd AI
for a match score and matched/missing skills. The Labd API key is used by the backend only.

The backend is organized into `routes/`, `controller/`, `service/`, `config/`, and `middleware/`.
`backend/server.js` configures and starts the API, and `backend/utils.js` contains shared helpers.

## Requirements

- Node.js 18+
- MongoDB running locally or a MongoDB connection URI
- A valid Labd AI API key with available allowance

## Run locally

1. Install frontend dependencies: `npm install --prefix frontend`
2. Install backend dependencies: `npm install --prefix backend`
3. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` and `LABD_API_KEY`.
4. In one terminal, run `npm run dev --prefix backend`.
5. In another terminal, run `npm run dev --prefix frontend`.
6. Open the Vite URL shown in the frontend terminal (usually `http://localhost:5173`).

Vite proxies `/api` requests to the API on port 5000. The backend exposes `GET /api/health` and
`POST /api/analyses` (multipart fields: `resume` and `jobDescription`).

The PDF is validated and stored in MongoDB as binary data (up to 5 MB per upload), alongside
its filename and size, the supplied job description, score, matched/missing skills, processing
status, and timestamps. Text is extracted from text-based PDFs only; scanned image PDFs are not
supported.

## Deploy to Vercel

The root `vercel.json` defines two services: `backend` (Express, with `backend/app.js` as its
serverless entrypoint) and `frontend` (Vite). Requests to `/api/*` are routed to the backend;
all other paths are routed to the frontend. Set `MONGODB_URI` in the Vercel project's environment
variables for each deployment environment, and set `LABD_API_KEY` for server-side scoring. The
frontend uses the public same-origin `/api` route,
so no service binding is needed.

For local development, Vite's `/api` proxy targets `http://localhost:5000`. The backend's
`server.js` connects to MongoDB before opening its local port; the Vercel Express entrypoint
connects on demand when a comparison submission is received.
