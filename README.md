## Readme file for the project

# My Plan

## Stack

- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB
- Media storage: Cloudinary
- Email sending: Resend
- Hosting: Vercel

---

## Photo Album (Optional)

- Simple upload UI
- Uploads go to Cloudinary, metadata saved to Mongo
- Gallery view to see uploaded photos

## Admin Panel

- Simple login (password protected)
- Guest list table with filter and search
- Photo view

---

# Backend Plan

## Folder Structure

```
/backend
  /config
    db.js
    cloudinary.js // cloudinary config
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
    auth.js
    errorHandler.js
    upload.js  // for the photos
  index.js
  app.js
```

## Photo Model

in case I do it

```js
{
  url: String,
  cloudinaryId: String, // not sure about that
}
```
