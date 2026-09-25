# Barnyard Buddies 🐾

A responsive, mobile-first Progressive Web App (PWA) designed for partners to track wild and farm animals they've fed in real life.

Built with **React (Vite)**, **Tailwind CSS**, **Lucide Icons**, **Canvas-Confetti**, and **Firebase Firestore** with offline **LocalStorage** sync.

---

## 🎨 Visual Aesthetic & Theme (Google Stitch Export)

Crafted faithfully after the Google Stitch Design tokens:
- **Palette**: Warm cream canvas (`#FAF8F2`), pasture emeralds (`#00873a`, `#4ade80`), sunny straw yellow (`#fcdf46`, `#ffe24c`), barn red (`#bb0112`), and warm timber brown accents (`#78350f`).
- **Tactile Soft-UI**: Ultra-rounded corners (`rounded-2xl` & `rounded-3xl`), pill-shaped action buttons, bouncy tap micro-interactions (`active:scale-95`), and sunlit ambient drop shadows.
- **Pasture Wood Plaques**: Hall of Fame cards with wooden hardware accents, feeding date stamps, resident badges, and safe snack tags.

---

## 🚀 Key Features & User Flows

1. **Top Header & Segmented Pill Switcher**:
   - Barnyard Buddies branding, streak pill ("Day 14 Streak 🔥"), and Jamie & Alex co-op profile indicator with heart badge.
   - Segmented toggle between **Hungry Friends (X)** and **The Barnyard (Y)**.
   - Sync badge displaying live Firestore or local offline mode.

2. **Tab A: Hungry Friends**:
   - Meadow Trail banner with motivation & couple turn indicator ("Alex fed 2 yesterday • Your turn, Jamie!").
   - 2-column responsive card grid of animals waiting for snacks.
   - Safe snack pills, location tag, and tactile "Feed 🥕" CTA.
   - Backpack snack summary ("Packed in Backpack: 4 Carrots • 1 cup Oats • 2 Apples").
   - Floating Action Button (+) with "Spotted a friend? 🎉" badge.

3. **Feed & Christen Modal**:
   - Celebratory `canvas-confetti` explosion.
   - Glowing portrait with crown and heart badges.
   - Live name christening input (e.g., "Sam" -> preview "Sam the Sheep").
   - "Roll 🎲" randomizer button cycling through cute farm names.
   - Snack portion selector chips (Crunchy Carrots, Crisp Apples, Sweet Oats, Fresh Peas, Clover, Seeds).
   - Partner logger ("Fed by Jamie", "Fed by Alex", "Fed Together 💕").
   - Favorite toggle and "Welcome to the Farm! 🚜" submit button that flips status to `'fed'` and animates the animal to The Barnyard.

4. **Tab B: The Barnyard (Hall of Fame)**:
   - Rustic wood plaque banner with brass screw hardware accents, laurel star badge, and couple co-op ribbon.
   - Category filter pills: `All Residents`, `🐑 Barnyard`, `🦆 Pond Friends`, `🐿️ Woodland`, `🐦 Urban`.
   - Cards styled as cozy pasture pens with bold christened name, feeding stamp date, wooden snack tag, and heart ratings.

5. **Add Animal Modal / Drawer**:
   - Search bar with instant filtering.
   - Category chips (Farm, Pond, Woodland, Urban).
   - 22+ animal library with safe snacks and fun facts.
   - Custom wild encounter creator for rare or unlisted animals.

6. **Backend & Real-Time Sync**:
   - Powered by Firebase Firestore (`onSnapshot` listener on collection `tracked_animals`).
   - Seamless offline fallback to `localStorage` pre-populated with initial mock data.
   - In-app Sync & Storage Settings to connect custom Firebase credentials anytime or restore demo data.

7. **PWA Standalone Ready**:
   - `manifest.json` configured for standalone mobile display.
   - `sw.js` service worker for offline caching.
   - Safe-area insets (`pb-safe`, `pt-safe`) for edge-to-edge iOS/Android screens.

---

## 🛠️ Quickstart

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```
