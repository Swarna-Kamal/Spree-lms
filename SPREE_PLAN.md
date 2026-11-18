# SPREE LMS — Project Plan & Architecture

## Environment
| Tool | Version | Location |
|------|---------|----------|
| Java (Temurin) | 21.0.13 | `C:\Program Files\Eclipse Adoptium\jdk-21.0.13.9-hotspot` |
| Node.js | 26.13.1 | `C:\Program Files\nodejs` |
| npm | 11.20.0 | `C:\Program Files\nodejs` |
| Maven | ❌ Not installed | Will use Maven Wrapper (`mvnw`) |

## Folder Structure

```
d:\Spree\
├── frontend/                    # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/                 # Axios API client + interceptors
│   │   ├── components/          # Shared UI components
│   │   │   ├── ui/              # Buttons, Inputs, Cards, Modals
│   │   │   └── layout/          # Sidebar, Navbar, Shell
│   │   ├── pages/               # Route-level page components
│   │   │   ├── auth/            # Login, Register
│   │   │   ├── admin/           # Admin dashboard pages
│   │   │   ├── teacher/         # Teacher dashboard pages
│   │   │   └── student/         # Student dashboard pages
│   │   ├── hooks/               # Custom React hooks
│   │   ├── stores/              # Zustand state management
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Helper utilities
│   │   └── routes/              # React Router config + guards
│   ├── public/
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                     # Spring Boot 3.x
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/spree/
│   │   │   │   ├── config/      # Security, JWT, Swagger, CORS
│   │   │   │   ├── controller/  # REST controllers
│   │   │   │   ├── dto/         # Request/Response DTOs
│   │   │   │   ├── entity/      # JPA entities
│   │   │   │   ├── exception/   # Global exception handler
│   │   │   │   ├── repository/  # Spring Data JPA repos
│   │   │   │   ├── security/    # JWT filter, UserDetailsService
│   │   │   │   └── service/     # Business logic
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-dev.properties
│   │   │       └── db/migration/   # Flyway SQL migrations
│   │   └── test/
│   ├── .env.example
│   ├── mvnw / mvnw.cmd
│   └── pom.xml
│
├── sql/
│   ├── supabase_schema.sql      # Complete schema (run first)
│   └── supabase_seed.sql        # Demo seed data (run second)
│
├── DEVELOPMENT_STATUS.md
└── README.md
```

## Architecture

```
Browser ──► React SPA (Vercel)
              │  Axios + JWT Bearer
              ▼
         Spring Boot REST API (Render)
              │  Spring Security + JWT
              │  Spring Data JPA
              ▼
         Supabase PostgreSQL
```

## Required Environment Variables

### Backend (`backend/.env.example`)
```
DB_URL=jdbc:postgresql://<host>:<port>/<db>?sslmode=require
DB_USERNAME=postgres
DB_PASSWORD=your_supabase_password
JWT_SECRET=your_very_long_random_base64_secret_minimum_256_bits
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-app.vercel.app
```

### Frontend (`frontend/.env.example`)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## SQL Execution Order
1. Run `supabase_schema.sql` → creates all tables, indexes, constraints
2. Run `supabase_seed.sql` → inserts demo admin/teacher/student data

## Flyway Migrations (synchronized with SQL)
| File | Description |
|------|-------------|
| `V1__create_roles.sql` | roles table |
| `V2__create_users.sql` | users table with FK to roles |
| `V3__create_departments.sql` | departments |
| `V4__create_courses.sql` | courses |
| `V5__create_enrollments.sql` | enrollments |
| `V6__create_lessons.sql` | lessons |
| `V7__create_assignments.sql` | assignments + submissions + grades |
| `V8__create_quizzes.sql` | quizzes + questions + attempts |
| `V9__create_announcements.sql` | announcements |
| `V10__seed_data.sql` | roles + admin user seed |
