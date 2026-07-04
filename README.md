##   Styron TSM React + Node Website

A full-stack website for Styron TSM Steel Reinforcement Solutions with an AI-powered chat assistant backed by Claude.

## Project Structure

```
styron-tsm/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Stats.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── QuoteForm.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── FloatingWidgets.jsx   ← AI chat + WhatsApp
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── vite.config.js    ← proxies /api → localhost:3001
└── server/
    ├── index.js          ← Express + Anthropic SDK
    ├── .env.example
    └── package.json
```

## Quick Start

### 1. Install dependencies

```bash
npm install          # root devDeps (concurrently)
npm install --prefix server
npm install --prefix client
```

Or run all at once:
```bash
npm run install:all
```

### 2. Configure the server

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...your key here...
PORT=3001
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/styron-tsm
```

For `MONGODB_URI`, either:
- Run MongoDB locally (`mongodb://localhost:27017/styron-tsm`), or
- Create a free cluster at https://www.mongodb.com/cloud/atlas and paste its connection string here.

### 2b. Seed the database (first time only)

```bash
cd server
npm run seed
```

This populates the `products` collection with the 4 starter products. Safe to re-run — it clears and re-inserts each time.

### 3. Run in development

```bash
npm run dev
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:3001

The Vite dev server proxies `/api` requests to the Node server automatically, so no CORS issues in development.

## Products API

Products are now stored in MongoDB instead of being hardcoded in the frontend.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/products` | Public | List active products |
| GET | `/api/products?all=true` | Public | List all products (admin panel view) |
| GET | `/api/products/:slug` | Public | Get one product |
| POST | `/api/products` | Admin JWT | Create a product |
| PUT | `/api/products/:slug` | Admin JWT | Update a product (price, stock, etc.) |
| DELETE | `/api/products/:slug` | Admin JWT | Delete a product |

Admin-only routes expect `Authorization: Bearer <token>`, using the same JWT issued by `/api/auth/verify-otp` when logging in as the `ADMIN_EMAIL` address.

## Key Features

- **AI Chat Assistant** — Claude-powered chatbot with Styron product knowledge, served via the Node backend (API key never exposed to the browser)
- **Animated stats counters** — IntersectionObserver triggers count-up when section enters viewport
- **Auto-scrolling testimonials** — CSS animation with pause on hover
- **FAQ accordion** — React state-driven open/close
- **Quote request form** — Controlled form with submission feedback
- **WhatsApp floating button** — Animated pulse, links to WhatsApp
- **Google Maps embed** — Pune, Maharashtra location
- **Responsive** — Mobile-first breakpoints at 900px and 600px

## Production Deployment

1. Build the frontend: `npm run build` (outputs to `client/dist/`)
2. Serve `client/dist/` as static files from Express (add `express.static` to `server/index.js`)
3. Deploy to any Node-compatible host (Railway, Render, Fly.io, etc.)
4. Set `ANTHROPIC_API_KEY` as an environment variable on the host
5. Remove or update `CLIENT_URL` CORS origin for your production domain

## Customisation Checklist

- [ ] Replace `+91 98XXX XXXXX` with the real phone/WhatsApp number throughout
- [ ] Replace `info@styrontsm.com` with the real email address
- [ ] Update the Google Maps embed URL with the exact factory/office address
- [ ] Add a real favicon to `client/public/`
- [ ] Swap placeholder phone in WhatsApp links (`wa.me/919800000000`)
