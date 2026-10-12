# Repository Guidelines

## Project Structure & Module Organization

Vitopia is a Hexo theme installed in a site's `themes/vitopia/` directory. EJS templates live in `layout/`, with shared fragments in `layout/_partial/`. Stylus files live in `source/css/`; `style.styl` imports variables, base styles and partials. Browser behavior lives in `source/js/main.js`. Hexo helpers and generators belong in `scripts/`, reusable review utilities in `lib/`, translations in `languages/`, and theme defaults in `_config.yml`.

## Build, Test, and Development Commands

The theme has no standalone npm scripts, test runner or lint configuration. Install it in a separate Hexo test site and run commands from that site's root:

```bash
npx hexo clean && npx hexo generate # rebuild the test site
npx hexo server                    # preview at http://localhost:4000
```

Keep test posts, covers and site configuration in the test site. Validate generator changes after a clean build; template and style changes usually update through the development server.

## Coding Style & Naming Conventions

Use two-space indentation and preserve existing JavaScript semicolons. Use descriptive lowercase filenames. Reuse `--color-*`, `--font-*` and `--spacing-*` variables from `source/css/_variables.styl`. Import new Stylus partials through `style.styl`. Add interface strings to both `languages/en.yml` and `languages/zh-CN.yml`.

## Testing Guidelines

Check affected pages at desktop and mobile widths, in light and dark mode. Verify search, archives, pagination, music and review filters where relevant. Hidden reviews must retain search entries and article routes without creating empty list pages. Check generated `search.json` after search-helper changes. No coverage threshold is configured.

## Commit & Pull Request Guidelines

Use focused commits with concise scope summaries, such as `[琉璃集] 新增作品评价页`. Describe visible behavior, configuration changes and validation in pull requests; link related issues and include screenshots for layout changes. Document new CDN dependencies.

## Theme Distribution

Keep this repository limited to reusable theme source, documentation and licensing. Put personal author details, contact information and social links in a site's `_config.vitopia.yml`. Exclude local agent settings, private credentials, article content and generated sites. Preserve GPL-3.0 licensing and project attribution.
