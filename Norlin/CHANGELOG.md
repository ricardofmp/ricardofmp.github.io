## [1.1.0] - 2026-03-11

### ⚡ Astro v6 Upgrade

- Upgraded to **Astro 6.0** with Vite 7 under the hood
- Migrated font loading to the new built-in **Fonts API** (`fontProviders.fontsource()`)
- Replaced `@fontsource/inter` npm package with Astro's native font optimization
- Added `<Font />` component in layout for automatic preload hints and optimized fallbacks
- Updated `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss` to latest versions compatible with Astro 6
- Fixed TypeScript error: removed deprecated `api: 'modern-compiler'` from SCSS preprocessor options (now default in Vite 7)
- Updated font references in `_variables.scss` to use CSS custom property `var(--font-inter)`

## [1.0.1] - 2026-02-02

### Improved: Search

#### Changed files:
- pages/index.astro
- pages/search.json.ts
- pages/posts/[page].astro
- tags/[id]/[page].astro
- tags/[id]/index.astro

## [1.0.0] - 2026-01-23

- Initial Release