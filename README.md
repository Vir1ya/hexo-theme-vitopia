# Vitopia

A minimalist, serif-first Hexo theme with dark mode, local search, and a Konami-code pixel art easter egg.

![](https://picsum.photos/id/64/800/400)

## Features

- **Serif-first typography** — Times New Roman / Noto Serif SC, 18px base, generous line-height
- **Dark mode** — CSS-variable driven, persisted in localStorage, follows system preference
- **Local search** — pre-generated `search.json`, overlay with keyboard navigation
- **Pixel easter egg** — press `↑↑↓↓←→←→` `b` `a` to toggle pixel-art mode
- **Homepage banner** — radial gradient backdrop with slanted/curved bottom, pixelated staircase in pixel mode
- **Image rows** — consecutive images auto-flow into centered flex rows, wrap on overflow
- **Back to top** — scroll-aware button, pixel-styled in pixel mode
- **Code blocks** — line numbers, copy button with language label, warm syntax highlighting
- **Cover image** — per-post cover image support via front-matter
- **i18n** — zh-CN / en
- **Responsive** — mobile-friendly layout
- **No jQuery** — vanilla JS only

## Quick Start

```bash
cd your-hexo-blog
git clone https://github.com/Vir1ya/hexo-theme-vitopia themes/vitopia
```

Then edit `_config.yml`:

```yaml
theme: vitopia
```

```bash
hexo server
```

## Configuration

Edit `themes/vitopia/_config.yml`:

```yaml
# Navigation
menu:
  Home: /
  Archives: /archives
  About: /about

# Author (shown in footer)
author: Your Name
since: 2024          # optional, footer shows "2024–2026"

# Homepage bio
avatar: /images/avatar.png   # optional
bio: 写代码，偶尔写文章。
email: me@example.com        # optional, shown as email icon

# Social icons (shown on homepage)
social:
  github: https://github.com/yourname
  twitter: https://twitter.com/yourname
  bilibili: https://space.bilibili.com/yourid
  telegram: https://t.me/yourname
  weibo: https://weibo.com/yourname

# Features
search: true          # local search
dark_mode: true       # dark mode toggle button
code_copy: true       # code block copy button
```

### About Page

```bash
hexo new page about
```

Then edit `source/about/index.md`.

### Cover Image

Add a `cover` field to your post's front-matter:

```yaml
---
title: My Post
cover: /images/cover.jpg
---
```

Place images in `source/images/` and reference them as `/images/filename.jpg`. External URLs also work.

## Pixel Mode

Press `↑ ↑ ↓ ↓ ← → ← →` `b` `a` (the Konami code) to toggle pixel art mode.

Pixel mode uses the **Silver** pixel font by [Poppy Works](https://poppyworks.itch.io/silver) (CC BY 4.0). Download `Silver.ttf` and place it at:

```
themes/vitopia/source/fonts/Silver.ttf
```

If the font is missing, it falls back to **Press Start 2P** (Google Fonts, loaded automatically).

## Browser Support

All modern browsers (Chrome, Firefox, Safari, Edge).

## License

GPL-3.0
