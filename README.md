## Readme file for the project

# Wedding Project Plan

## Stack

- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB (Atlas free tier)
- Media storage: Cloudinary
- Email sending: Resend
- Hosting: Vercel (frontend + backend)

---

## Part 1: Digital Invitation

- Landing page with wedding details (date, venue, time, maybe map link)
- RSVP form (name, attending yes/no, +1 count if allowed, maybe meal choice)
- Optional: personalized link per guest (`/invite/:guestId`) so name is pre-filled
- Confirmation screen after submitting

## Part 2: Photo Album (QR code)

- QR code printed at church → points to `/photos` page (public, no login)
- Simple upload UI (drag/drop or camera on mobile)
- Uploads go to Cloudinary, metadata (url, guest name optional, timestamp) saved to Mongo
- Gallery view to see uploaded photos (optional, groom can decide if public or admin-only)

## Part 3: Admin Panel (groom only)

- Simple login (password protected, doesn't need to be fancy)
- Dashboard: total invited, confirmed yes, confirmed no, no response yet
- Guest list table with filter/search
- Photo moderation view (optional — delete inappropriate uploads)
- **Bulk invite tab**: form to add guest names + emails (multiple rows), on submit creates guests as "pending" and sends invitation emails in bulk. Reusable later to add more guests individually or in smaller batches.

---

# Email Sending

Bulk sending from a personal Gmail/Gmail API has spam and daily-limit risk (no sender reputation, Gmail's own bulk-pattern detection). Use a transactional email service instead:

- **Resend** (recommended) — free tier: 3,000 emails/month, 100/day. Simple API, good deliverability, built for this use case.
- **SendGrid** — free tier ~100/day, more setup overhead.
- **Mailgun** — free tier, more limited.

For ~100-150 guests, Resend's free tier comfortably covers it.

---

# Backend Plan

## Folder Structure

```
/backend
  /config
    db.js            → mongo connection
    cloudinary.js     → cloudinary config
    email.js          → resend config
  /models
    Guest.js
    Photo.js
  /controllers
    rsvpController.js
    photoController.js
    adminController.js
  /routes
    rsvpRoutes.js
    photoRoutes.js
    adminRoutes.js
  /middlewares
    auth.js           → admin auth check
    errorHandler.js    → centralized error handling
    upload.js          → multer config for handling file uploads
  server.js            → app.listen
  app.js               → express app setup, middleware mounting
```

## Why this structure

- **config**: anything external (db, 3rd party services) isolated, easy to swap/env-based
- **models**: Mongoose schemas, one file per collection
- **controllers**: actual logic (what happens on each request), keeps routes clean
- **routes**: just wiring `HTTP method + path → controller function`, no logic here
- **middlewares**: reusable request processing (auth check, file upload handling, error catching)
- **app.js vs server.js split**: app.js configures Express (useful for testing later), server.js just starts listening — common convention, keeps concerns separate

## API Endpoints

### RSVP

- `POST /api/rsvp` — submit response
- `GET /api/rsvp/:id` — fetch guest info for personalized invite
- `PUT /api/rsvp/:id` — update response

### Photos

- `POST /api/photos/upload` — upload photo (via multer + cloudinary)
- `GET /api/photos` — fetch all photos for gallery
- `DELETE /api/photos/:id` — remove photo (admin)

### Admin

- `POST /api/admin/login` — simple password auth, returns token
- `GET /api/admin/guests` — full guest list + RSVP status
- `GET /api/admin/stats` — counts summary
- `GET /api/admin/photos` — photo moderation list
- `POST /api/admin/guests/bulk-invite` — add guests in bulk (names + emails) and trigger invite emails

## Models (rough shape)

**Guest**

```js
{
  name: String,
  email: String,
  status: String,   // "pending" | "yes" | "no"
  plusOnes: Number,
  mealChoice: String,
  respondedAt: Date
}
```

**Photo**

```js
{
  url: String,
  cloudinaryId: String,
  uploadedBy: String,  // optional
  createdAt: Date
}
```

## Auth note

For a project this size, skip JWT complexity — a simple shared admin password checked against an env variable, returning a signed token (or even just a session flag) is enough. Don't over-engineer auth for a one-user admin panel.

---

# Frontend Tabs / Routes

### Public

- `/invite` or `/invite/:guestId` — the digital invitation + RSVP form
- `/photos` — QR-code destination, photo upload + gallery

### Admin (protected)

- `/admin/login` — login screen
- `/admin/dashboard` — stats overview (yes/no/pending counts)
- `/admin/guests` — guest list table with status, filter/search, **print button** (print-friendly view of the guest list — useful for giving a headcount to the restaurant or church)
- `/admin/invite` — bulk invite tab (add guest names + emails, send invitations)
- `/admin/photos` — photo moderation view (optional)
