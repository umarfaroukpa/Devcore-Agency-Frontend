# Devocore Agency Frontend

A Next.js App Router frontend for an agency workflow: role-based dashboards, project/task management, contact inquiries, approvals, invites, reports, and profile/auth flows. Integrates with a backend API via Axios with JWT, uses Zustand for persisted auth state, Tailwind CSS v4 for styling, and utilities for CSV/XLSX/PDF export and charts.

**Highlights**
- Role-based dashboards: Admin, Developer, Client
- Contact inbox with detailed views
- Projects and tasks with nested routes
- User invites, approvals, and settings
- Auth with JWT, persisted state, guarded routes
- Data export (XLSX/PDF) and charts for reporting
- Tailwind v4, Lucide icons, Recharts

**Tech Stack**
- Next.js 16 (App Router) and React 19
- TypeScript 5
- Tailwind CSS 4 via PostCSS
- Axios, Zustand (persist), Recharts, XLSX, jsPDF
- ESLint 9 with Next core-web-vitals/typescript configs

---

**Getting Started**
- Prerequisites: 
  - Node 20+ and a package manager (npm, yarn, pnpm, bun)
  - Backend API available at `NEXT_PUBLIC_API_URL`
- Install:
  - `npm install`
- Dev server:
  - `npm run dev`
- Build:
  - `npm run build`
- Start (production):
  - `npm run start`

Open http://localhost:3000 after `dev` or `start`.

---

**Environment Variables**
- `NEXT_PUBLIC_API_URL`: Base URL for the backend API (client-side).
  - Defaults to `http://localhost:5000/api` if not set.
- Where used: api.ts

Create `.env.local` and add:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

**Scripts**
- `dev`: Runs the Next dev server.
- `build`: Builds the production bundle.
- `start`: Starts the production server.
- `lint`: Runs ESLint.
- `deploy:prod`: Placeholder deployment script.

---

**Project Structure**
- App Router pages and nested routes live under app
- Shared components under component
- Client utilities under lib
- Public assets under public

Key files and folders:
- layout.tsx: Root layout with `Header`, `Footer`, and `ErrorBoundary`.
- globals.css: Global styles (Tailwind v4).
- api.ts: Axios instance with token interceptors.
- auth-utils.ts: Auth helpers, role checks, dashboard routing.
- store.ts: Zustand persisted auth store.
- eslint.config.mjs: ESLint configuration (Next presets).
- postcss.config.mjs: Tailwind via PostCSS plugin.

---

**Routing Overview**
Public routes:
- page.tsx: Homepage
- page.tsx: About
- page.tsx: Blog
- page.tsx: Services
- page.tsx: Contact
- page.tsx: Login
- page.tsx: Signup
- page.tsx: Forgot Password
- [src/app/reset-password/[token]/page.tsx](src/app/reset-password/%5Btoken%5D/page.tsx): Reset Password
- page.tsx, page.tsx, page.tsx, page.tsx, page.tsx

Dashboard root:
- page.tsx: Role-aware entry

Admin dashboard:
- page.tsx
- Activity: page.tsx
- Approvals: page.tsx
- Contact inbox: page.tsx
- Invite codes: page.tsx
- Projects:
  - List: page.tsx
  - Detail: [src/app/dashboard/admin/projects/[id]/page.tsx](src/app/dashboard/admin/projects/%5Bid%5D/page.tsx)
  - Edit: [src/app/dashboard/admin/projects/[id]/[edit]/page.tsx](src/app/dashboard/admin/projects/%5Bid%5D/%5Bedit%5D/page.tsx)
- Reports: page.tsx
- Settings: page.tsx
- Tasks:
  - List: page.tsx
  - Detail: [src/app/dashboard/admin/tasks/[id]/page.tsx](src/app/dashboard/admin/tasks/%5Bid%5D/page.tsx)
- Users:
  - List: page.tsx
  - Detail: [src/app/dashboard/admin/users/[id]/page.tsx](src/app/dashboard/admin/users/%5Bid%5D/page.tsx)
  - Edit: [src/app/dashboard/admin/users/[id]/edit/page.tsx](src/app/dashboard/admin/users/%5Bid%5D/edit/page.tsx)
  - Invite: page.tsx

Client dashboard:
- page.tsx
- Projects:
  - New: page.tsx
  - Detail: [src/app/dashboard/clients/projects/[id]/page.tsx](src/app/dashboard/clients/projects/%5Bid%5D/page.tsx)

Developer dashboard:
- page.tsx
- Tasks:
  - Detail: [src/app/dashboard/developer/tasks/[id]/page.tsx](src/app/dashboard/developer/tasks/%5Bid%5D/page.tsx)

Other:
- Project use case: [src/app/projects/use-case/[id]/page.tsx](src/app/projects/use-case/%5Bid%5D/page.tsx)
- Pending approval: page.tsx
- Profile: page.tsx
- Contact detail: [src/app/contact/[id]/page.tsx](src/app/contact/%5Bid%5D/page.tsx)

---

**Authentication & Authorization**
- Roles: `SUPER_ADMIN`, `ADMIN`, `DEVELOPER`, `CLIENT`
- Helpers: 
  - `isAuthenticated()`, `isSuperAdmin()`, `isAdmin()`, `isDeveloper()`, `isClient()`
  - `hasPermission(permission)`: checks booleans on `User`
  - `getDashboardRoute(role?)`: route based on role
  - `logout()`: clears local storage and redirects to `/login`
- Source: auth-utils.ts

State:
- Persisted via Zustand to `localStorage` (`auth-storage`)
- Store: `useAuthStore` with `setAuth(user, token)` and `logout()`
- Source: store.ts

---

**API Layer**
- Axios instance with base URL from `NEXT_PUBLIC_API_URL`
- Token management:
  - Restored from `localStorage` on load
  - Request interceptor attaches `Authorization` unless public routes:
    - `/auth/login`, `/auth/signup`, `/auth/verify-invite`, `/auth/forgot-password`
  - Response interceptor handles `401`: clears auth and redirects to `/login`
- Utility functions:
  - `setAuthToken(token)`, `getAuthToken()`, `clearAuth()`
- Source: api.ts

---

**Styling & UI**
- Tailwind CSS v4 via PostCSS plugin: postcss.config.mjs
- Global styles: globals.css
- Icons: Lucide React
- Charts: Recharts
- Layout includes src/component/Header and src/component/Footer, wrapped by an error boundary in layout.tsx

---

**Data Export & Reporting**
- XLSX/CSV: `xlsx`
- PDF: `jspdf` + `jspdf-autotable`
- Typical usage inside admin reports and list pages for exporting datasets.

---

**Linting & Formatting**
- ESLint with Next configs:
  - eslint.config.mjs
- Run:
  - `npm run lint`

---

**Deployment**
- Production build:
  - `npm run build`
  - `npm run start`
- `deploy:prod` is a placeholder. Integrate with your CI/CD (e.g., Vercel, Docker, or custom server) as needed.
- Ensure `NEXT_PUBLIC_API_URL` points to your production API.

---

**Protected Routes**
- Many dashboard routes require auth and correct role.
- If a `401` occurs, the app clears credentials and navigates to `/login`.
- If stuck in a loop:
  - Clear `localStorage` or use `logout()`.
  - Confirm `token` and `user` are stored correctly.

---

**Troubleshooting**
- Token not attached to requests:
  - Check `localStorage` for `token`
  - Confirm `NEXT_PUBLIC_API_URL` is set and reachable
- Unexpected `401`:
  - Backend token expiry; re-login
  - Ensure the route isn’t in the public list incorrectly
- TypeScript role/type mismatches:
  - Align data models with `User` and domain types
- Tailwind styles not applying:
  - Verify Tailwind v4 setup and class usage in components

---

**Contributing**
- Create a topic branch
- Keep changes focused and small
- Run `npm run lint` before committing
- Open a PR with a clear description and testing notes

---

**License**
- No explicit license is set. Add one if you plan to distribute.

---

**Notes**
- This project uses Next.js App Router and React Server Components conventions.
- For custom guarded routing in the app directory, see existing components in protectedRoutes.tsx if present and the usage of auth helpers under lib.