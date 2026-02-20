# WebWave Retro OS v1.0

A retro desktop-style web experience built with vanilla HTML, CSS, and JavaScript.

## Live Website

- Production: https://webwave-v1.netlify.app/
- Test (Draft Deploy): https://69982185eafad2974e3698f6--webwave-v1.netlify.app

Use the draft deploy for testing before publishing to production.

## Features

- BIOS-like boot screen and login flow
- Desktop UI with draggable/resizable windows
- Start menu and taskbar experience
- Built-in apps: About, Settings, File Explorer, Gallery, Terminal, Minesweeper
- Theme switching and CRT effect toggle with localStorage persistence

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks)

## Project Structure

```text
.
|- index.html
|- css/
|  \- style.css
|- js/
|  |- main.js
|  |- windowManager.js
|  |- apps.js
|  \- minesweeper.js
\- assets/
   \- img/
```

## Run Locally

Option 1: Open `index.html` directly in your browser.

Option 2: Run a local server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Netlify Deploy

- Create a test deploy:

```bash
netlify deploy --dir .
```

- Deploy to production:

```bash
netlify deploy --prod --dir .
```

## Repository

https://github.com/Senula007/WebWave-Retro-OS-V1.0
