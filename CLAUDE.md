# Rocky Mountain Skin — Website Project Reference

The public marketing site at **[www.rockymtnskin.com](https://www.rockymtnskin.com)** for Jake Howard's solo esthetician studio in South Salt Lake, UT. Static, no backend — separate project from the [`rms-dashboard`](https://github.com/prestonhilburn26/rms-dashboard) PWA.

**Read this first.** Captures conventions and hazards that aren't obvious from the code alone.

---

## Stack

- **Vanilla HTML / CSS / JS.** No build step, no framework, no bundler.
- **Two stylesheets:** `css/styles.css` (design tokens — color, type, spacing, effects) and `css/components.css` (header/nav, cards, footer, etc.).
- **One script:** `js/main.js` — nav scroll behavior, mobile menu toggle, IntersectionObserver fade-up animations, Netlify form submit handler, smooth anchor scrolling, active-link highlighting.
- **Fonts:** Cormorant Garamond (display) + DM Sans (body), both via Google Fonts CDN.
- **Hosting:** **Netlify**, via drag-and-drop deploy of the folder. Domain: `rockymtnskin.netlify.app` aliased to `www.rockymtnskin.com`.
- **Forms:** Netlify Forms (form posts to `/` with `application/x-www-form-urlencoded`).

---

## Source of truth hierarchy

1. **GitHub repo** (`prestonhilburn26/rockymtnskin-website`) = code. Local clone at `~/Documents/GitHub/rockymtnskin-website/`.
2. **Netlify** = deployed site. Currently lags GitHub: a `git push` does NOT auto-deploy because Netlify is wired for drag-and-drop, not GitHub auto-deploy. **Wiring up auto-deploy is the top operational task** (see Hazards below).
3. **`www.rockymtnskin.com`** = what visitors see. The version Netlify last accepted.

---

## File layout

```
~/Documents/GitHub/rockymtnskin-website/
├── index.html                  (home — heavy SEO + JSON-LD)
├── about.html
├── book.html                   (booking entry)
├── facials.html, hydrafacial.html, microneedling.html, laser.html,
│   brow-and-lash.html, body-treatments.html, waxing.html,
│   permanent-makeup.html, advanced-services.html, house-calls.html
│                               (service pages, one per service)
├── memberships.html, rewards.html, the-skin-edit.html,
│   gift-cards.html, mothers-day.html
│                               (programs, marketing, seasonal)
├── blog/                       (11 posts: skincare education, FAQs)
├── css/
│   ├── styles.css              (design tokens, base type, layout)
│   └── components.css          (componentized: nav, header, cards, footer)
├── js/main.js
└── images/                     (28 jpg/png files: hero, service shots, blog images, logo)
```

**18 HTML pages at root + 11 in `blog/` = 29 total pages.** Each has its own `<head>` + nav + footer copy (no template system; see Hazards).

---

## Naming conventions

- **CSS:** BEM-style — `.block__element--modifier`. Examples: `.nav__logo`, `.nav__link`, `.nav__mobile-link`, `.site-header.scrolled`, `.service-card`, `.blog-card`, `.lead-form-success`.
- **Design tokens:** all in `:root {}` blocks at the top of `styles.css`. Reference via `var(--token-name)`. Don't introduce raw colors / spacing / fonts — use the tokens.
- **Animations:** add `.animate-fade-up` or `.animate-fade-in` to an element to opt in to scroll-triggered fade. `js/main.js` runs `IntersectionObserver` over `.animate-fade-up, .animate-fade-in, .service-card, .value-item, .blog-card, .testimonial-card`. New element classes that should fade in must be added to that selector list in `main.js`.

---

## Design system

Defined in `css/styles.css` `:root`:

- **Colors:** `--color-cream` (page bg), `--color-cream-dark` (alt bg), `--color-dark` (warm black text), `--color-warm-gray` (secondary), `--color-rule` (borders), `--color-gold` / `--color-gold-light` / `--color-gold-dark` (brand accent), `--color-sage` / `--color-sage-light` (logo accent), `--color-error`, `--color-success`.
- **Typography:** `--font-display` (Cormorant Garamond) for headings, `--font-body` (DM Sans) for body. Sizes are fluid via `clamp()`: `--text-xs` through `--text-5xl`. Line-heights, tracking, weights all tokenized.
- **Spacing:** `--space-1` (0.25rem) through `--space-32` (8rem). Section padding: `--section-py`, `--section-px`.
- **Containers:** `--container-sm` (640px) through `--container-2xl` (1400px).
- **Effects:** `--radius-sm/md/lg/full`, `--shadow-sm/md/lg`, `--transition`, `--transition-slow`.

---

## Critical safety rules

1. **No build step = typos go live.** A bad CSS rule or `<script>` syntax error breaks the site immediately on next deploy. `node --check js/main.js` before deploying is cheap insurance.
2. **Schema.org JSON-LD is duplicated across 29 pages.** Business hours, address, phone, social URLs all live inside `<script type="application/ld+json">` in every page's `<head>`. **Updating business info means editing every page.** A future cleanup is to extract to a shared template, but until then: search across files when these change.
3. **Netlify Forms detection requires `data-netlify="true"` on `<form>`.** Forms without it submit but Netlify ignores them, so submissions are silently dropped. Test every new form by submitting and checking the Netlify dashboard's Forms tab.
4. **No template system.** The nav, header, and footer are copy-pasted into every page. Adding a nav link means editing 29 files. Use search-replace carefully — the desktop and mobile navs have different markup (`.nav__links` vs `.nav__mobile-link`), and both must stay in sync.
5. **Don't push secrets.** No API keys / tokens belong in this repo. Forms are Netlify-handled (no client-side credentials). If a future feature needs a secret, use Netlify Functions, not inline JS.

---

## Deploy workflow

Currently manual:

1. Edit files locally in `~/Documents/GitHub/rockymtnskin-website/`.
2. `git add`, commit + push (via GitHub Desktop or CLI). Pushes to `prestonhilburn26/rockymtnskin-website`.
3. **Manually drag the folder onto Netlify dashboard's Drag-and-Drop panel** to deploy. A push alone does NOT update the live site.

**Top operational task:** wire Netlify to auto-deploy on push to `main`. In Netlify dashboard → Site Settings → Build & Deploy → Link Repository → GitHub → select `prestonhilburn26/rockymtnskin-website` → branch `main`, blank build command, publish directory `.`. Once done, `git push` becomes the deploy.

---

## Known hazards

1. **Drive ↔ GitHub drift risk.** A canonical copy of these files also lives in Google Drive at `My Drive/Esthetics/01 Rocky Mountain Skin/Systems/Website/rockymtnskin-website-github/`. **Don't edit the Drive copy.** GitHub is now authoritative (April 2026). The Drive folder may stay around as backup but treat it as read-only.
2. **Auto-deploy gap (see deploy workflow).** Until Netlify is wired to GitHub, every push needs a manual Netlify drag-and-drop. Easy to forget.
3. **Header / footer / schema duplication.** Multi-file edits required for nav, branding, business-info changes. No safety net beyond grep.
4. **`.gitignore` doesn't exist.** A stray `.DS_Store` could be uploaded by anyone running git from Finder-touched directories. Low-priority cleanup: add a `.gitignore` with `.DS_Store` minimum.
5. **Square Payment Link URLs** (mothers-day + gift-cards pages) are rumored to have placeholders per the Notion HQ snapshot. If working in those pages, verify URLs are real before pushing.

---

## Frontend patterns

- **Page structure:** each HTML page is independent. `<head>` has SEO + JSON-LD + font preconnects + `styles.css`+`components.css` + favicons. `<body>` opens with `<header class="site-header">`, then page-specific `<main>` content, then `<footer>`. The `<script src="js/main.js">` loads at the end.
- **Mobile menu:** the desktop nav (`.nav__links`) and mobile nav (`.nav__mobile`) are separate elements. CSS controls visibility via media query. `js/main.js` toggles `.open` on `.nav__mobile` for the slide-in.
- **Scroll-triggered fades:** any element with `.animate-fade-up` (or one of the auto-watched class selectors) starts at `opacity: 0` + `translateY(18px)`, then fades + translates to neutral as it intersects the viewport. Stagger is 0.07s per element via `transition-delay` set in JS.
- **Lead form:** `[data-lead-form]` selector. Submission goes to Netlify Forms via `fetch('/', { method: 'POST' })`. Successful submit replaces the form innerHTML with a `.lead-form-success` block.
- **Smooth anchors:** `js/main.js` intercepts `a[href^="#"]` clicks, scrolls with offset for the fixed nav (subtracts `header.offsetHeight + 16`).

---

## Coordination

**Workflow split (as of 2026-04-27):** the **Website Manager** (Cowork) **scopes** work in Notion — what page changes, why, copy/SEO requirements, deploy considerations. **Jake + Claude Code execute.** Read the relevant Notion scope page first; don't re-derive requirements from a screenshot of the live site.

Hand off back via the Notion session log (end-of-session ritual). The Website Manager consumes the log to update master state.

### Cross-domain rules

- **Don't share code or schema with `rms-dashboard`.** They're separate projects, separate stacks (this is static HTML on Netlify; the dashboard is a PWA + Apps Script). A change to one shouldn't touch the other.
- **Account context:** the GitHub remote (`prestonhilburn26/rockymtnskin-website`) lives on Preston's account. Jake uses it via the shared paid plan. The same account hosts `prestonhilburn26/Evergreen-Barbershop` for Preston's husband — that repo is **off-limits**, not part of this work.

---

## Useful commands

Local syntax check (cheap pre-deploy gate):
```bash
node --check js/main.js
```

Recent git activity:
```bash
git log --oneline -20
```

Find every place a string appears (e.g. when changing business info):
```bash
grep -rn "STRING_TO_FIND" --include='*.html'
```

---

## When in doubt

- Static site → small changes are usually safe to ship; cosmetic typos break less than CSS/JS errors.
- Lead with the answer, follow with evidence. Be terse.
- Test forms by actually submitting them (Netlify dashboard → Forms tab) — `data-netlify` attribute is easy to forget.
- Test mobile responsiveness; the spa-feel design relies on it.
