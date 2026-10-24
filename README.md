# 我的博客 · Aurora

一个用 [Hexo 7](https://hexo.io/zh-cn/) + 自研 Aurora 主题搭建的静态个人博客。

**线上地址：<https://defenderzero.github.io/cguoblog/>**

当前已上线 GitHub Pages：推送 `main` 后由 GitHub Actions 自动构建部署。
评论（Giscus / Twikoo）、Pages CMS 浏览器编辑、访问统计的代码已经接好，按 [docs/phase2.md](docs/phase2.md) 填参数即可启用。

## 快速开始

```bash
cd blog
npm install
npx hexo server
```

打开 <http://127.0.0.1:4000/cguoblog/>（GitHub Pages 项目页使用 `/cguoblog/` 子路径）。

## 目录结构

```text
blog/
├── _config.yml              # 站点配置：标题、作者、URL、分页、插件
├── .pages.yml               # Pages CMS 浏览器编辑配置
├── package.json             # 依赖和命令
├── scripts/                 # 构建脚本：相关推荐、robots.txt
├── docs/phase2.md           # 评论 / 后台 / 统计配置指南
├── scaffolds/               # 新文章模板
├── source/
│   ├── _posts/              # 所有文章（Markdown）
│   ├── about/               # 关于页
│   ├── search/              # 搜索页
│   ├── images/              # 封面、头像、收款码等图片
│   └── 404.md               # 404 页面
└── themes/aurora/
    ├── _config.yml          # 主题配置：导航、侧栏、打赏、评论、统计
    ├── layout/              # EJS 模板
    └── source/
        ├── css/style.css    # 全部样式（含深色模式、响应式）
        └── js/main.js       # 交互：菜单、搜索、目录、灯箱、弹窗、代码复制
```

## 常用命令

```bash
npx hexo server     # 本地预览（改文件会自动刷新）
npx hexo generate   # 生成静态文件到 public/
npx hexo clean      # 清空缓存和 public/
npx hexo new post "文章标题"
```

## 写一篇文章

```bash
npx hexo new post "我的新文章"
```

然后编辑 `source/_posts/我的新文章.md`：

```yaml
---
title: 我的新文章
date: 2026-10-24 10:00:00
categories:
  - 技术
tags:
  - 标签一
  - 标签二
cover: /images/cover-1.svg
description: 一句话摘要，会用于首页卡片和 SEO。
top: true
---

正文从这里开始。
```

- `cover` 是封面图路径，图片放在 `source/images/`。
- `top: true` 会让文章进入侧栏「热门」。
- 二级标题用 `##`，三级标题用 `###`，右侧目录会自动生成。

## 修改站点信息

编辑 `_config.yml`：

```yaml
title: 我的博客
subtitle: 记录 · 分享 · 思考
description: 一句话介绍
author: 博主
url: https://example.com   # 上线前改成真实域名
```

## 修改导航、侧栏、打赏

编辑 `themes/aurora/_config.yml`：

- `menu`：顶部导航
- `sidebar`：侧栏模块开关
- `donate`：打赏开关和收款码路径
- `links`：友情链接

## 替换图片

`source/images/` 下目前是自制占位图：

| 文件 | 用途 |
| --- | --- |
| `cover-1.svg` ~ `cover-5.svg` | 示例封面 |
| `cover-default.svg` | 默认封面 |
| `avatar.svg` | 头像 |
| `favicon.svg` | 浏览器图标 |
| `donate-alipay.svg` | 支付宝收款码占位 |
| `donate-wechat.svg` | 微信收款码占位 |

直接把同名文件替换成自己的图片即可；如果用 `.jpg` / `.png`，记得同步修改文章 front-matter 和主题配置里的路径。

## Phase 2 配置

评论、浏览器后台、访问统计的详细步骤见 [docs/phase2.md](docs/phase2.md)。

- 评论：在 `themes/aurora/_config.yml` 填 Giscus 或 Twikoo 参数，`comments.enable` 改为 `true`
- 后台：推送到 GitHub 后，用 [Pages CMS](https://pagescms.org/) 打开仓库即可编辑文章
- 统计：填 Cloudflare Web Analytics 令牌或 Umami 配置，`analytics.enable` 改为 `true`

## 构建与部署

当前使用 **GitHub Actions → GitHub Pages** 自动部署：

- 仓库：<https://github.com/defenderzero/cguoblog>
- 工作流：`.github/workflows/deploy.yml`
- 触发：推送到 `main`
- 线上：<https://defenderzero.github.io/cguoblog/>

本地构建：

```bash
npm run build
```

生成结果在 `public/`。

> GitHub Pages 项目页在 `/cguoblog/` 子路径下，`_config.yml` 的 `url` 和 `root` 已按此设置。
> 如果以后迁移到 EdgeOne Pages / Cloudflare Pages 的根域名，需要把 `root` 改回 `/`，并同步修改 `url`。

## 当前占位项

- 评论：代码已接入，默认关闭；按 `docs/phase2.md` 填参数后启用
- 统计：代码已接入，默认关闭
- 浏览器编辑：`.pages.yml` 已配置，推送到 GitHub 后可在 Pages CMS 使用
- 打赏：二维码是占位图
- 域名：当前使用 GitHub Pages 免费域名 `defenderzero.github.io/cguoblog`；尚未绑定独立域名
- 社交链接、邮箱：关于页里是占位内容
- 社交分享图：当前封面是 SVG，部分平台不显示，上线前建议导出 PNG

## 说明

本站文章、图片和代码均为示例或自制内容，可自由替换。
