# Data API

There is no HTTP API. The client talks to Firestore directly through the
Firebase SDK; authorisation is enforced by `firestore.rules` and
`storage.rules`, not by application code.

> The former REST backend at `https://api.atom.org.in` is gone — the domain has
> no DNS record. Registration submissions previously POSTed there and failed
> silently while still showing users a success screen.

## Collections

| Collection | Doc key | Public read | Write |
| --- | --- | --- | --- |
| `events` | `id` | yes | `admin` claim |
| `coordinators` | `id` | yes | `admin` claim |
| `clubs` | `id` | yes | `admin` claim |
| `gallery` | image URL | yes | `admin` claim |
| `registrations` | auto | **no** — admin only | anyone may `create` |

`registrations` is deliberately asymmetric: students must be able to submit
without an account, but the documents hold personal data (name, email, phone,
receipt number) and are readable only by admins.

## Client functions

All live in `src/utils/`. Every one validates through `src/lib/schemas.ts`.

### `getEvents(): Promise<Event[]>`
Reads `events` ordered by `date` desc. Each document is parsed with
`eventSchema`; malformed documents are logged and skipped rather than breaking
the page. Falls back to `src/constants/events.ts` when Firebase is
unconfigured, the collection is empty, or the read throws.

`getCoordinators()`, `getClubs()`, `getGalleryImages()` follow the same
fallback contract.

### `registerParticipant(data, type): Promise<RegistrationResult>`
Validates against `internalRegistrationSchema` or
`externalRegistrationSchema`, then writes to `registrations` with `type` and a
server timestamp.

Returns `{ success: false, message }` — never throws — on validation failure,
missing configuration, or a rejected write. Callers surface `message` in a
toast.

```ts
const result = await registerParticipant(formData, 'internal');
if (!result.success) toast({ title: 'Registration failed', description: result.message });
```

### `replaceCollection(name, items, idKey): Promise<void>`
Replaces a whole collection: upserts every item by `idKey` and deletes any
document whose id is no longer present. Used by the admin managers, which edit
an in-memory array and save it wholesale. Throws on failure so callers can roll
back optimistic state.

## Validation schemas

`src/lib/schemas.ts` is the single validation boundary.

- `eventSchema` — requires `YYYY-MM-DD` dates; `status` and `eventType` are
  closed enums.
- `internalRegistrationSchema` — base fields plus `division`.
- `externalRegistrationSchema` — base fields plus `dept_name`, `college_name`.

Phone numbers are normalised (spaces and dashes stripped) before the 10-digit
check, so `98765-43210` is accepted and stored as `9876543210`.

## Granting admin access

Writes require an `admin` custom claim; being signed in is not enough. Create
the user in Firebase Console → Authentication, then run once with the Admin
SDK:

```js
await getAuth().setCustomUserClaims(uid, { admin: true });
```

The user must sign out and back in for the refreshed token to carry the claim.
