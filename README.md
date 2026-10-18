# Forecheck

Live NFL and NHL scores with game visuals (field position, drive chart, win probability, shot maps),
where to watch each game in Montréal, and live fantasy scoring from Sleeper and CBS.

Open the site, then on iPhone use **Share → Add to Home Screen** to install it as an app.

## How it works

- `index.html` is the whole app (no build step, no dependencies).
- Scores and stats come from ESPN's public feed; fantasy from Sleeper's public API and the CBS Fantasy API.
- `sw.js` makes the app open instantly and work offline. `manifest.webmanifest` and the icons make it installable.

## Your settings

Nothing personal is in this repository. League IDs, your teams and the CBS token are entered in
**Settings** (gear icon) and stored only on the device. A setup code fills them in one go.

"Where to watch" uses rules for the 2026–27 Canadian rights (Bell/TSN/CTV/RDS and DAZN for the NFL;
TSN2/RDS, Sportsnet, TVA Sports and Prime Video for the NHL). Sunday-afternoon NFL picks change weekly,
so the app links to TSN's schedule for those.
