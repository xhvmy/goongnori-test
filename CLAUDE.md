# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deployment

Live at https://xhvmy.github.io/goongnori-test/ via GitHub Pages, serving straight from the `main` branch root (`xhvmy/goongnori-test` on GitHub) — no build step, so whatever's on `main` is what's live.

**After any code change in this repo, commit and push to `main` automatically** — the user wants every edit reflected on the live site without being asked each time. Write a normal descriptive commit message; no need to check in before pushing.

## Development

No build step. Run a local server from the project root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`. `sw.js` registers a service worker that network-first's `.html`/`.css`/`.js` (app shell) and cache-first's everything else (images/sound/fonts). After CSS/JS changes, a normal reload picks up new app-shell files immediately since those are network-first; if something looks stuck, hard refresh (**Cmd+Shift+R**) or unregister the service worker in DevTools → Application → Service Workers. Bump `CACHE_NAME` in `sw.js` when the precache list (`APP_SHELL`) changes, so returning users don't get stuck on stale cached assets.

The PIN password is `1395`, stored as a SHA-256 hash in `js/content.js` → `CONFIG.passwordHash` (see the comment there for how to regenerate it for a new PIN). Auth persistence is stored in `localStorage` under key `goongnori_auth`. Selected language is stored under `goongnori_lang`. Clear both via DevTools → Application → Local Storage to force the Language Select → PIN flow again from scratch.

## Architecture

### Single-page, screen-based flow

`index.html` is a single-page app shell. It contains every screen as a sibling `<section class="screen" data-screen="...">` inside `#app-shell`; `js/main.js` shows exactly one at a time by toggling the `.is-active` class (see `showScreen(name)` in `js/main.js`).

Current flow:

```
Language Select → Gate Screen (PIN) → Gate 등장 (캐릭터 등장)
  → [Chapter 0 → 이동중 0 → Chapter 1 → 이동중 1 → ... → Chapter 6] → Closing
```

- **Language Select** (`data-screen="language-select"`): shown once, first visit only (no `goongnori_lang` in localStorage yet). Background photo + scrim, 4 language rows built from `LANGUAGES` in `content.js`.
- **Gate Screen** (`data-screen="gate-pin"`): PIN entry via SHA-256-hash compare + attempt-lockout (`sha256Hex`, `ATTEMPTS_KEY`/`LOCK_KEY`, `CONFIG.maxAttempts`/`lockoutMs`). The UI is 4 boxed **slots** that show the actual digit typed (`.pin-slot`), not obscured dots — the PIN is an in-world puzzle, not a real secret.
- **Gate 등장**: one-time character intro shown right after a correct PIN. Not re-shown on reload — see routing below.
- **Chapter** (`data-screen="chapter"`) / **이동중** (`data-screen="enroute"`): the 7-chapter/6-map journey through all palace locations, alternating chapter → map → chapter. Driven by a single flattened step index (`progressStep`, persisted as `goongnori_step`) via `stepInfo()`/`goToStep()` in `main.js` — even steps are chapters (`step/2`), odd steps are maps (`(step-1)/2`), and the final step is Closing. `renderChapter(idx)` builds paragraphs and interspersed images from `CHAPTERS[idx].extraImages` (each `{src, after}` inserts after that 0-based paragraph index); `renderEnroute(idx)` positions the 7 map pins from the shared `MAP_PIN_POSITIONS` (identical across all 6 maps — only per-pin completed/current/locked state changes, computed from `fromIdx`/`toIdx`).
- **Closing** (`data-screen="closing"`): shown after the last chapter. CTA ("처음부터 다시 보기") calls `restartJourney()`, which fully resets `goongnori_auth`/`goongnori_lang`/`goongnori_step` and returns to Language Select.

### Routing on load

`main.js`'s `DOMContentLoaded` handler decides the initial screen from persisted state — no `goongnori_lang` → Language Select; has lang but no `goongnori_auth` → Gate PIN; has both → `beginOrResume()`, which jumps straight to whatever step `goongnori_step` was last on (defaulting to Chapter 0). Gate 등장 is skipped on repeat visits — it's a one-time flourish tied to *this* login, not permanent state.

### Content system

All screen text lives in **`js/content.js`**, one block per screen (`LANGUAGE_SELECT_TEXT`, `GATE_PIN_TEXT`, `GATE_APPEAR_TEXT`, `CHAPTERS`, `MAPS`, `CLOSING_TEXT`), keyed by language code (`ko`/`en`/`ja`/`zh`). `main.js` renders these into the DOM at screen-transition time (`textContent`) — there's exactly one live copy of each string in the DOM at a time, in the visitor's chosen language.

### Design tokens

All colors/spacing/radii are CSS custom properties on `:root` in `style.css`, mapped 1:1 to the Figma variable collection (`--color-bg-canvas`, `--color-accent-primary`, etc. — see `FIGMA-REDESIGN-SPEC.md` for the full table). The design is a **single light/cream theme** (`#fbf6ee` canvas, `#3a6d67` celadon accent) — no dark mode. A handful of legacy-sounding variable aliases (`--bg`, `--gold`, `--cream`, …) exist purely so `404.html`'s `.pw-page`/`.nf-*` classes resolve without duplicating token names.

### Fonts

Google Fonts: `Noto Serif KR/JP/SC` (body text per language), `Jua` (labels, numbers, EN display font), `Zen Maru Gothic` (JA display font), `ZCOOL KuaiLe` (ZH display font), `Nunito` (PIN slot digits, stamp counts), `Cormorant Garamond` (EN body/brand serif). **KMU80** (Sungkok Semi-Serif / Sungkok Serif — the KO display/CTA font) is a custom Korean font not on Google Fonts; it's self-hosted via `@font-face` from `fonts/*.woff2` (see `:root` in `style.css` for the two `@font-face` blocks). `main.js`'s `applyDisplayFont(el, lang, isCta)` helper adds the right `.font-ko`/`.font-en`/`.font-ja`/`.font-zh`/`.font-cta-ko` class to headings/CTAs so each language renders in its own display font (KO uses a different font for headings vs. CTA buttons; EN/JA/ZH use the same font for both).

### Tablet / desktop layout

`@media (min-width: 560px)` centers `.mobile-wrap` as a fixed-width (540px) phone frame on a dark backdrop, applied globally. 560px (not the more common 768px) was chosen deliberately so it also catches Galaxy Z Fold's unfolded width (~673px) — real phones cap out near 430-480px in portrait, so there's a clean gap to exploit between "phone" and "everything else."

## Key files

| File | Role |
|------|------|
| `js/content.js` | Password hash, default lang, all per-screen text (all 4 languages), plus `PLACES`/`CHAPTERS`/`MAPS`/`MAP_PIN_POSITIONS` data tables |
| `js/main.js` | Screen router (`showScreen`), PIN/lockout logic, journey state machine (`stepInfo`/`goToStep`/`beginOrResume`), per-screen render functions |
| `css/style.css` | Single stylesheet — design tokens at top, screen system, one section per screen |
| `index.html` | All screens, inline markup (text is filled in by `main.js`, not hardcoded here) |
| `404.html` | Standalone 404 page |
| `fonts/` | Self-hosted KMU80 woff2 files |
| `images/00_logo/` | Favicon / PWA icons |
| `images/01_gate/` | Language Select / Gate / Gate 등장 screen assets |
| `images/02_chapters/` | Per-chapter hero + interspersed images, one subfolder per palace location |
| `images/03_maps/` | Per-map background illustrations (6 total) |
| `FIGMA-REDESIGN-SPEC.md` | Full Figma screen spec + component inventory |
| `manifest.json` | PWA manifest |

## Adding / editing content

- **Change any screen's text**: edit the relevant block in `js/content.js` — no HTML/JS changes needed.
- **Change password**: edit `CONFIG.passwordHash` in `js/content.js` (see the comment there for how to hash a new PIN).
- **Add a new screen**: add a `<section class="screen" data-screen="my-screen">…</section>` to `index.html`, a `goToMyScreen()` render function in `main.js` that fills in text and calls `showScreen('my-screen')`, and a text block in `content.js`. Style it in `style.css` following the existing per-screen sections (`.lang-select`, `.gate-pin`, `.gate-appear`, `.chapter`, `.enroute`, `.closing`) as a pattern.
