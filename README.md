# About_Pankaj

A personal portfolio powered by a small Node.js/Express backend. The frontend is still plain HTML, CSS, and JavaScript, but the "Currently" section now loads live activity from an API.

## Features

- Portfolio homepage served by Express
- API health check
- Live activity API
- Persistent activity data stored in `data/activity.json`
- Frontend status text like `I am live now` or `I was live 2 hours ago`

## Project Files

- `server.js` - Express backend and API routes
- `package.json` - project scripts and dependencies
- `index.html` - portfolio page
- `style.css` - page styling
- `script.js` - slider and live activity fetch logic
- `data/activity.json` - saved current work and last active time

## Run Locally

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## API

Check server:

```bash
GET /api/health
```

Get live activity:

```bash
GET /api/profile/activity
```

Update activity and mark yourself live:

```bash
POST /api/profile/activity
Content-Type: application/json

{
  "title": "Backend - Login/SignUp",
  "description": "Writing backend for a video watching app like YouTube."
}
```

Set a custom last active time:

```bash
POST /api/profile/activity
Content-Type: application/json

{
  "lastActiveAt": "2026-05-31T03:30:00.000Z"
}
```
