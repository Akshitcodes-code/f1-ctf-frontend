# 🏎️ F1 Paddock Grand Prix CTF — Escape Room Frontend

An immersive, high-speed Formula 1-themed Capture The Flag (CTF) escape room web application built with **React**, **Vite**, **Framer Motion**, and **Tailwind CSS**. Designed for integration with **CTFd** via reverse proxy.

---

## 🏁 Racing Aesthetics & Theme
- **Color Palette**:
  - `#E10600` (F1 Championship Red)
  - `#15151E` (Dark Paddock Charcoal)
  - `#0B0B11` (Pitch Black Carbon)
  - `#FFD700` (Podium Gold)
  - `#00D26A` (Track Green / DRS)
  - `#A855F7` (Fastest Lap Purple)
- **Visuals**:
  - High-res carbon fiber textures
  - Dynamic 5-red-lights race start countdown gantry
  - Red & white racing curb accents
  - Diagonal speed cuts & aerodynamic styling
  - Live timing tower broadcast leaderboard

---

## 🛠️ Architecture & Files Created

| File | Description |
|------|-------------|
| [`vite.config.js`](./vite.config.js) | Configured with Vite proxy routing `/api`, `/login`, `/register`, `/logout` to CTFd at `localhost:8000` |
| [`src/services/ctfdApi.js`](./src/services/ctfdApi.js) | Full CTFd API wrapper with session cookie auth, CSRF token extraction, and offline fallback mode |
| [`src/App.jsx`](./src/App.jsx) | React Router root with top navigation and pit wall telemetry footer |
| [`src/App.css`](./src/App.css) | F1 styling, starting lights gantry, tire compound badges, and timing tower |
| [`src/pages/LandingPage.jsx`](./src/pages/LandingPage.jsx) | Animated 5-red-lights sequence ("LIGHTS OUT AND AWAY WE GO!"), escape room lore, and CTAs |
| [`src/pages/LoginPage.jsx`](./src/pages/LoginPage.jsx) | "Garage Entry" authentication with live FIA Super Licence badge preview & team selection |
| [`src/pages/ChallengePage.jsx`](./src/pages/ChallengePage.jsx) | Sequential pit stop escape room board with lock/unlock flow and tire compound filtering |
| [`src/pages/ScoreboardPage.jsx`](./src/pages/ScoreboardPage.jsx) | F1 broadcast timing tower with P1/P2/P3 podium cards, sector deltas, and auto-refresh |
| [`src/components/Navbar.jsx`](./src/components/Navbar.jsx) | Top navigation bar with F1 branding, DRS status, and live driver profile pill |
| [`src/components/ChallengeCard.jsx`](./src/components/ChallengeCard.jsx) | Pit stop challenge card with lock overlay, tire compound badge, and status |
| [`src/components/FlagSubmit.jsx`](./src/components/FlagSubmit.jsx) | Pit wall flag transponder modal with victory confetti and radio feedback |
| [`src/index.css`](./src/index.css) | Reset styles, custom scrollbars, carbon fiber patterns, and button animations |
| [`index.html`](./index.html) | HTML entry with Google Racing Fonts (*Orbitron*, *Chakra Petch*, *Titillium Web*) |
| [`package.json`](./package.json) | Dependencies (`react`, `react-dom`, `react-router-dom`, `axios`, `framer-motion`, `react-icons`, `canvas-confetti`) |

---

## 🔒 Escape Room Mechanics (Sequential Unlocking)
- Challenges are structured as consecutive **Pit Stops** around the Grand Prix circuit.
- **Pit Stop 1** (Warmup / Sector 1) is unlocked by default.
- Subsequent Pit Stops are **locked** behind a red barrier and padlock until the driver solves the preceding challenge.
- Solving a challenge triggers the pit crew radio ("BOX BOX") and awards championship points, dynamically unlocking the next sector!

---

## 🚀 Running the Project

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the Vite development server**:
   ```bash
   npm run dev
   ```

3. Open browser at: `http://localhost:3000`

4. **CTFd Connectivity**:
   - Ensure your CTFd instance is running on `http://localhost:8000`.
   - The Vite proxy will route `/api/v1/*` requests directly to CTFd with session cookies preserved.
   - If CTFd is offline, the app runs in **Telemetry Simulator Mode** with full escape room gameplay!
