# React Firebase Portfolio

A Vite React portfolio with Firebase Authentication, Firestore CRUD, Cloudinary uploads, Tailwind CSS, React Router, and Framer Motion page transitions.

## Setup

```bash
npm install
npm run dev
```

The app reads all Firebase and Cloudinary values from `.env` using Vite's `VITE_` prefix. Do not hardcode these values in source files.

## Environment Variables

Create a local `.env` file and add these Vite variables from your Firebase and Cloudinary dashboards:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

## Firebase

The Firebase service is in `src/services/firebase.js` and exports:

- `auth` from Firebase Authentication
- `db` from Cloud Firestore

Create an email/password admin user in Firebase Authentication. Firestore writes are allowed only when the signed-in user's email matches the admin email in `firestore.rules`.

## Firestore Rules Deployment

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

To change the admin, edit the email inside `firestore.rules`, then deploy again.

## Data Model

Collections are flat and linked by document IDs:

- `courses`
- `achievements` with `courseId`
- `certificates` with `courseId` and `achievementId`
- `gallery` with `achievementId` and `eventId`
- `extracurricular`

## Admin Dashboard

Visit `/admin`, sign in with Firebase email/password, then create, update, delete, and upload media to Cloudinary. Uploaded files store the returned `secure_url` in the selected Firestore document.
