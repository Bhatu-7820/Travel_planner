# Traveloop Frontend

A complete React + Vite frontend for a personalized travel planning platform.

## Install and run

```bash
npm install
npm run dev
```

## Mock API

This project uses `src/services/mockApi.js` as a self-contained backend simulation.  
All data is stored in `localStorage`, including users, trips, activities, cities, packing lists, and notes.

The app starts with seeded demo data:
- 2 users (including an admin account)
- 3 trips for the demo user
- 10 cities
- 15 activities

## Switching to a real backend

All network calls go through `src/services/api.js`.  
To connect a real backend later, replace the axios adapter logic in that file and point `baseURL` to your backend API.

## Demo credentials

- Email: `demo@traveloop.com`
- Password: `password123`

Admin account:
- Email: `admin@traveloop.com`
- Password: `admin123`
