# RestaurantOS X v0.2 Alpha

A production-ready Next.js 15 SaaS foundation for luxury restaurant websites, menu operations, media workflows, theme control, SEO, and role-gated administration.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- React Three Fiber, Three.js, Drei
- Framer Motion, GSAP-ready animation utilities, Lenis scrolling
- Zustand, React Hook Form, Zod
- Supabase auth, typed database access, row-level security policies
- Cloudinary-ready gallery uploads and media metadata persistence

## Setup

```bash
npm install
npm run dev
```

Optional environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

## Supabase

Apply the v0.2 schema and RLS policies from `supabase/migrations/202607240001_restaurantos_v02.sql`. The migration creates tenant-aware tables for restaurants, profiles, menu categories, menu items, media assets, theme settings, SEO settings, builder pages, and builder versions.

## Routes

- `/` luxury marketing experience with reusable sections and lazy-loaded cinematic 3D taco hero.
- `/menu` cinematic menu page reached after the GSAP ingredient fly-through transition.
- `/admin/login` Supabase-backed login scaffold.
- `/admin/dashboard` responsive operator dashboard with placeholder metrics.
- `/admin/menu` Menu CMS with categories and menu item CRUD services.
- `/admin/media` Media Library with Cloudinary-ready gallery upload.
- `/admin/settings` Theme, SEO, and role-based access controls.
- `/admin/builder` Webflow-style visual page builder with drag-and-drop, live preview, undo/redo, autosave, and version history.

## Architecture

The codebase is organized into `app`, `components`, `features`, `hooks`, `lib`, `providers`, `store`, `types`, `styles`, `public`, and `supabase`. UI primitives use `class-variance-authority` variants and shared utilities to keep the platform reusable for future restaurant tenants.
