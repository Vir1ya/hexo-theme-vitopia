# Repository Guidelines

## Project Structure & Module Organization

This repository is `hexo-theme-vitopia`, a Hexo theme intended to live under a Hexo site's `themes/vitopia/` directory. Top-level layouts are in `layout/` (`index.ejs`, `post.ejs`, `page.ejs`, archive views), with reusable fragments under `layout/_partial/`. Styles live in `source/css/`; `style.styl` is the only Stylus entry point and imports variables, base rules, partials, and dark mode. Browser behavior is in `source/js/main.js`. Hexo helpers and generators are in `scripts/helpers.js`. Translations are in `languages/en.yml` and `languages/zh-CN.yml`. Theme defaults are in `_config.yml`.

## Build, Test, and Development Commands

This theme has no local npm scripts, test suite, or lint configuration. Develop it inside a real Hexo blog that uses the theme.

```bash
cd /home/link/Documents/blog/Blog
hexo clean && hexo generate   # rebuild public/ with fresh theme output
hexo server                    # preview at http://localhost:4000
```

Stylus and EJS changes are usually picked up by `hexo server`. Changes in `scripts/helpers.js` should be checked after `hexo clean`.

## Coding Style & Naming Conventions

Follow existing EJS, Stylus, and plain JavaScript patterns. Use two-space indentation in templates and scripts where the surrounding file does. Prefer theme variables from `source/css/_variables.styl` such as `--color-*`, `--font-*`, and `--spacing-*` instead of hard-coded colors or spacing. Add new Stylus partials only when they have a clear responsibility, and import them from `source/css/style.styl`. User-facing strings should use translation keys and be added to both language YAML files.

## Testing Guidelines

There are no automated tests. Validate changes by generating the host Hexo site and manually checking affected pages in the browser, including light/dark mode, mobile width, search, post pages, and the archive timeline. For helper changes, confirm generated files such as `/search.json` are correct.

## Commit & Pull Request Guidelines

Recent commits use concise Chinese scope prefixes, for example `[保存为图片] 新增 html2canvas 文章长图功能`, with occasional release commits such as `Initial release: Vitopia v1.0.0`. Keep commits focused and describe the visible behavior changed.

Pull requests should include a short summary, linked issue when applicable, manual verification steps, and screenshots or recordings for visual changes. Note any configuration changes in `_config.yml` and any new external CDN or asset dependency.

## Agent-Specific Instructions

This repository is the theme only; avoid adding project-level Hexo site content here unless explicitly requested.
