# RideSwift 🚗

A full-stack ridesharing platform built with TypeScript, React, and PostgreSQL — supporting real-time ride matching, live GPS tracking, and route rendering via the Google Maps API.

## Features

- **Two user modes** — rider booking and driver availability, in a single app
- **Real-time ride matching** — riders create ride requests, drivers pick them up
- **Live location tracking** — driver positions broadcast over WebSocket to all connected clients
- **Interactive maps** — pickup/dropoff selection, geocoding, and turn-by-turn route rendering via the Google Maps JavaScript API and Directions API
- **Fare calculation** — geodesic distance via the Haversine formula, applied to a base rate + per-kilometre pricing model
- **Type-safe end-to-end** — Zod validation schemas generated directly from the Drizzle database schema, validating every API request at the boundary
- **Ride lifecycle state machine** — pending → accepted → completed/cancelled

## Tech Stack

**Frontend:** React · TypeScript · TanStack Query · react-hook-form · Tailwind CSS · shadcn/ui · Wouter (routing)

**Backend:** Node.js · Express · WebSockets (`ws`)

**Database:** PostgreSQL · Drizzle ORM · Zod (via `drizzle-zod`)

**Maps:** Google Maps JavaScript API · Directions API

**Tooling:** Vite · esbuild · Docker (for local Postgres)


<img width="2874" height="1490" alt="Screenshot (6)" src="https://github.com/user-attachments/assets/ca9c7224-cf8a-45a6-a5b9-04182a31d05a" />
<img width="2880" height="1443" alt="Screenshot (5)" src="https://github.com/user-attachments/assets/19ae9753-7360-4754-8fd0-24bf7cd11513" />
<img width="2880" height="1800" alt="Screenshot (4)" src="https://github.com/user-attachments/assets/0ea05667-03d6-4f97-ba69-7288ac82b8fb" />
