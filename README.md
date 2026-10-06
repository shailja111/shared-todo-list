# Shared To-Do List

Minimal full-stack implementation for the interview assignment.

## Stack
- Frontend: Vue 3 + Vite + TypeScript + Pinia
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Authentication: Firebase
- Containers: Docker + Docker Compose

## Local development

1. Copy `.env.example` to `.env` and add Firebase Admin credentials.
2. Copy `frontend/.env.example` to `frontend/.env` and add Firebase web credentials.
3. Start PostgreSQL:
   `docker compose up -d postgres`
4. In one terminal:
   `cd backend && npm install && npm run dev`
5. In another terminal:
   `cd frontend && npm install && npm run dev`

## Docker

`docker compose up --build`

## Database schema
See `database/schema.dbml`.
