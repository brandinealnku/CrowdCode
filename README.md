# INF 286 Demo Day Platform

A GitHub Pages-ready static Firebase app for turning class demo day into a live launch experience.

## Files
- `index.html` — instructor host dashboard
- `audience.html` — student audience join + voting page
- `gallery.html` — public project gallery
- `assets/styles.css` — shared styling
- `assets/app.js` — shared Firebase/session logic

## How to use
1. Upload all files to the root of a GitHub Pages repo.
2. Open `index.html` with a `?session=YOURCODE` parameter if desired, or let it generate one.
3. Edit the project list in the host page and click **Save projects**.
4. Students scan the QR code to open `audience.html`.
5. Use **Start countdown**, **Final reveal**, and **Open voting** during class.
6. Share `gallery.html?session=YOURCODE` as the project showcase page.

## Project list format
Each line in the project textarea must use:

`Team|Project Title|Category|Pitch|Demo URL|Repo URL|Members|Tech`

Example:

`Team Alpha|GlowUp Coffee|Website Redesign|A modern coffee site redesign.|https://example.com|https://github.com/example|Ava, Noah, Eli|HTML, CSS, JavaScript`

## Firebase
This package currently uses the Firebase configuration from the shared source code the platform was based on.
If you want to move it to a different Firebase project, update `assets/app.js`.
