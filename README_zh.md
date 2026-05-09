# Vitopia

一款极简、衬线优先的 Hexo 主题，支持暗色模式、本地搜索，以及 Konami 密码触发的像素艺术彩蛋。

![](https://picsum.photos/id/64/800/400)

## 特性

- **衬线优先排版** — Times New Roman / Noto Serif SC，18px 基础字号，宽裕的行高
- **暗色模式** — CSS 变量驱动，localStorage 持久化，跟随系统偏好
- **本地搜索** — 预生成 `search.json`，弹窗式搜索，支持键盘上下选择
- **像素彩蛋** — 按下 `↑↑↓↓←→←→` `b` `a` 进入像素艺术模式，再次按下退出
- **首页横幅** — 径向渐变背景，底部弧线收尾，像素模式下阶梯状底边
- **图片自动排列** — 连续多图自动居中并排，超宽自动换行
- **回到顶部** — 滚动显示，像素模式同步像素化
- **代码块增强** — 行号、语言标签 + 复制按钮、暖色语法高亮
- **文章封面图** — 通过 front-matter 为文章设置封面图
- **国际化** — 中文 / 英文
- **响应式** — 移动端适配
- **零依赖** — 无 jQuery，纯原生 JS

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

## 像素模式

按下 Konami 密码 `↑ ↑ ↓ ↓ ← → ← →` `b` `a` 即可进入像素模式。

像素模式使用 [Poppy Works](https://poppyworks.itch.io/silver) 设计的 **Silver** 像素字体（CC BY 4.0 协议）。请下载 `Silver.ttf` 并放到：

```
themes/vitopia/source/fonts/Silver.ttf
```

如果没有放置字体文件，会自动回退到 **Press Start 2P**（Google Fonts 自动加载）。

## 浏览器支持

支持所有现代浏览器（Chrome、Firefox、Safari、Edge）。

## 协议

GPL-3.0
