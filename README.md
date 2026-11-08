# Vitopia

A minimalist, serif-first Hexo theme with dark mode and local search.

[中文](README_zh.md)

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

Create `_config.vitopia.yml` in your Hexo site root for personal settings. The theme defaults contain no site owner details; keeping overrides outside the theme also preserves them during updates:

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

# Announcement (shown below the homepage profile, leave empty to hide)
announcement:

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

### Article Music

Add a `music` block to a post's front matter. The player stays collapsed until the reader opens it.

```yaml
music:
  server: netease
  type: song
  id: 2691385220
  autoplay: false
```

Direct audio URLs are also supported with `url`, `title`, `artist`, and an optional `cover` field. Music playback uses APlayer and MetingJS from a CDN.

## Browser Support

All modern browsers (Chrome, Firefox, Safari, Edge).

## License

GPL-3.0

## Liuli Collection (work reviews)

Enable the optional page in the site's `_config.vitopia.yml`:

```yaml
reviews:
  enable: true
  path: reviews
```

The page is named “Liuli Collection” (“琉璃集” in Chinese). Vitopia generates `/reviews/` and adds its navigation link automatically. Do not create a page at the same route. `path` accepts a relative directory. Existing navigation links to that route are not duplicated. The feature defaults to disabled.

Reviews are ordinary Markdown posts with a `work` front matter object:

```yaml
---
title: My thoughts on a work
date: 2026-10-11 12:00:00
work:
  title: Work title
  type: anime
  year: 1997
  cover: https://example.com/cover.jpg
  meta: Creator · 39 episodes · Themes
  synopsis: A plain-text introduction.
  review: '**Recommended.** A personal impression with *emphasis*.'
  sources:
    - label: Bangumi
      url: https://bgm.tv/subject/1453
  pinned: false
  listed: false
---
```

Write the full review in the post body. Work covers are independent of post covers. They accept http(s) URLs or `/images/…` paths, with a placeholder when unavailable. Short reviews support bold, italic, line breaks and Markdown links; raw HTML is escaped. Sources accept `{label, url}` objects or URL strings and open separately from the article link.

Types: `anime`, `manga`, `game`, `literature`, `other`. Pinned items come first, followed by descending post publication dates. `listed` defaults to `false`; only explicit `true` adds a review to ordinary lists. The default excludes a review from home, archives, tag and category lists while keeping its article route, work page entry and search result. Disabling the feature restores ordinary listing behavior.

The theme builds offline and needs no administration app or new CDN. Metadata can be entered manually or imported with a compatible external editor; no editor is bundled with the theme. Keep reference links when using imported descriptions and write your own impressions. English and Simplified Chinese are supported; `ch` is accepted as an alias for Chinese when reviews are enabled.

### Writings (your own novels)

Posts with a `novel` front matter object are listed separately from reviews. When any exist, the collection shows two tabs, Reviews and Writings, the latter at `/reviews/novels/` (configurable via `reviews.novels_path`). Writings are organised as book → part → chapter. Fields: `book` (chapters with the same book name form one book), `part` (chapters with the same part name form one part; omitted parts become "Contents"), `order` (book-wide chapter order; parts follow their first chapter), part-level `part_synopsis` and `part_id`, and book-level `cover`, `synopsis`, `status` (`serial`, `finished`, `short`), `pinned`, `listed`, `id`, which may be written on any chapter. Each book shows only its cover, synopsis and an Open button, so the shelf does not grow with the number of parts. The dialog lists the book's parts; choosing one shows its chapters, with a way back to the part list. Single-part books open straight to their chapters. Books and parts have no routes of their own, and chapters keep their post URLs. `#<part id>` opens a part's contents directly; chapter pages link back there, with previous/next navigation running across parts.

### Gallery

The standalone `/gallery/` page appears in the top navigation alongside Archives and About when enabled, independently of reviews. Existing menu links to `/gallery/` are not duplicated. Configure images in your site’s `_config.vitopia.yml`, using local files under `source/images/gallery/` or http(s) URLs. Entries accept optional `alt`, `caption` and `text`, or a plain image URL. The gallery expands up to 1280px with responsive masonry columns and preserves image aspect ratios. Click images to open a large-image dialog; close it with Escape, the Close button or the backdrop. A separate link opens the original image file. Disabled by default; set `gallery.enable: true` to enable. Do not create another page at this route; existing page conflicts cause a build error.

```yaml
gallery:
  enable: true
  images:
    - src: /images/gallery/photo.jpg
      alt: Image description
      caption: Hover description
      text: |
        ## A note from the author

        **A moment to remember.**

        - A detail
        - A memory
      tags: [Travel, Nature]
```

Each image accepts multiple `tags`. Gallery filters support selecting multiple tags and match images containing all selected tags (intersection). Click a selected tag to deselect it; All clears every selection and also shows untagged images. Labels are escaped as text and deduplicated.

`caption` is the hover description, shown in white over a full-image dark overlay on hover or keyboard focus (displayed below thumbnails on touch devices). `text` is separate author text shown beneath the opened image; it supports Markdown headings, emphasis, lists, quotes, links, fenced code and tables. The site’s existing `hexo-renderer-marked` renders and sanitizes this text without changing article rendering or adding a CDN. Empty fields are hidden. Existing captions remain hover descriptions. `alt` stays independent as accessible alternative text.
