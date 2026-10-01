# Build Future Tourism Phase 3 Backend

Phase 3 backend uses **Express + TypeScript + MySQL (mysql2)**. Prisma has been completely removed.

## Setup

1. Create MySQL database/user or use the `root` account.
2. Copy `server/.env.example` to `server/.env` and set the MySQL password and JWT secrets.
3. From `server` run `npm install`.
4. Run `npm run db:seed`. This automatically creates the required tables and demo data.
5. Run `npm run dev`.

Backend: http://localhost:5000
Swagger: http://localhost:5000/api/docs

The backend accepts localhost frontend ports dynamically during development, so Vite can use 5173, 5174, 5175, etc.





Change these before production.

## Phase 3 features
- Registration/login with JWT access + refresh tokens
- MySQL persistence without Prisma
- Admin authorization
- Destinations and categories
- Internships and applications
- Local CV uploads in `server/uploads/cvs`
- Paid internship registration fee and payment verification records
- Training registration
- Notifications
- Feedback/comments moderation
- Contact messages
- Admin dashboard APIs
