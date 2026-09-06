# DonWells Cue website

Standalone Nuxt 4 / Vue 3 static website for [dwcue.com](https://dwcue.com/). The September 2026 redesign is English-only: no language selector, browser-language detection, locale requests, or persisted language state. The desktop app's 21-language support is independent of the website language.

## Structure

| File | Responsibility |
| --- | --- |
| `app/app.vue` | Product story, responsive navigation, workflow/output tabs, silent GO illustration, manual and FAQ |
| `app/components/DownloadSection.vue` | Platform selectors, eight release formats, installation guidance |
| `app/components/ScreenshotDialog.vue` | Native screenshot dialog, Escape/backdrop dismissal and focus restoration |
| `app/composables/useI18n.ts` | English copy-key lookup and parameter substitution; only exports `useI18n().t` |
| `app/assets/styles/main.scss` | Global tokens, editorial layout, responsive rules and reduced-motion behavior |
| `public/locales/en.json` | English copy, including the `redesign` namespace |
| `nuxt.config.ts` | Static generation, fonts, metadata and social preview |
| `public/package.json` | Runtime release-version pointer |
| `public/screenshots/manual-20260906/` | Real operator-manual captures, converted to uncropped WebP |
| `public/manual/operators-manual-2.6.14.pdf` | Published operator manual |
| `worker/index.js` | Production R2-serving Worker |

Existing non-English catalogs remain dormant. Do not reactivate the old locale behavior without a deliberate translated-content release.

## Design and interaction contracts

Charcoal, warm ivory, lime, amber and coral; Barlow Condensed headings, IBM Plex Sans body copy and IBM Plex Mono labels. Use existing tokens and flat ruled layouts rather than adding a component library.

Preserve `#top`, `#main`, `#workflow`, `#show-mode`, `#one-shots`, `#video-output`, `#download` and `#docs` links. Screenshot controls open the real capture, not a simulated app. The GO sequence is an explicitly labelled silent illustration, with no audio, autoplay or page-wide hotkeys. Enter and Space work when GO has keyboard focus. Reduced-motion users receive visible content without reveal movement; content remains visible without JavaScript.

## Source provenance

Product facts and images come from the desktop repository's `docs/operators-manual.md`, `docs/operators-manual.pdf` and `docs/manual-assets/captures.json`.

The published manual and screenshots are **operator edition 2.6.14**, captured **6 September 2026**, source revision `8ea1e9c`. Current installers are **2.6.16**. Keep these labels separate rather than relabelling old captures as a newer build.

The PDF is copied byte-for-byte (6,294,820 bytes; SHA-256 `b7aee52a7d1f1a7a5097ad4a3e116ae9fcc8af171f7c54ea6f17af3270c84ed3`). Web images retain their full framing. Generated design references are not published as product screenshots. The site has no build-time dependency on the desktop repository.

When updating copy, preserve distinctions from the manual:

- One Shot settings are Overlay, Duck Program and Replace Program. Duck Program sets an absolute Program Level, not a relative attenuation.
- Preview is private only when routed to a separate physical output.
- Video Output is one dedicated audience picture, not a layered video compositor.
- Remote control belongs on a trusted LAN; token-authenticated HTTP is not an encrypted public-internet transport.
- `.dwcuepack` packages the project folder; externally linked media still needs verification.

## Development and verification

```sh
npm ci
TMPDIR=/tmp npm run dev
```

`TMPDIR=/tmp` avoids macOS UNIX-socket path-length errors when Nuxt's worker socket would otherwise use a long temporary-directory path.

```sh
TMPDIR=/tmp npm run generate
python3 -m http.server 4318 --directory .output/public
```

Use the generated preview for final verification, not a dev server while generation is rewriting Nuxt artifacts. Check desktop and mobile geometry, menu/Escape behavior, workflow and output tabs, One Shot copy, GO/reset keyboard operation, screenshot close/focus restoration, platform downloads and FAQ expansion. Verify reduced-motion and JavaScript-disabled content visibility. On shared automated browsers, bring the page to the foreground before interaction; hidden-tab animation-frame throttling can stall waits.

## Release-version and download contracts

The page fetches `/package.json` from the active host, with `2.6.16` as the checked-in fallback. Update `public/package.json`, the app fallback and Nuxt release metadata together when publishing a new app release.

| Platform | Asset names |
| --- | --- |
| macOS | `DonWells-Cue-<version>-arm64.dmg`, `-arm64.zip`, `-x64.dmg`, `-x64.zip` |
| Windows | `DonWells-Cue-Setup-<version>.exe` |
| Linux | `DonWells-Cue-<version>-x86_64.AppImage`, `-amd64.deb`, `-x86_64.rpm` |

macOS files use the site's `/downloads/` mirror. Windows and Linux use the matching `donwellsav/dwcue` GitHub release. Preserve `/install.sh` and the all-releases link. Installer binaries belong to release CI, not website deployment.

## Publishing

The checked-in GitHub Actions workflow builds a validation artifact only. **A successful build or push does not deploy the website.**

Production uses the `dwcue-web` Cloudflare Worker and the `dwcue-site` R2 bucket. Upload `.output/public` with `npx --yes wrangler@4 r2 object put --remote`:

1. Exclude `downloads/`; never overwrite release binaries during a site publish.
2. Upload assets and other dependencies before HTML; publish `index.html` last.
3. Set correct MIME types, including `image/webp`, `application/pdf`, JavaScript, CSS, JSON and fonts.
4. Use `no-cache` for HTML, `package.json`, `sitemap.xml` and `robots.txt`. Use immutable caching for hashed assets and versioned media.
5. Verify the live page, runtime version, screenshot loading, manual MIME/bytes, interactions and installer links after upload.

Worker response caching is versioned in `worker/index.js`. If that policy changes, deploy it with:

```sh
npx --yes wrangler@4 deploy --config wrangler.worker.toml --keep-vars
```

Hosting credentials remain outside the repository.

## Troubleshooting

- Old release: check live `/package.json` and confirm generated files reached R2.
- Missing installer: check the macOS R2 mirror or matching Windows/Linux GitHub release; do not rewrite links to an unrelated build.
- Missing screenshot/manual: confirm the file is under `public/`, uploaded with the correct content type, and referenced by its versioned path.
- Blank screenshot in an automated capture: wait for lazy images to load before capturing; a tall element screenshot can also include the sticky header in an artificial position. Use normal viewport screenshots for final visual evidence.
