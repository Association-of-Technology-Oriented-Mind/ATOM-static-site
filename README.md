# ATOM Club

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8_strict-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_·_Auth-FFCA28.svg)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Website and content management system for the Association of Technology
Oriented Minds at Karunya Institute of Technology and Sciences.

**Live:** https://atom-2026.web.app

A React single-page app on Firebase Hosting. Firebase provides the database,
authentication and (optionally) file storage — there is no custom backend
server. Club admins edit events, clubs, coordinators and the gallery through a
protected CMS at `/admin`; visitors browse events and submit registrations.

---

## Quick start

```bash
npm ci
cp .env.example .env    # fill in from Firebase Console — see docs/setup.md
npm run dev             # http://localhost:8000
```

The site runs **without** Firebase configured — content falls back to
`src/constants/*`. You only need `.env` for admin login, registrations, and
live content.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 8000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built output locally |
| `npm run typecheck` | `tsc --noEmit` (strict mode) |
| `npm test` | Run the Vitest suite |
| `npm run test:watch` | Vitest in watch mode |
| `npm run lint` | ESLint |

## Documentation

| Doc | Read it when |
| --- | --- |
| [GOAL.md](GOAL.md) | **Start here if continuing the redesign** — what's done, what's left |
| [docs/onboarding.md](docs/onboarding.md) | New to the project |
| [docs/design-system.md](docs/design-system.md) | Visual direction and tokens |
| [docs/setup.md](docs/setup.md) | Setting up Firebase or a new machine |
| [docs/architecture.md](docs/architecture.md) | Understanding how it fits together |
| [docs/API.md](docs/API.md) | Working with Firestore data |
| [docs/content-guide.md](docs/content-guide.md) | Adding events or photos (non-technical) |
| [CLAUDE.md](CLAUDE.md) | Conventions and invariants for contributors |
| [FIXES.md](FIXES.md) | Bug log — check before "fixing" something |
| [STATUS.md](STATUS.md) | Recent work and open items |

## Tech stack

- **TypeScript 5.8** (`strict: true`), **React 18**, **React Router 6**
- **Vite 5** (SWC), **Tailwind 3**, **shadcn/ui** (Radix)
- **Firestore** for data, **Firebase Auth** for admin sessions
- **TanStack Query** for fetching, **Zod** for validation
- **framer-motion**, **GSAP**, **OGL** for animation
- **Vitest** + Testing Library

## Project structure

```
src/
├── assets/          # Build-time images (WebP). PHOTOS/ is the gallery.
├── components/
│   ├── admin/       # CMS managers (events, clubs, coordinators, gallery)
│   ├── events/      # Event cards, timeline, modal
│   └── ui/          # shadcn/ui primitives
├── config/          # EmailJS config
├── constants/       # Bundled content — the fallback when Firestore is empty
├── contexts/        # AuthContext (Firebase Auth session)
├── hooks/           # useContent (TanStack Query wrappers)
├── lib/             # firebase.ts (SDK init), schemas.ts (Zod)
├── pages/           # Route components
├── test/            # Vitest setup
└── utils/           # dataService (Firestore), api (registrations)

public/EVENTS/       # Event poster images, referenced by filename
scripts/             # Firestore seeding, admin claim
firestore.rules      # Authorization — the real access control
```

## Admin access

There are **no credentials in this repository.** Admin login uses Firebase
Auth; accounts are created in the Firebase Console and need an `admin` custom
claim before they can write anything. See [docs/setup.md](docs/setup.md).

> Earlier versions of this README published a hardcoded admin username and
> password. Those shipped in the client bundle, are revoked, and no longer
> work. Never put credentials in this repo.

## Deploying

```bash
npm run build
npx firebase deploy --only hosting
```

Security rules deploy separately, and should go out before any rule change
reaches users:

```bash
npx firebase deploy --only firestore:rules
```

## Contributing

1. Branch off `master`.
2. `npm run typecheck && npm test` must pass.
3. Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).
4. Append to `FIXES.md` when you fix a bug, and `STATUS.md` when you finish
   something meaningful.

Read [CLAUDE.md](CLAUDE.md) first — it documents invariants that aren't obvious
from the code and have caused real bugs before.

## Support

- **Issues:** https://github.com/Association-of-Technology-Oriented-Mind/ATOM/issues
- **Email:** atom@karunya.edu

## License

MIT — see [LICENSE](LICENSE).

---

Built by students, for students — ATOM Club, Karunya Institute of Technology
and Sciences.
