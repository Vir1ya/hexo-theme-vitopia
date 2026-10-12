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
