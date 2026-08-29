# DonWells Cue Website — developer guide

This is the standalone public-facing DonWells Cue static site. It is a Nuxt 4 SPA built from the current desktop app and README, separate from the desktop-app repository. It builds the site intended for [`https://dwcue.com/`](https://dwcue.com/); generating locally does not deploy it.

This document is the developer's guide to the website. The current screenshot set is stored in `public/screenshots/`; refresh it from the current app UI when the playback surface changes. The checked-in workflow builds an artifact only; hosting/deployment credentials stay outside this project.

---

## Stack

- **Nuxt 4** (`ssr: false`, `nitro.preset: 'static'`) → generates a fully static SPA.
- **Vue 3** Composition API + `<script setup>`.
- **SCSS** for styles ([`app/assets/styles/main.scss`](app/assets/styles/main.scss)).
- Static output can be hosted by any static host. The production domain uses root-relative assets.
- No backend, no API: the page fetches the version snapshot and locale JSON at runtime.

The site is deliberately tiny — a small set of reusable components, one composable, and one Nuxt page. Anything more elaborate (component libraries, CMS, etc.) is out of scope.

---

## Layout

```
website/
├── app/app.vue                   The whole page: product story, current screenshots, downloads, docs checklist
├── nuxt.config.ts                Nuxt config — root base URL, OG/Twitter metadata
├── package.json                  Nuxt 4 + Vue 3 + sass
├── tsconfig.json
├── app/components/
│   └── LanguageSwitcher.vue      Compact locale dropdown
├── app/composables/
│   └── useI18n.ts                Auto-detect browser language; load JSON from /locales
├── app/assets/
│   └── styles/main.scss          Shared global reset and typography defaults
└── public/                       Static assets — served from `/...`
    ├── README.md                 Snapshot of the app README for the docs section
    ├── package.json              Minimal version/repository snapshot used by the page
    ├── downloads/                Packaged downloads served by the site
    ├── favicon.ico
    ├── assets/                   logo.svg
    ├── locales/                  Site-specific locale JSON for strings rendered by the landing page
    └── screenshots/              Current in-app screenshots
```

`public/README.md`, `public/package.json`, and `public/screenshots/` are snapshots. Refresh them from the app repository before publishing. The site intentionally has no dependency on the app repository at build time.

---

## Development

```sh
cd /Volumes/A042/audioplayback/website
npm install
npm run dev          # http://localhost:3000
```

To preview the production output:

```sh
npm run generate     # writes to .output/public
npm run preview
```

If you need the latest README, version, or screenshots while developing locally, copy them in manually:

```sh
# From this website directory
cp ../liveplay/README.md public/README.md
node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('../liveplay/package.json','utf8')); fs.writeFileSync('public/package.json', JSON.stringify({name:'donwells-cue',version:p.version,description:p.description,license:p.license,repository:'https://github.com/donwellsav/dwcue'},null,2)+'\\n')"
cp ../liveplay/client/public/screenshots/donwells_cue_*.jpg public/screenshots/
```

---

## How it works

1. **Version detection** — at runtime, the page fetches `package.json` from the active host and reads the `version` field. All download links are constructed from this version, with `2.6.12` as the checked-in fallback. Bump the three website version pointers with every app release.
2. **Download links** — macOS artifacts are served from this site’s `/downloads/` path; Windows and Linux artifacts continue to use the matching GitHub release:

   | Platform | Asset pattern                          |
   |----------|-----------------------------------------|
   | Windows  | `DonWells-Cue-Setup-<version>.exe`         |
   | macOS    | `DonWells-Cue-<version>-arm64.dmg/.zip`, `DonWells-Cue-<version>-x64.dmg/.zip` |
   | Linux    | `DonWells-Cue-<version>-x86_64.AppImage`, `DonWells-Cue-<version>-amd64.deb`, `DonWells-Cue-<version>-x86_64.rpm` |

   The current site release is **v2.6.12**. macOS artifacts are served from the site mirror; Windows and Linux links require the matching GitHub release.
3. **Product story** — the page explains the current audio/video workflow (Properties → Preview → Show Mode), Video Output, armed One Shots, output safety, language coverage, and supported release builds. The full technical reference remains the root README, linked from the docs section.
4. **Localisation** — `app/composables/useI18n.ts` detects the browser language and loads the matching JSON from `/locales/<code>.json`. Locale fetches use `cache: 'reload'` because published locale objects are immutable, so a release cannot leave returning visitors on stale copy. Falls back to English. The current locale is persisted in `localStorage`. `LanguageSwitcher.vue` is the UI.

---

## Editing

| Task | Where |
|------|-------|
| Change layout / sections | `app/app.vue` (everything is here) |
| Tweak the brand colour (currently `#315FCF`) | `app/app.vue` SCSS block + `app/assets/styles/main.scss` |
| Add a feature section | Add a section in `app/app.vue`; keep current screenshots and controls truthful |
| Add a language | New file in `public/locales/<code>.json`, then add it to `availableLocales` in `app/composables/useI18n.ts` |
| Replace the logo | `public/assets/logo.svg` |
| Update OG / Twitter cards | `nuxt.config.ts` → `app.head.meta` |

The site's locale files are **separate** from `client/locales/` and intentionally contain only the strings rendered by this landing page. Don't copy the desktop app's much larger catalog into them.

---

## Deployment

Build the standalone static output with root-relative asset URLs:

```sh
NUXT_APP_BASE_URL=/ npm run generate
```

The checked-in GitHub Actions workflow builds and uploads a validation artifact. Production hosting is the `dwcue-web` Worker backed by the `dwcue-site` R2 bucket. Publish `.output/public` with `npx --yes wrangler@4 r2 object put --remote`, uploading every generated file except `downloads/` (the release CI owns the macOS binaries). Use no-cache headers for HTML and `package.json`, and immutable caching for hashed assets.

---

## Adding a section

Edit `app/app.vue`. Sections are plain `<section class="…-section">` blocks inside the page; the SCSS is colocated at the bottom of the same file. There is no router and no other page — keep everything single-page.

If a section needs reusable layout (image-on-left, image-on-right, alternating), reuse the existing `feature-band__grid` pattern in `app/app.vue` rather than adding a component library.

---

## Troubleshooting

- **Old version shows after a release** — verify that the live `https://dwcue.com/package.json` has the new version and that the generated assets were uploaded to the `dwcue-site` R2 bucket. The page fetches this pointer at runtime.
- **404 on downloads** — the site reads its version from `public/package.json`; ensure the matching macOS files exist in the R2 `downloads/` prefix. Windows and Linux links require the matching GitHub release.
- **404 on assets** — confirm the file is in `public/` (not just `assets/` — Nuxt's `assets/` is bundle-only).
- **Build fails** — reproduce locally with `npm run generate` and confirm the snapshots in `public/` are present.
