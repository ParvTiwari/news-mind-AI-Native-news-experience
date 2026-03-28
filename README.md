# NewsMind AI

NewsMind AI is an AI-native business news platform with personalized feed, AI-generated insights, and chat Q&A.

## Architecture

`User -> React Frontend -> Express Backend -> (News API + LLM/Groq) -> Firebase`

## Project Structure

- `frontend/NewsMind AI`: React + Vite UI
- `backend`: Express API + personalization + profile APIs
- `llm`: reusable prompt templates and AI service

## Environment Variables

### Backend (`backend/.env`)
Use `backend/.env.example`:

- `NEWS_API_KEY`
- `GROQ_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `ALLOWED_ORIGINS`

### Frontend (`frontend/NewsMind AI/.env`)
Use `frontend/NewsMind AI/.env.example`:

- `VITE_API_BASE_URL`
- Firebase web config values (`VITE_FIREBASE_*`)

## Install

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd "frontend/NewsMind AI"
npm install
```

### LLM module
```bash
cd llm
npm install
```

## Run

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd "frontend/NewsMind AI"
npm start
```

## API Endpoints

### GET `/api/getNews?interests=tech,ai`
Returns personalized and AI-enriched articles.

### POST `/api/askNews`
Request body:
```json
{
  "question": "What is happening in global markets?",
  "userId": "user_123"
}
```

### Sample `/api/getNews` response (truncated)
```json
{
  "userId": "user_123",
  "returnedArticles": 20,
  "articles": [
    {
      "title": "...",
      "summary": "...",
      "whyItMatters": "..."
    }
  ]
}
```

### Sample `/api/askNews` response
```json
{
  "answer": "- ...\n- ...\n- What to watch next: ...",
  "usedArticles": [
    { "id": "...", "title": "...", "source": "..." }
  ]
}
```

## Performance Improvements Implemented

- In-memory TTL cache for news responses and per-article AI outputs.
- Deduplication of duplicate headline/source combinations.
- Parallel AI enrichment using `Promise.all`.
- Debounced feed search on the dashboard to reduce render churn.
- Lightweight request rate limiting and secure response headers.

