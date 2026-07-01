# Lessons for Working on KlassYar

## Always Ask Before Assuming
- When there are multiple possible approaches, unclear requirements, or I'm between two choices — **ALWAYS ask the user** before proceeding.
- Don't guess what the user wants. Ask: "کدوم رو انتخاب کنم؟" or "این کارو بکنم یا نه؟"
- Changes without explicit confirmation can waste time and cause frustration.

## Key Facts
- App is called "کلاس یار" (KlassYar) — an educational gamification platform
- Currently on version 1.5.1
- Total games: 130 (30 old types + 50 new educational + 50 English)
- Language: Persian (RTL)
- Framework: React + Vite + Tailwind
- Auth: Local (localStorage), Firebase removed
- PWA: Service worker with cache-first strategy

## Common Gotchas
- Don't replace old game types with new ones — ADD, never replace
- Home page should show ALL game samples
- Dashboard "فعالیت جدید" must include ALL game types
- Previous commits: 1b570b3 (before code-splitting), c9bc355 (with code-splitting)
- build command: `node node_modules/vite/bin/vite.js build`
