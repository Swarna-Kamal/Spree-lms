# SPREE LMS
### Learn. Teach. Grow.

A professional, full-stack Learning Management System built with React, Spring Boot, and PostgreSQL (Supabase).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Java 21, Spring Boot 3.x, Spring Security |
| Database | Supabase PostgreSQL (Flyway migrations) |
| Auth | JWT (stateless) |
| API Docs | Swagger / OpenAPI 3 |
| Deployment | Vercel (frontend), Render (backend), Supabase (DB) |

## Quick Start

### Prerequisites
- Java 21
- Node.js 18+
- Supabase project (free tier works)

### 1. Database Setup
1. Go to your Supabase project → SQL Editor
2. Run `sql/supabase_schema.sql`
3. Run `sql/supabase_seed.sql`

### 2. Backend Setup
```bash
cd backend
copy .env.example .env
# Edit .env with your Supabase credentials and JWT secret
.\mvnw.cmd spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend
copy .env.example .env
# Edit .env with your backend URL
npm install
npm run dev
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@spree.edu | Spree@123 |
| Teacher | teacher1@spree.edu | Spree@123 |
| Student | student1@spree.edu | Spree@123 |

## API Documentation
Once the backend is running, visit: `http://localhost:8080/swagger-ui.html`

## Project Structure
See [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) for current status.

## Deployment

### Frontend (Vercel)
- Connect your GitHub repo
- Set `VITE_API_BASE_URL` to your Render backend URL

### Backend (Render)
- New Web Service → connect GitHub repo → `backend/` directory
- Build: `./mvnw package -DskipTests`
- Start: `java -jar target/backend-*.jar`
- Add all env vars from `.env.example`

### Database (Supabase)
- Create a new project
- Run the SQL scripts
- Copy the connection string to backend `.env`
