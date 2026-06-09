---
name: pitch-deck
description: >-
  Builds investor/sales pitch decks as a single scroll-driven HTML page in the
  "Robbin" design system — dark theme, gold (#FFAB40) accent, ambient
  background (orbs + grain + grid), fixed topbar with brand mark, progress bar,
  side minimap, keyboard/scroll navigation, IntersectionObserver slide tracking,
  and animated counters. Use whenever the user wants to create, extend, restyle,
  or add slides to a pitch deck, sales deck, investor presentation, or a similar
  scrollytelling one-pager and wants it to match the existing Robbin decks.
---

# Pitch Deck (Robbin design system)

This skill reproduces the look, feel, and interaction model of the Robbin pitch
decks (`index.html` / `robbin-deck.html`). The visual language and the
navigation engine live in two reusable assets shipped with this skill:

- `assets/styles.css` — the full design system (tokens, ambient background,
  topbar, minimap, every slide-type layout). **Reuse this; do not reinvent it.**
- `assets/app.js` — the navigation engine (scroll/keyboard nav, minimap build,
  progress bar, IntersectionObserver active-slide tracking, animated counters).

## How to build a deck

1. Copy `assets/styles.css` and `assets/app.js` next to the new HTML file (or
   link to them). Never restyle from scratch — extend the existing CSS.
2. Create `index.html` using the skeleton in **Page skeleton** below.
3. Add one `<section class="slide …">` per slide using the **Slide patterns**.
4. Each slide MUST have `data-title="…"` (shows in the minimap) and a sequential
   `data-num="01"`, `02`, … The topbar counter total is computed automatically
   by `app.js` from the slide count — just keep `#totSlide` in the markup.
5. Renumber `data-num`, the `eyebrow` prefixes, and `#totSlide` whenever slides
   are added, removed, or reordered.

## Design tokens (already in styles.css `:root`)

| Token | Value | Use |
|-------|-------|-----|
| `--bg` / `--bg-2` | `#06070b` / `#0c0e15` | page background |
| `--ink` / `--ink-dim` / `--ink-mute` | `#f6f7fb` / `#a4a8b6` / `#6b6f7d` | text hierarchy |
| `--gold` / `--gold-soft` | `#FFAB40` / `#ffd089` | accent — the brand color |
| `--card` / `--card-2` | translucent white | cards/surfaces |
| `--radius` | `18px` | card corners |
| `--max` | `1240px` | content max-width |

Fonts (loaded via Google Fonts in `<head>`): **Inter** (body/headlines),
**Space Grotesk** (display), **JetBrains Mono** (numbers/labels/eyebrows).

## Page skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>YOUR TITLE — subtitle</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="ambient">
    <div class="grain"></div>
    <div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div>
    <div class="grid-bg"></div>
  </div>

  <header class="topbar">
    <div class="brand"><span class="brand-mark">R</span><span class="brand-name">robbin</span></div>
    <div class="topbar-meta">
      <span class="meta-pill">PITCH · MONTH YEAR</span>
      <span class="counter"><b id="curSlide">01</b><span class="slash">/</span><span id="totSlide">17</span></span>
    </div>
  </header>

  <div class="progress"><div class="progress-fill" id="progressFill"></div></div>
  <nav class="minimap" aria-label="slide navigation"><ol id="minimapList"></ol></nav>
  <div class="hint" id="hint"><kbd>↑</kbd><kbd>↓</kbd> or <kbd>Space</kbd> · scroll to navigate</div>

  <main class="deck" id="deck">
    <!-- slides go here -->
  </main>

  <script src="app.js"></script>
</body>
</html>
```

## Slide patterns

Every content slide wraps its body in `.slide-inner`, opens with an `.eyebrow`
(format: `NN · Section`) and a `.big-headline` where the key phrase is wrapped
in `<span class="gold">…</span>`.

**Cover** — `class="slide cover"`, has `.cover-bg` (SVG radial `halo`),
`.cover-content` with `.cover-logo`, an `<h1 class="cover-title">` split into
`<span class="reveal">` / `.reveal.delay-1` / `.reveal.delay-2.gold` words for
the staggered entrance, a `.cover-sub`, and a `.scroll-cue`.

**Standard content slide**
```html
<section class="slide SECTIONNAME" data-title="Minimap Label" data-num="NN">
  <div class="slide-inner">
    <div class="eyebrow">NN · Section</div>
    <h2 class="big-headline">Statement with the <span class="gold">key phrase</span>.</h2>
    <!-- grids, cards, etc. -->
  </div>
</section>
```

**Animated KPI / metric** — counts up from 0 when scrolled into view (handled by
`app.js`). `data-to` is the target value; integers get thousands separators,
floats render to one decimal:
```html
<div class="kpi-num"><span class="cnt" data-to="2400">0</span></div>
<div class="kpi-num">USD <span class="cnt" data-to="34">0</span>M</div>
```

**Demo slide** — `class="slide demo-section"`, used for product mockups. Phone
mock: `.device.frame-phone` → `.phone-notch` + `.phone-screen` → `.phone-app`
(`.phone-hdr`, `.phone-balance`, `.phone-actions` with a `.gold-btn`,
`.phone-tx`). For videos, embed `<video>` inside the device frame.

**Closing / Vision** — `class="slide closing"`, big centered statement, gold
emphasis on the final line.

### Established section types (reuse the class names — each is styled)
`cover`, `team`, `compare`, `wrong-rail`, `pix-rail`, `rails-map`, `network`,
`market`, `traction`, `flywheel`, `timeline`, `revenue`, `growth`,
`demo-section`, `closing`.

## Conventions & guardrails

- **Gold is precious.** One emphasized phrase per headline, key numbers, one
  primary CTA button (`.gold-btn`). Don't flood slides with gold.
- **Reuse layouts before inventing.** If a new slide resembles an existing
  section type, reuse that class and its CSS. Only add new CSS when no existing
  pattern fits, and keep it in the same token-driven style.
- **Keep it one file + 2 assets.** The deck is a single self-contained HTML page
  driven by `styles.css` + `app.js`. No build step, no framework.
- **Accessibility:** decorative SVG/graphics get `aria-hidden="true"`; the
  minimap nav keeps its `aria-label`.
- **Verify after building:** open the HTML in a browser, scroll/arrow through
  every slide, confirm the minimap, progress bar, counter, and KPI count-ups
  fire, and that nothing overflows at 1512×982 (MacBook 14") and 1920×1080.
