---
title: 从零搭建一个免费个人博客：完整流程
date: 2026-10-21 20:00:00
updated: 2026-10-23 09:20:00
categories:
  - 技术
tags:
  - Hexo
  - 建站
  - 教程
cover: /images/cover-2.svg
description: 用 Hexo + EdgeOne Pages / Cloudflare Pages，零成本搭一个可自定义、公网可访问的个人博客。
top: true
---

> 这是一篇示例教程，用来展示本站的排版效果。文中的流程是真实可用的，你可以直接照着做。

很多人以为做一个自己的网站需要买服务器、学前端、办备案。其实对一个个人博客来说，最省事也最省钱的路线是：**静态生成 + 免费托管 + 自己的域名（可选）**。

这套方案的总成本可以做到 **0 元**，而且访问速度、稳定性和可维护性都不差。

## 为什么选择静态博客

静态博客的做法是：你写 Markdown，构建工具把它编译成 HTML，托管平台只负责把这些 HTML 文件发给访客。

| 对比项 | 静态博客 | 传统 WordPress |
| --- | --- | --- |
| 服务器 | 不需要 | 需要 PHP + MySQL |
| 费用 | 0 元起 | 域名 + 主机，每年约 100–300 元 |
| 安全 | 没有后台和数据库，攻击面小 | 插件漏洞、后台爆破 |
| 速度 | 纯静态，CDN 友好 | 取决于主机和插件 |
| 迁移 | 一个 Git 仓库带走 | 要导出数据库和附件 |

代价是：没有现成的后台，发文章要走 Git 或接一个 Git CMS。对愿意写 Markdown 的人来说，这反而是优点。

<div class="note"><strong>提示：</strong>如果你完全不想碰命令行，可以先看文末的「不写代码的编辑方式」，用浏览器后台发文章。</div>

## 一、准备工具

只需要两样东西：

1. **Node.js**：Hexo 的运行环境，建议安装 LTS 版本
2. **Git**：用来管理文章和触发自动部署

安装完成后，打开终端检查：

```bash
node -v
npm -v
git --version
```

能看到版本号就说明准备好了。

## 二、创建项目

找一个空目录，执行：

```bash
npx hexo init my-blog
cd my-blog
npm install
```

Hexo 会生成一个基础站点。目录结构大概是这样：

```text
my-blog/
├── source/
│   └── _posts/        # 文章都放在这里
├── themes/            # 主题
├── scaffolds/         # 新文章模板
├── _config.yml        # 站点配置
└── package.json
```

启动本地预览：

```bash
npx hexo server
```

浏览器打开 `http://localhost:4000`，能看到默认页面就成功了。

## 三、套用主题

Hexo 的主题放在 `themes/` 目录下，然后在 `_config.yml` 里指定：

```yaml
theme: aurora
```

一个主题通常包含这些部分：

- `layout/`：页面模板，决定 HTML 结构
- `source/css/`：样式
- `source/js/`：交互脚本
- `_config.yml`：主题自己的配置，比如导航、侧栏、打赏

> 选主题时不用追求功能最多。先看文章页的阅读体验，再看移动端，最后才看花哨的特效。

如果你想让版式接近某个喜欢的网站，可以把它的结构拆成几个模块：导航、文章头、正文、侧栏、推荐、页脚，然后逐个实现。**参考结构，不要复制素材和代码。**

## 四、写第一篇文章

执行：

```bash
npx hexo new post "我的第一篇文章"
```

Hexo 会在 `source/_posts/` 下生成一个 Markdown 文件。打开它，在 `---` 之间填写元信息：

```yaml
---
title: 我的第一篇文章
date: 2026-10-24 10:00:00
categories:
  - 随笔
tags:
  - 开始
cover: /images/cover-1.svg
---
```

正文直接写 Markdown。常用的语法就几个：`##` 二级标题、`**加粗**`、`-` 列表、`>` 引用、三个反引号包代码。

## 五、部署上线

静态站点可以托管在很多地方。推荐两个对个人博客友好的免费平台：

<div class="download-box">
<p><strong>部署入口</strong>（都有免费套餐，任选其一即可）</p>
<p><a class="btn btn-primary" href="https://pages.edgeone.ai/" target="_blank" rel="noopener">EdgeOne Pages</a> <a class="btn btn-ghost" href="https://pages.cloudflare.com/" target="_blank" rel="noopener">Cloudflare Pages</a></p>
</div>

大致流程都一样：

1. 把项目推到 GitHub 仓库
2. 在托管平台选择「导入 Git 仓库」
3. 构建命令填 `hexo generate`，输出目录填 `public`
4. 点击部署，等一两分钟
5. 拿到一个免费域名，比如 `yourname.edgeone.app`

之后每次 `git push`，平台会自动重新构建并发布，不需要手动上传。

| 平台 | 免费额度 | 国内访问 | 自定义域名 |
| --- | --- | --- | --- |
| EdgeOne Pages | 免费套餐 | 通常较好 | 支持，大陆加速需备案 |
| Cloudflare Pages | 每月 500 次构建 | 一般，晚高峰可能慢 | 支持 |
| GitHub Pages | 每月 100GB 流量 | 较慢 | 支持 |

## 六、域名与备案

免费的二级域名已经足够让所有人访问。如果想让网址更好记，可以买一个独立域名，常见的 `.com` 首年大约 60–90 元。

需要注意：

- 域名解析到海外平台，**不需要备案**
- 使用中国大陆的服务器或 CDN 节点，**需要 ICP 备案**
- 备案本身免费，但需要身份证、接入商和一段时间审核

<div class="note"><strong>建议：</strong>先用免费二级域名把站跑起来，确认自己真的会长期写，再考虑买域名和备案。不要一开始就为「可能用得上」的东西付费。</div>

## 不写代码的编辑方式

如果不想每次都用命令行，可以接一个 Git CMS，比如 Pages CMS 或 Decap CMS。它们在浏览器里提供表单式编辑器，保存后自动提交到仓库，手机也能发文章。

另一种更轻的办法是直接在 GitHub 网页上编辑 Markdown 文件。改完提交，部署平台会自动构建。

## 总结

整套流程可以压缩成一句话：

**Markdown 写内容，Hexo 生成页面，Git 管理版本，免费平台负责托管。**

前期花一两个小时把架子搭好，后面就可以专心写东西了。
