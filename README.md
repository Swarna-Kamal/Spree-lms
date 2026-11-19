# SPREE LMS — Modern Learning Management System
> **Learn. Teach. Grow.** A modern, responsive, full-stack Learning Management System designed with AstroWind aesthetics, role-based dashboards, document uploads, assignment grading, and academic curriculum management.

[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TailwindCSS-blue.svg)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203%20%7C%20Java%2021-emerald.svg)](https://spring.io/projects/spring-boot)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E.svg)](https://supabase.com/)
[![Security](https://img.shields.io/badge/Auth-JWT%20%7C%20RBAC-orange.svg)](https://jwt.io/)

---

## 🌟 Key Features

### 🎨 Modern AstroWind Design System
- **Full-Width Layout**: Adaptive wide screen views (`px-4 sm:px-6 lg:px-10 xl:px-14`) with no cramped boxed margins.
- **Role-Aware Top Navbar**: Seamless navigation for Public visitors, Admins, Teachers, and Students with light/dark theme switching.
- **Accessible Typography & Contrast**: Clear borders, bold headings, and accessible badges.

### 👥 Role-Based Portals

#### 1. Public Portal
- Modern hero landing page with live course metrics, feature highlights, FAQs, and platform statistics.
- Explore courses catalog with category filtering and instant enrollment.

#### 2. Student Portal (`/student`)
- **My Enrolled Subjects**: Real-time view of enrolled courses and syllabus progress.
- **Dedicated Course Materials & Handouts**: Access and download lecture slides, notes, PDFs, and Word documents (.pdf, .doc, .docx up to 1 MB).
- **Coursework & Submissions**: Submit answers via rich text or file uploads; track real-time scores, feedback, and submission history.
- **Announcements**: Course-specific notices and global university announcements.

#### 3. Faculty / Teacher Portal (`/teacher`)
- **Course Administration**: Curriculum management, student rosters, and manual student enrollment.
- **Materials Management**: Direct upload of course materials with titles, descriptions, and lesson mappings.
- **Dedicated Uploaded Materials & Documents**: Global view of all documents uploaded across assigned courses with download and delete controls.
- **Assignment & Grading Studio**: Create coursework with deadlines and max scores; review student submissions, download submitted attachments, and enter grades with customized feedback.
- **Announcements & Lessons**: Broadcast course announcements and publish interactive lesson contents.

#### 4. Administrator Portal (`/admin`)
- **Telemetry Overview**: Real-time database analytics (total students, faculty, courses, departments, and enrollment counts).
- **User Management**: Filter, search, create, edit, activate/deactivate accounts, and assign roles (`ADMIN`, `TEACHER`, `STUDENT`).
- **Department Management**: Balanced 12-column grid layout for creating and maintaining academic departments.
- **Course Management**: Create courses, assign teachers, toggle draft/published status, and manage student rosters.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS | Lucide Icons, Zustand Auth Store, Axios Client |
| **Backend** | Java 21, Spring Boot 3.4.1, Spring Security | RESTful APIs, JWT Authentication, Hibernate JPA |
| **Database** | PostgreSQL (Supabase) | Flyway Migrations (V1 → V13) |
| **Document Storage**| Multipart File Storage Engine | PDF, DOC, DOCX validation (1 MB limit) |
| **Deployment** | Vercel (Frontend), Render / Railway / Docker (Backend) | Single-page app routing (`vercel.json`), Multi-stage Dockerfile |

---

## 🔑 Demo & Testing Credentials

All accounts share the unified password: **`Password123!`**

| Role | Name | Email Address | Assigned Context |
| :--- | :--- | :--- | :--- |
| **Admin** | Eleanor Vance | `admin@spree.edu` | Full university administrative access |
| **Admin** | smil pang | `smil@gmail.com` | Primary system administrator |
| **Teacher** | Dr. Sarah Connor | `sarah.connor@spree.edu` | Teaches CS301 (Cloud Architecture) & SEC510 (Security) |
| **Teacher** | Prof. Alan Turing | `alan.turing@spree.edu` | Teaches AI402 (Neural Networks) & DS205 (Data Science) |
| **Student** | Alex Chen | `alex.chen@spree.edu` | Enrolled in CS301 (Graded 96.5/100) & AI402 |
| **Student** | Maya Patel | `maya.patel@spree.edu` | Enrolled in AI402 (Active Submission) & DS205 |
| **Student** | Lucas Silva | `lucas.silva@spree.edu` | Enrolled in CS301 & SEC510 |

---

## 🚀 Local Development Setup

### Prerequisites
- **Java 21+**
- **Node.js 18+** & npm
- **Supabase Account** (or local PostgreSQL 15+)

### 1. Database Setup
1. Create a Supabase project.
2. In the Supabase SQL Editor, verify that database migrations apply automatically via Spring Boot Flyway on startup (`src/main/resources/db/migration`).
3. Connection credentials are configured in `backend/.env`.

### 2. Backend Setup
```bash
cd backend

# Copy sample configuration
copy .env.example .env

# Run Spring Boot Application
.\mvnw.cmd spring-boot:run
```
*Backend runs at `http://localhost:8080`. Swagger UI is available at `http://localhost:8080/swagger-ui.html`.*

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite Dev Server
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🚢 Deployment Guide

### Option 1: Frontend Deployment on Vercel (Recommended)
1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"** → Import `Spree-lms`.
3. In the project setup:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com` (your deployed backend URL)
5. Click **Deploy**. The included `frontend/vercel.json` ensures full client-side route rewrites.

---

### Option 2: Backend Deployment on Render
1. Log into [Render](https://render.com/).
2. Click **New +** → **Web Service** → Connect your repository `Spree-lms`.
3. Choose **Docker** environment:
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker Context**: `backend`
   *(Alternatively, choose Native Java: Build Command: `./mvnw clean package -DskipTests`, Start Command: `java -jar target/*.jar`)*
4. **Environment Variables**:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<SUPABASE_HOST>:6543/postgres?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME`: `postgres.<PROJECT_REF>`
   - `SPRING_DATASOURCE_PASSWORD`: `<YOUR_SUPABASE_PASSWORD>`
   - `JWT_SECRET`: `<MINIMUM_64_CHAR_HEX_OR_BASE64_STRING>`
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`
5. Click **Create Web Service**.

---

### Option 3: Railway / Docker
A production multi-stage `Dockerfile` is provided in `backend/Dockerfile`.
```bash
# Build Docker image
docker build -t spree-backend -f backend/Dockerfile backend

# Run container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="jdbc:postgresql://..." \
  -e SPRING_DATASOURCE_USERNAME="..." \
  -e SPRING_DATASOURCE_PASSWORD="..." \
  -e JWT_SECRET="..." \
  spree-backend
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
