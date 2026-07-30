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

编辑 `themes/vitopia/_config.yml`：

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
