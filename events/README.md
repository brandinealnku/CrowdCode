[README.md](https://github.com/user-attachments/files/26876550/README.md)
# CrowdCode: Asset Library + Multi-Event GitHub Starter

This version upgrades CrowdCode into a reusable multi-event starter with:

- Admin Studio for building events
- Per-event logo and hero artwork uploads
- Firebase Realtime Database storage for small assets as data URLs
- Host dashboard for launching live sessions
- Audience page for joining by code or QR
- GitHub Pages friendly static files

## Files

- `index.html` — landing page
- `admin.html` — event builder and asset library
- `host.html` — live session control dashboard
- `audience.html` — phone join page
- `assets/styles.css` — shared styling
- `assets/app.js` — Firebase config and app logic
- `firebase.rules.json` — starter Realtime Database rules

## Setup

### 1. Firebase

Create a Firebase project with:
- Realtime Database
- Authentication with **Anonymous** sign-in enabled

Then open `assets/app.js` and replace the placeholder config:

```js
const firebaseConfig = {
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME.firebaseapp.com',
  databaseURL: 'https://REPLACE_ME-default-rtdb.firebaseio.com',
  projectId: 'REPLACE_ME',
  storageBucket: 'REPLACE_ME.appspot.com',
  messagingSenderId: 'REPLACE_ME',
  appId: 'REPLACE_ME'
};
```

### 2. Database rules

In Firebase Realtime Database, paste the contents of `firebase.rules.json` into the Rules tab and publish.

### 3. GitHub Pages

Upload these files to a GitHub repository and enable GitHub Pages from the root branch.

Example URLs:
- `https://YOUR-USERNAME.github.io/REPO/admin.html`
- `https://YOUR-USERNAME.github.io/REPO/host.html`
- `https://YOUR-USERNAME.github.io/REPO/audience.html`

### 4. Authentication note

Because this version uses anonymous sign-in for demo simplicity, make sure Authentication → Sign-in method → Anonymous is enabled in Firebase.

## Important note about assets

This version stores small uploaded images directly in Realtime Database as data URLs so you can prototype without Firebase Storage.

That makes setup easier and can stay on a free plan for small assets, but it is best for:
- logos
- light event graphics
- compressed photos

For larger production use, migrate assets to Firebase Storage.

## Suggested next upgrade

The next strong upgrade would be:
- Firebase Storage-backed asset manager
- drag-and-drop event templates
- authenticated host roles
- analytics / session recap export
