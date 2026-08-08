# Content guide

How to update the website. Written for club members, not developers — the
first two sections need no coding at all.

## Signing in

1. Go to https://atom-2026.web.app/login
2. Enter your admin email and password
3. You land on the dashboard at `/admin`

Don't have an account? Someone with Firebase Console access creates it, then
grants admin rights (see [setup.md](setup.md)). Both steps are required — an
account without admin rights can sign in but every save will fail.

**Never share the password in chat, screenshots, or commits.** If it leaks,
reset it in the Firebase Console immediately.

## Editing events, clubs and coordinators

From the dashboard, pick a section in the sidebar:

| Section | What you can change |
| --- | --- |
| **Events** | Add, edit, delete events — title, date, location, description, category |
| **Coordinators** | Team member name, role, bio, LinkedIn |
| **Clubs** | Club details, objectives, coordinators, projects |
| **Gallery** | View photos (uploads are disabled — see below) |

Changes save to the database and appear on the public site straight away. No
deploy needed. A visitor may see the old version for up to 5 minutes because of
caching; a hard refresh (`Ctrl+Shift+R`) shows it immediately.

### Event fields worth knowing

- **Date** must be `YYYY-MM-DD`, e.g. `2026-03-15`. For multi-day events you
  may use `2026-03-15,2026-03-17`; the site displays the start date.
- **Status** — `upcoming` or `past`. This decides where the event appears.
- **Event type** — `free` or `paid`.
- **Image** — the poster filename, e.g. `/EVENTS/My Event.webp`. Adding a new
  poster needs a developer (below).

If a save fails, you'll get a red error message. The most common cause is your
account missing admin rights.

---

## Adding photos and posters (needs a developer)

Image uploads through the CMS are turned off, because Firebase Storage requires
a paid plan. Images are added through the code repository instead.

### Gallery photos

```bash
# 1. Convert and resize (ImageMagick)
magick photo.jpg -resize '1200x1200>' -quality 78 src/assets/PHOTOS/photo.webp

# 2. Commit and deploy
git add src/assets/PHOTOS/photo.webp
git commit -m "feat: add gallery photo"
npm run build && npx firebase deploy --only hosting
```

The gallery picks up new files automatically — no code change needed.

### Event posters

```bash
magick poster.jpg -resize '1600x1600>' -quality 82 "public/EVENTS/My Event.webp"
```

Then set the event's image field to `/EVENTS/My Event.webp`, either in the CMS
or in `src/constants/events.ts`.

### Why WebP, and why resize

The site once shipped 182 MB of images; some headshots were 7 MB each. It is
now about 20 MB total. Please keep new images under ~300 KB — always convert
to WebP and resize. Photos straight off a phone are 3–5 MB and will undo this.

---

## Where things live

| Content | Stored in | Edited how |
| --- | --- | --- |
| Events | Firestore | CMS |
| Coordinators, clubs | Firestore (or bundled defaults) | CMS |
| Gallery photos | Repository (`src/assets/PHOTOS/`) | Commit + deploy |
| Event posters | Repository (`public/EVENTS/`) | Commit + deploy |
| Registrations | Firestore | Read-only, admins only |

## Registrations

Student submissions from `/registration/internal` and
`/registration/external` are saved to the `registrations` collection.

They contain personal data — name, email, phone, receipt number — and are
**not** publicly readable. Only admins can view them, currently through the
Firebase Console (Firestore → `registrations`). An in-CMS view with CSV export
hasn't been built yet.

## Troubleshooting

**"Could not save…" when editing**
Your account is missing admin rights. A developer runs
`node scripts/set-admin-claim.mjs your@email.com`, then you sign out and back
in.

**Signed in but bounced back to the login page**
The session expired. Sign in again.

**A photo isn't showing**
It probably wasn't converted to WebP, or wasn't committed and deployed. Check
the file exists in `src/assets/PHOTOS/` on the `master` branch.

**An event I added isn't on the site**
Check its `date` is `YYYY-MM-DD` and `status` is set. Events with a malformed
date are skipped deliberately, so one bad record can't break the events page.

**The contact form says it's unavailable**
EmailJS isn't configured. Set the `VITE_EMAILJS_*` variables in `.env` and
redeploy. Until then the form points people at atom@karunya.edu.
