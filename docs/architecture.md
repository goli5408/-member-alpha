# Soul Seated — System Architecture

## Overview

Soul Seated is a dual-portal web application built on Next.js 16 (App Router) + Supabase. It serves two distinct user types through separate UI surfaces: a **mobile-first Member App** and a **desktop Staff Portal**, unified by a single authentication and database layer.

---

## System Architecture Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER (Client)                               │
│                                                                             │
│   ┌─────────────────────────┐       ┌────────────────────────────────────┐ │
│   │     Member App          │       │         Staff Portal               │ │
│   │  (max-width: 430px)     │       │     (full-width, desktop)          │ │
│   │                         │       │                                    │ │
│   │  TopBar + BottomNav      │       │  Sidebar + StaffShell              │ │
│   │  /home                  │       │  /staff/dashboard                  │ │
│   │  /program/[week]        │       │  /staff/members                    │ │
│   │  /practice              │       │  /staff/pods             (PM)      │ │
│   │  /guide, /pod           │       │  /staff/content      (CM + PM)     │ │
│   │  /library/[id]          │       │  /staff/program          (PM)      │ │
│   │  /progress              │       │  /staff/settings         (PM)      │ │
│   │  /schedule              │       │  /staff/support          (SA)      │ │
│   │  /profile, /settings    │       │                                    │ │
│   │  /support               │       │  Roles: Guide | PM | CM | SA       │ │
│   └─────────────────────────┘       └────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────-─┘
                                        │
                             ┌──────────▼──────────┐
                             │     proxy.ts         │
                             │   (Middleware)       │
                             │                     │
                             │  1. Check session   │
                             │  2. Identify role   │
                             │     (profiles vs    │
                             │     staff_profiles) │
                             │  3. Route or block  │
                             └──────────┬──────────┘
                                        │
                ┌───────────────────────┼───────────────────────┐
                │                       │                       │
     ┌──────────▼──────────┐  ┌─────────▼─────────┐  ┌────────▼────────┐
     │    (auth) Routes    │  │   (app) Routes    │  │  (staff) Routes │
     │                     │  │  Server Components│  │ Server Compon.  │
     │  /login             │  │                   │  │                 │
     │  /signup            │  │  getProfile()     │  │  getStaff()     │
     │  /auth/confirm      │  │  revalidatePath() │  │  Role-gating    │
     └──────────┬──────────┘  └─────────┬─────────┘  └────────┬────────┘
                │                       │                       │
                └───────────────────────┼───────────────────────┘
                                        │
                         ┌──────────────▼──────────────┐
                         │       Server Actions         │
                         │   (src/app/actions/)         │
                         │                              │
                         │  auth.ts                     │
                         │    login() / signup()        │
                         │    logout()                  │
                         │    resolveHomeRoute()        │
                         │                              │
                         │  profile.ts                  │
                         │    getProfile()              │
                         │    updateProfile()           │
                         │                              │
                         │  staff.ts  (PM only)         │
                         │    inviteStaff()             │
                         │    deactivateStaff()         │
                         └──────────────┬───────────────┘
                                        │
                ┌───────────────────────┼───────────────────────┐
                │                       │                       │
     ┌──────────▼──────────┐  ┌─────────▼─────────┐  ┌────────▼────────┐
     │  Supabase Client    │  │  Supabase Server  │  │  Supabase Admin │
     │  (client.ts)        │  │  (server.ts)      │  │  (admin.ts)     │
     │                     │  │                   │  │                 │
     │  Browser only       │  │  SSR + Server     │  │  Service role   │
     │  Anon key           │  │  Actions          │  │  Bypasses RLS   │
     │  RLS enforced       │  │  Cookie session   │  │  Server only    │
     │                     │  │  RLS enforced     │  │  inviteStaff()  │
     └──────────┬──────────┘  └─────────┬─────────┘  └────────┬────────┘
                └───────────────────────┼───────────────────────┘
                                        │
                         ┌──────────────▼──────────────┐
                         │         SUPABASE             │
                         │                              │
                         │  ┌────────────────────────┐  │
                         │  │      Auth              │  │
                         │  │  Email + Password      │  │
                         │  │  Magic Link Invites    │  │
                         │  │  Trigger on signup     │  │
                         │  └───────────┬────────────┘  │
                         │              │               │
                         │  ┌───────────▼────────────┐  │
                         │  │  handle_new_user()     │  │
                         │  │  (DB Trigger)          │  │
                         │  │                        │  │
                         │  │  user_type=staff    ─► staff_profiles │
                         │  │  peer_ambassador    ─► profiles (PA)  │
                         │  │  default            ─► profiles       │
                         │  └───────────┬────────────┘  │
                         │              │               │
                         │  ┌───────────▼────────────┐  │
                         │  │      Database          │  │
                         │  │                        │  │
                         │  │  profiles              │  │
                         │  │    id, display_name    │  │
                         │  │    bio, pronouns       │  │
                         │  │    hometown, vibe_*    │  │
                         │  │    avatar_url, role    │  │
                         │  │    (member | PA)       │  │
                         │  │                        │  │
                         │  │  staff_profiles        │  │
                         │  │    id, display_name    │  │
                         │  │    role (guide|PM|     │  │
                         │  │      CM|SA)            │  │
                         │  │    bio, avatar_url     │  │
                         │  │    timezone, is_active │  │
                         │  │    invited_by          │  │
                         │  └───────────┬────────────┘  │
                         │              │               │
                         │  ┌───────────▼────────────┐  │
                         │  │  Row-Level Security    │  │
                         │  │                        │  │
                         │  │  profiles:             │  │
                         │  │    own row only        │  │
                         │  │                        │  │
                         │  │  staff_profiles:       │  │
                         │  │    own row (all staff) │  │
                         │  │    all rows (PM + SA)  │  │
                         │  │    update all (PM)     │  │
                         │  └────────────────────────┘  │
                         │                              │
                         │  ┌────────────────────────┐  │
                         │  │  Storage               │  │
                         │  │  /avatars bucket       │  │
                         │  └────────────────────────┘  │
                         └──────────────────────────────┘
```

---

## Authentication & Routing Flow

```
                  User visits site
                        │
                        ▼
               proxy.ts middleware
                        │
           ┌────────────┴────────────┐
           │                         │
     No session                  Has session
           │                         │
           ▼                         ▼
  Is route protected?     Check profile type
           │                         │
     ┌─────┴─────┐          ┌────────┴────────┐
     │           │          │                 │
    Yes          No      profiles       staff_profiles
     │           │       (member)          (staff)
     ▼           ▼          │                 │
  /login      Allow         ▼                 ▼
                         /home        /staff/dashboard
```

---

## Staff Invitation Flow

```
Program Manager
      │
      ▼
inviteStaff(formData)          ← server action (PM-only)
      │
      ▼
Admin Client (service role)    ← bypasses RLS
      │
      ▼
supabase.auth.admin.inviteUserByEmail()
      │  metadata: { user_type, staff_role, display_name, invited_by }
      ▼
Email sent to invitee
      │
      ▼
Invitee clicks link → /auth/confirm
      │
      ▼
handle_new_user() trigger fires
      │  reads user_type from metadata
      ▼
Row inserted into staff_profiles
      │
      ▼
Redirected to /staff/dashboard
```

---

## Component Tree

```
RootLayout  (src/app/layout.tsx)
│   fonts, global CSS
│
├── (auth)Layout  ─────────────────────── Clean, centered
│   ├── /login/page.tsx
│   └── /signup/page.tsx
│
├── (app)Layout  ──────────────────────── Mobile phone-frame
│   │   Server Component
│   │   getProfile() → hydrates TopBar
│   │
│   ├── TopBar (fixed, 52px)
│   │   └── Slide-out drawer (profile, settings, logout)
│   │
│   ├── <main> (scrollable, padded for top+bottom bars)
│   │   ├── /home/page.tsx
│   │   ├── /program/[week]/page.tsx
│   │   ├── /practice/page.tsx
│   │   ├── /guide/page.tsx
│   │   ├── /pod/page.tsx
│   │   ├── /library/[id]/page.tsx
│   │   ├── /progress/page.tsx
│   │   ├── /schedule/page.tsx
│   │   ├── /profile/page.tsx
│   │   ├── /settings/page.tsx
│   │   └── /support/page.tsx
│   │
│   └── BottomNav (fixed, 68px)
│
└── (staff)Layout  ────────────────────── Full-width desktop
    │
    └── StaffShell
        ├── Sidebar (240px, sticky)
        │   ├── Brand header
        │   ├── Nav items (filtered by role)
        │   └── User footer (name, role badge, logout)
        │
        └── Main
            ├── Top bar (page title)
            └── /staff/*/page.tsx
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router) |
| UI | React 19.2.4 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password + magic links) |
| SSR Auth | @supabase/ssr (cookie-based sessions) |
| Language | TypeScript 5 |
| Linting | ESLint 9 |

---

## Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Public anon key (RLS enforced) |
| `NEXT_PUBLIC_SITE_URL` | Server | Base URL for invite redirects |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin operations (bypasses RLS) |

---

## Database Migrations

```
supabase/migrations/
├── 001_profiles.sql     — profiles table, RLS, handle_new_user() trigger
└── 002_roles.sql        — staff_profiles table, role-based RLS policies
```
