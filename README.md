# Shubham Raj · Portfolio

A personal portfolio told as an anime series: a cartoon title card, manga-panel story arcs, flip-card skills, playable "training missions" and a hidden cheat-code console.

Plain HTML, CSS and JavaScript. No framework, no build step.

## Run it locally

Open `index.html` in a browser. That's it.

Or serve the folder (recommended, so it behaves like the live site):

```bash
npm start          # runs: npx serve .
# or
python3 -m http.server 8080
```

An internet connection is needed for Google Fonts and Three.js (loaded from cdnjs).

## Project structure

```
shubham-raj-portfolio/
├── index.html        # all page content and the cartoon character (inline SVG)
├── css/
│   └── styles.css    # design tokens, comic components, layout, animations
├── js/
│   └── main.js       # 3D scene, effects and the four interactive missions
├── assets/
│   └── favicon.svg
├── package.json      # optional: `npm start` to serve locally
└── README.md
```

## Sections

| Episode | id | What's in it |
| --- | --- | --- |
| Title card | `#top` | Cartoon hero, cel-shaded 3D shapes, "Press start" impact effect |
| EP1 · Character profile | `#profile` | Character sheet, stat bars, four-panel origin story |
| EP2 · Special moves | `#moves` | Skill cards that tilt and flip |
| EP3 · Story arcs | `#story` | Work experience as three manga chapters |
| EP4 · Training missions | `#missions` | Workflow engine (DAG), retry + backoff, offline POS, context-window chat |
| Next episode | `#next` | Contact details with copy buttons |

## Customizing

- **Text and experience:** edit the sections in `index.html`. Each job is an `<article class="arc">`.
- **Colors and fonts:** the tokens at the top of `css/styles.css` (`--pink`, `--sky`, `--pop`, `--mint`, `--display`, …).
- **The character:** the `<svg class="chibi">` in the hero. Hair is the last big `path` inside `#ch-head`, skin uses `#D9955F`, the hoodie uses `#FF3D8B`. Other places reuse it through `<use href="#ch-head">`.
- **Character lines:** the `LINES` array in `js/main.js` (search `character talk`).
- **Chatbot answers:** the `KB` array in `js/main.js` (search `mission D`).
- **Cheat codes:** the `CMD` object in `js/main.js` (search `cheat-code console`).
- **Skill counts:** each card's `×N` badge and the stat bars in `#profile` are set by hand, so update them if you add skills.

## Shortcuts

- <kbd>`</kbd> opens the cheat-code console (`help` lists commands)
- ↑ ↑ ↓ ↓ ← → ← → B A triggers a secret power-up

## Deploy

- **GitHub Pages:** push this folder to a repo, then Settings → Pages → deploy from the `main` branch root.
- **Netlify:** drag the folder onto app.netlify.com/drop.
- **Vercel:** `npx vercel` in this folder and accept the defaults.

## Accessibility and performance

- Respects `prefers-reduced-motion`: petals, shaking, flashes and auto-rotation turn off.
- The 3D scene pauses when the hero is off screen or the tab is hidden.
- If WebGL or Three.js is unavailable, the page still works without the 3D shapes.

## Credits

- [Three.js r128](https://threejs.org) (MIT), loaded from cdnjs
- Fonts from Google Fonts: Dela Gothic One, M PLUS Rounded 1c, Shantell Sans, DotGothic16
- Character, icons and illustrations are original SVG drawings
