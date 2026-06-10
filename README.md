# LaunchFlow — Setup Guide

## 1. Install dependencies

```bash
npm install prisma @prisma/client bcryptjs
npm install -D @types/bcryptjs
```

> **Note:** `bcryptjs` is listed but intentionally **not used** in this Phase 1 submission  
> (see BUG_LOG.md — DEFECT #2). It should be wired in during Phase 2.

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your Neon credentials:

```bash
cp .env.example .env.local
```

From your **Neon dashboard → your project → Connection Details**:
- `DATABASE_URL` → use the **Pooled connection** string (includes `pgbouncer=true`)
- `DIRECT_URL` → use the **Direct connection** string (no pgbouncer)

Both strings are needed because Prisma migrations use a direct connection while
the app runtime uses the pooled one.

## 3. Initialise Prisma

```bash
npx prisma generate          # generates the Prisma client
npx prisma db push           # pushes schema to your Neon database (no migration file)
# or if you prefer migration files:
npx prisma migrate dev --name init
```

## 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000/signup` to see the sign-up page.

---

## File map

| File | Purpose |
|---|---|
| `prisma/schema.prisma` | Database schema — `User` model |
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/lib/validation.ts` | Reusable field validators (used by both client & server) |
| `src/app/api/auth/signup/route.ts` | POST `/api/auth/signup` — server-side signup handler |
| `src/app/signup/page.tsx` | `/signup` page — form, client validation, success screen |
| `src/components/PasswordStrength.tsx` | Password strength indicator component |
| `BUG_LOG.md` | 🔒 Hidden until Phase 2 — intentional defect documentation |

---

## Phase 2 checklist (fixes)

- [ ] BUG-001 — Remove `.trim()` from confirm-password comparison  
- [ ] BUG-002 — Hash passwords with `bcrypt.hash(password, 12)` before storing  
- [ ] BUG-003 — Normalise email to lowercase before uniqueness check and storage  
- [ ] BUG-004 — Add `console.error` + Prisma P2002 handling in the catch block