# AI Resume Builder

## Frontend setup

### Option 1: Run as static site with a dev server

1. Open a terminal and move into frontend:

```powershell
cd frontend
```

2. Install frontend dev dependency:

```powershell
npm install
```

3. Start local static server:

```powershell
npm run dev
```

Frontend will run at http://127.0.0.1:3000.

### Option 2: Serve frontend from Express

You can move the frontend files under backend/public and add:

```js
app.use(express.static("public"));
```

Then the backend serves both API and static assets from one host.

## Backend setup

1. Open a terminal in backend:

```powershell
cd backend
```

2. Install dependencies:

```powershell
npm install
```

3. Create env file from template:

```powershell
Copy-Item .env.example .env
```

4. Edit .env values:

```env
MONGODB_URI=your-mongo-uri
JWT_SECRET=your-strong-secret
PORT=5000
CORS_ORIGIN=http://127.0.0.1:3000
```

5. Start backend:

```powershell
npm run dev
```

Health endpoint: http://localhost:5000/api/health

## Environment variables

- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Token signing secret
- PORT: HTTP port for Express backend
- CORS_ORIGIN: Comma-separated list of allowed frontend origins

## Build and deploy

### Backend deployment (Render / Heroku / Vercel serverless)

- Build command: npm install
- Start command: npm start
- Runtime: Node.js
- Set env vars: MONGODB_URI, JWT_SECRET, PORT, CORS_ORIGIN

For Vercel serverless, adapt Express handler to serverless entrypoint and set CORS_ORIGIN to your deployed frontend URL.

### Frontend deployment (Netlify / Vercel static)

- Publish directory: frontend
- No build command required for plain static files

Set API_BASE in one of these ways:

- Preferred: define window.API_BASE in a small inline script before app scripts
- Alternative: run once in browser console:

```js
localStorage.setItem("API_BASE", "https://your-backend-domain/api")
```

## CORS and API_BASE checklist

1. Backend CORS_ORIGIN must include your frontend domain.
2. Frontend API_BASE must point to backend /api base URL.
3. Confirm /api/health works from deployed frontend domain.
