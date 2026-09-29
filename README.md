# Hyun's Clock & Calendar & Notes Dashboard

> A dark-mode web dashboard featuring a Korean-time analog clock, monthly calendar, and rich-text post-it notes.

## Features

- 🕐 **Analog Clock** — Korean time (Asia/Seoul), black face, neon-green hands and numerals, dual 12h/24h ring
- 📅 **Calendar** — Red-themed monthly calendar, today's date highlighted, month navigation
- 📝 **Post-it Notes** — Yellow sticky notes with Rich Text Editor (bold, italic, color, lists), localStorage persistence, export as HTML or TXT

## Tech Stack

- Pure HTML + CSS + JavaScript (no frameworks)
- Canvas API for the clock
- `contenteditable` + `document.execCommand` for rich text
- `localStorage` for note persistence
- Deployed via [Vercel](https://vercel.com)

## Development

Open `index.html` in your browser – no build step required.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
