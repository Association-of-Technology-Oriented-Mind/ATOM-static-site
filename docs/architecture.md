# Architecture

## Overview

The ATOM Club website is the public web presence for the Association of
Technology Oriented Minds at Karunya Institute of Technology and Sciences. It
serves three audiences: visitors browsing events, clubs, coordinators and the
photo gallery; students submitting event registrations; and club admins editing
site content through a password-protected CMS. It is a single-page React
application deployed to Firebase Hosting, with Firebase providing the database,
authentication and (optionally) file storage — there is no custom backend
service.

Deployed at https://atom-2026.web.app, Firebase project `atom-2026`, Firestore
in `asia-south1`.

## Tech Stack

- **Language:** TypeScript 5.8 (`strict: true`)
- **Framework:** React 18, React Router 6, Vite 5 (SWC)
- **Styling:** Tailwind CSS 3, shadcn/ui (Radix primitives)
- **Data/state:** TanStack Query 5, Zod 3 for validation
- **Database:** Cloud Firestore
- **Auth:** Firebase Authentication (email/password + `admin` custom claim)
- **File storage:** Firebase Storage (optional — off; needs the Blaze plan)
- **Animation:** framer-motion, GSAP, OGL (WebGL)
- **Email:** EmailJS (contact form only)
- **Hosting:** Firebase Hosting
- **Testing:** Vitest, Testing Library

## Services & Responsibilities

| Module | Role |
| --- | --- |
| `src/lib/firebase.ts` | Initialises Firebase; exports `db`, `auth`, `storage`, `COLLECTIONS`. Degrades to `null` when unconfigured. |
| `src/lib/schemas.ts` | Zod schemas — the single validation boundary for user input and Firestore reads. |
| `src/utils/dataService.ts` | Firestore reads/writes for content, with bundled fallbacks. |
| `src/utils/api.ts` | Writes event registrations to Firestore. |
| `src/hooks/useContent.ts` | TanStack Query hooks wrapping the data service. |
| `src/contexts/AuthContext.tsx` | Firebase Auth session state. |
| `src/components/ProtectedRoute.tsx` | Route guard for `/admin`. |
| `src/components/admin/*` | CMS managers for events, clubs, coordinators, gallery. |
| `src/constants/*` | Bundled seed content used as the offline/outage fallback. |

## Full Application Flow (ASCII)

```text
┌──────────────┐
│   Visitor    │
└──────┬───────┘
       │ HTTPS
       ▼
┌──────────────────────────────────────────────┐
│           Firebase Hosting (CDN)             │
│  index.html + hashed /assets/* (immutable)   │
└──────┬───────────────────────────────────────┘
       │ SPA boot, lazy route chunk
       ▼
┌──────────────────────────────────────────────┐
│              React application               │
│  Router → Page → useContent() hook           │
└──────┬───────────────────────────────────────┘
       │ TanStack Query (5 min stale time)
       ▼
┌──────────────────────────────────────────────┐
│            dataService / api.ts              │
│  Zod-validates every document it reads       │
└──────┬───────────────────────────┬───────────┘
       │ configured                │ unconfigured
       │                           │ or on error
       ▼                           ▼
┌────────────────────┐   ┌──────────────────────┐
│   Cloud Firestore  │   │  src/constants/*.ts  │
│  events, clubs,    │   │  bundled fallback    │
│  coordinators,     │   │  (read-only)         │
│  gallery,          │   └──────────────────────┘
│  registrations     │
└────────────────────┘
       ▲
       │ writes gated by security rules
       │
┌──────┴───────────────────────────────────────┐
│  Admin → /login → Firebase Auth              │
│  ID token carries the `admin` custom claim   │
│  Uploads go to Firebase Storage → URL saved  │
└──────────────────────────────────────────────┘
```

## Backend Architecture (ASCII)

There is no application server. Firebase security rules are the authorisation
layer that a backend would normally provide.

```text
┌───────────────────────────────────────────────┐
│                 React client                  │
│                                               │
│  pages/          components/admin/            │
│      │                   │                    │
│      ▼                   ▼                    │
│  hooks/useContent   (manager components)      │
│      │                   │                    │
│      └─────────┬─────────┘                    │
│                ▼                              │
│      utils/dataService · utils/api            │
│                │                              │
│                ▼                              │
│           lib/schemas (Zod)                   │
│                │                              │
│                ▼                              │
│           lib/firebase (SDK)                  │
└────────────────┬──────────────────────────────┘
                 │ HTTPS
                 ▼
┌───────────────────────────────────────────────┐
│              Firebase platform                │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │  Security rules (authorisation layer)   │  │
│  │  firestore.rules · storage.rules        │  │
│  │  public read · admin-claim write        │  │
│  └────────┬──────────────┬─────────────────┘  │
│           ▼              ▼                    │
│      Firestore       Storage        Auth      │
└───────────────────────────────────────────────┘
```

## Data Models

- **Event** — `id` (number, doc key), `title`, `date` (`YYYY-MM-DD`), `time?`,
  `location`, `description`, `image`, `status` (`upcoming` | `past`),
  `category`, `participants?`, `rating?`, `registrationLink?`, `eventType`
  (`free` | `paid`), `gallery?`.
- **Coordinator** — `id` (number, doc key), `name`, `role`, `image`, `bio`,
  `linkedin`.
- **Club** — `id` (number, doc key), `name`, `icon`, `description`,
  `objectives`, `extraInfo`, and embedded `coordinators[]`, `projects[]`,
  `gallery[]`.
- **GalleryImage** — `url` (also the doc key), `createdAt`.
- **Registration** — `name`, `reg_no`, `email`, `phone_no`, `year_of_study`,
  `recipt_no`, `type` (`internal` | `external`), `createdAt`; internal adds
  `division`, external adds `dept_name` and `college_name`.

Relationships are denormalised: clubs embed their coordinators and projects
rather than referencing separate documents, since the whole club record is read
and written as a unit.

## External Integrations

- **Cloud Firestore** — content and registration storage.
- **Firebase Authentication** — admin sign-in; the `admin` custom claim gates
  all writes.
- **Firebase Storage** — gallery image uploads (`gallery/` prefix). Optional:
  requires the Blaze plan. When absent, the CMS upload tab is disabled and
  gallery photos are served from the build instead.
- **Firebase Hosting** — static hosting with SPA rewrite.
- **EmailJS** — contact form delivery to `atom@karunya.edu`. The form disables
  itself when unconfigured rather than failing silently.

> The previous registration backend at `api.atom.org.in` no longer has a DNS
> record. Registrations now write to Firestore.

## Environment & Config

All client env vars are `VITE_`-prefixed and therefore **embedded in the
bundle**. They are identifiers, not secrets; access control comes from the
security rules. See `.env.example`.

**Firebase**
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
`VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
`VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`

**EmailJS (optional)**
`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`,
`VITE_EMAILJS_PUBLIC_KEY`

**Seeding (server-side only, never in the client)**
`GOOGLE_APPLICATION_CREDENTIALS` — path to a service account JSON, used by
`scripts/seed-firestore.mjs`.
