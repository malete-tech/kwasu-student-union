# KWASU Students' Union Platform - Developer Documentation

Welcome to the official developer documentation for the Kwara State University Students' Union (KWASU SU) platform. This application is a comprehensive portal for student news, events, executive profiles, and essential services.

## 🚀 Tech Stack

- **Frontend:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Routing:** React Router DOM v6
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage)
- **Icons:** Lucide React
- **State Management:** React Hooks + TanStack Query (for caching/fetching)
- **Media Handling:** Cloudinary (via Supabase Edge Functions)

## 📁 Project Structure

```text
src/
├── app/                # Layout components (Public & Admin)
├── components/         # Reusable UI components
│   ├── admin/          # Admin-specific UI components
│   └── ui/             # shadcn/ui base components
├── data/               # Local JSON fallbacks (legacy/mocking)
├── hooks/              # Custom React hooks (use-mobile, use-toast, etc.)
├── integrations/       # External service clients
│   └── supabase/       # Supabase client and storage utilities
├── lib/                # Core logic and API wrappers
│   └── api/            # Modular API functions (news, events, etc.)
├── pages/              # Application views/routes
│   └── admin/          # Protected administrative pages
├── types/              # TypeScript interfaces and types
└── utils/              # Helper functions (auth, cloudinary, toast)

supabase/
└── functions/          # Deno-based Edge Functions (Cloudinary bridge)
```

## 🛠️ Core Modules

### 1. Authentication
The app uses Supabase Auth. The `SessionContextProvider` wraps the application to provide real-time auth state.
- **Admin Access:** Restricted to users with the `admin` role (managed via the `profiles` table).
- **Login:** Located at `/admin/login`.

### 2. API Layer (`src/lib/api/`)
The API is modularized by feature. Each module handles communication with Supabase tables:
- `news.ts`: CRUD for student announcements.
- `events.ts`: Management of the campus calendar.
- `executives.ts`: Profiles for Central, Senate, and Judiciary councils.
- `complaints.ts`: Secure submission and tracking of student grievances.
- `announcements.ts`: Site-wide global notices (modals).

### 3. Media Management
- **Standard Files:** Documents and executive photos are stored in Supabase Storage buckets.
- **News Images:** To optimize delivery, news cover images are uploaded to **Cloudinary** via a custom Supabase Edge Function (`upload-news-image`). This ensures secure API key handling on the server side.

## 🗄️ Database Schema

Key tables in the PostgreSQL database:
- `news`: `id, title, slug, excerpt, body_md, tags, published_at, cover_url`
- `events`: `id, title, slug, starts_at, ends_at, venue, description_md, category, rsvp_open`
- `executives`: `id, name, role, council_type, display_order, photo_url, projects_md`
- `complaints`: `id, user_id, category, title, description, status, is_anonymous`
- `complaint_timeline`: Tracks status changes for grievances.
- `global_announcements`: Site-wide notices with `type` (urgent, celebration, info).

## 🎨 Styling & Branding
Custom brand colors are defined in `tailwind.config.ts` under the `brand` key:
- `brand-500`: Primary KWASU Green.
- `brand-700`: Deep Green.
- `brand-gold`: Accent color for buttons and highlights.
- **Typography:** Uses `Rubik` for body text and `Google Sans Flex` for headings.

## ⚙️ Environment Variables
Required variables for local development:
- `VITE_SUPABASE_URL`: Your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous API key.

## 🚀 Deployment
The frontend is optimized for deployment on platforms like Vercel or Netlify. Ensure that the `_redirects` file in the `public` folder is included to support React Router's SPA routing.