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

## Part 2: Photo Album (Optional)

- Simple upload UI (drag/drop or camera on mobile)
- Uploads go to Cloudinary, metadata (url, guest name optional, timestamp) saved to Mongo
- Gallery view to see uploaded photos (optional, groom can decide if public or admin-only)

## Part 3: Admin Panel (groom only)

- Simple login (password protected, doesn't need to be fancy)
- Guest list table with filter/search
- Photo moderation view (optional — delete inappropriate uploads)

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

## API Endpoints

### Photos

- `POST /api/photos/upload` — upload photo (via multer + cloudinary)
- `GET /api/photos` — fetch all photos for gallery
- `DELETE /api/photos/:id` — remove photo (admin)

## Photo Model

**Photo**

```js
{
  url: String,
  cloudinaryId: String,
  uploadedBy: String,  // optional
  createdAt: Date
}
```
