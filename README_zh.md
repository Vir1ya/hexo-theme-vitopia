# Vitopia

一款极简、衬线优先的 Hexo 主题，支持暗色模式和本地搜索。

[English](README.md)

## 快速开始

```bash
cd your-hexo-blog
git clone https://github.com/Vir1ya/hexo-theme-vitopia themes/vitopia
```

修改 Hexo 根目录的 `_config.yml`：

```yaml
theme: vitopia
```

然后：

```bash
hexo server
```

## 配置

在 Hexo 博客根目录创建 `_config.vitopia.yml`，填写你的站点设置。主题默认配置不包含站点所有者的个人资料；将覆盖配置放在主题外，更新主题时也能保留：

```yaml
# 导航菜单
menu:
  Home: /
  Archives: /archives
  About: /about

# 作者名（页脚展示）
author: 你的名字
since: 2024          # 可选，页脚显示 "2024–2026"

# 首页个人介绍
avatar: /images/avatar.png   # 可选，头像路径
bio: 写代码，偶尔写文章。
email: me@example.com        # 可选，显示邮箱图标

# 首页社交图标
social:
  github: https://github.com/yourname
  twitter: https://twitter.com/yourname
  bilibili: https://space.bilibili.com/yourid
  telegram: https://t.me/yourname
  weibo: https://weibo.com/yourname

# 公告（显示在首页个人信息下方，留空则隐藏）
announcement:

# 功能开关
search: true          # 本地搜索
dark_mode: true       # 暗色模式切换按钮
code_copy: true       # 代码块复制按钮
```

### 关于页面

```bash
hexo new page about
```

编辑 `source/about/index.md` 即可。

### 文章封面图

在 front-matter 中指定：

```yaml
---
title: 文章标题
date: 2026-01-01
cover: /images/cover.jpg
---
```

### 文章音乐

在文章 front matter 中加入 `music` 配置。播放器默认收起，读者点击后展开：

```yaml
music:
  server: netease
  type: song
  id: 2691385220
  autoplay: false
```

也支持使用 `url`、`title`、`artist` 和可选的 `cover` 配置直链音频。播放器依赖 CDN 提供的 APlayer 与 MetingJS。

## 浏览器支持

支持所有现代浏览器（Chrome、Firefox、Safari、Edge）。

## 协议

GPL-3.0

## 琉璃集

在博客根目录的 `_config.vitopia.yml` 中启用（默认为关闭）：

```yaml
reviews:
  enable: true
  path: reviews
```

主题自动生成 `/reviews/` 并添加导航，不需要 `hexo new page reviews`。路径可改为其他相对目录；不能与已有页面重名。已有同地址导航不会重复添加。支持 `zh-CN`、`en`，并接受 `ch` 作为中文配置别名。

每篇评价都是一篇正常文章。在 `source/_posts/` 添加作品资料即可：

```yaml
---
title: 少女革命：关于选择与自由
date: 2026-10-11 12:00:00
tags: [琉璃集]
work:
  title: 少女革命
  type: anime
  year: 1997
  cover: https://example.com/utena.jpg
  meta: 几原邦彦 · 39 集 · 象征主义 / 百合 / 心理
  synopsis: 一位想成为王子的少女，在蔷薇与决斗之间寻找自己的答案。
  review: '**很想推荐。** 我喜欢它把选择权交还给角色。'
  sources:
    - label: Bangumi
      url: https://bgm.tv/subject/1453
  pinned: false
  listed: false
---
```

完整评价写在 front matter 后的 Markdown 正文中。`work.cover` 与文章的 `cover` 分开设置，作品封面支持 http(s) 和 `/images/…` 路径；缺图显示占位。简介按纯文本显示；短评支持 `**加粗**`、`*斜体*`、换行和 `[链接](https://…)`，原始 HTML 不执行。来源可添加多个 `{label, url}`，也支持 URL 字符串。

`type` 可选 `anime`（动画）、`manga`（漫画）、`game`（游戏）、`literature`（文学）、`other`（其他）。琉璃集置顶优先，然后按文章 `date` 倒序。`listed` 默认 `false`，仅显式设为 `true` 才进入普通文章列表；默认从首页、归档、标签和分类列表隐藏，仍保留琉璃集、站内搜索和文章直达链接。关闭整个琉璃集功能后恢复普通列表行为。

主题构建与访问不获取外部资料，无需后台或新增 CDN。Bangumi、豆瓣、Wikipedia 来源链接用于标注引用，资料可以手写，也可由兼容的外部编辑器导入；主题本身不附带后台工具。引用资料请保留来源，个人短评自己撰写。

作品文章和封面文件放在你的 Hexo 站点中，分别使用 `source/_posts/` 和 `source/images/`。运行 `hexo generate` 后会生成作品页；主题仓库不包含个人文章、测试站或封面素材。

### 画廊

画廊是与归档、关于并列的独立页面，地址为 `/gallery/`，启用后自动出现在顶部导航中，不依赖琉璃集开关。如果菜单已有 `/gallery/` 链接，不会重复添加。在站点 `_config.vitopia.yml` 中配置图片；本地文件放在站点 `source/images/gallery/`。支持 http(s) 地址及可选的 `alt`、`caption`、`text`，也支持直接填写图片 URL。页面最大宽度为 1280px，瀑布流列数随可用宽度自动调整，图片保持原比例。点击图片打开大图查看窗口，可按 Esc、点击关闭按钮或窗口外侧返回画廊；窗口也提供原图文件链接。默认关闭；设置 `gallery.enable: true` 启用。不需要手动创建同地址页面，已有页面占用此地址时构建会提示冲突。

```yaml
gallery:
  enable: true
  images:
    - src: /images/gallery/photo.jpg
      alt: Image description
      caption: Hover description
      text: |
        ## 作者的话

        **这是一段感想。**

        - 一个片段
        - 一个回忆
      tags: [Travel, Nature]
```

每张图片可配置多个 `tags`，画廊顶部自动生成可多选的标签筛选，仅显示同时包含所有已选标签的图片（交集匹配）。再次点击标签取消选择，点击“全部”清空选择并显示所有图片。标签按文字显示并自动去重，未设置标签的图片仍出现在全部列表中。

`caption` 是悬浮描述：鼠标悬浮或键盘聚焦时，整张缩略图变暗，描述以白字浮在图片上；触摸设备直接在缩略图下方显示描述。`text` 是作者文字：仅在打开大图后显示在图片下方，支持 Markdown 标题、加粗、斜体、列表、引用、链接、代码块和表格。通过站点的 `hexo-renderer-marked` 渲染并清理危险 HTML，不改变普通文章的渲染配置，无新增 CDN。两者独立填写，留空则隐藏；原有 `caption` 配置继续作为悬浮描述。`alt` 仍是图片替代文本，用于无障碍阅读及图片加载失败的情况。
