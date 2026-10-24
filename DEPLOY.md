# 上线部署指南

当前状态：本地版已完成，`public/` 是可直接部署的静态站点。
推荐顺序：**EdgeOne Pages（国内访问较好）→ Cloudflare Pages（备用/全球）→ GitHub 自动部署**。

---

## 0. 上线前必须改的一处

打开 `_config.yml`，把 `url` 改成你的真实网址：

```yaml
url: https://你的域名
```

如果暂时没有独立域名，可以**先部署拿到平台分配的免费域名**，再回来改这里、重新构建并部署一次。

---

## 方案 A：EdgeOne Pages（推荐，国内访问较好）

### A1. 先把代码推到 GitHub

1. 打开 <https://github.com/new>，创建一个空仓库，例如 `aurora-blog`。
   - 不要勾选 “Add a README file” / “Add .gitignore”，保持空仓库。
   - 公开或私有都可以；公开更简单。
2. 在本地执行（把 `<用户名>` 换成你的 GitHub 用户名）：

```bash
cd blog
git remote add origin https://github.com/<用户名>/aurora-blog.git
git push -u origin main
```

### A2. 在 EdgeOne Pages 导入仓库

1. 打开 <https://pages.edgeone.ai/>，登录腾讯云账号。
2. 进入控制台 → **Pages / Makers** → 新建项目 → **导入 Git 仓库**。
3. 授权 GitHub，选择刚创建的 `aurora-blog` 仓库。

### A3. 构建配置

| 配置项 | 填写 |
| --- | --- |
| 框架预设 | Hexo |
| 构建命令 | `npm run build` |
| 输出目录 | `public` |
| Node 版本 | 20 或 22 |

点击部署，等待 1–2 分钟。

### A4. 拿到免费域名

部署成功后会得到一个类似 `https://xxxx.edgeone.app` 的地址。
把这个地址填回 `_config.yml` 的 `url`，然后：

```bash
npm run build
git add -A
git commit -m "Set site url"
git push
```

平台会自动重新构建。

### A5. 绑定自己的域名（可选）

- 在 EdgeOne Pages 项目里添加自定义域名，按提示配置 CNAME。
- 如果只使用海外/全球节点，通常不需要备案。
- 如果要启用**中国大陆节点加速**，域名需要完成 ICP 备案。
- 免费证书由平台自动签发。

---

## 方案 B：Cloudflare Pages

### B1. Git 集成（推荐长期使用）

1. 打开 <https://dash.cloudflare.com/> → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
2. 选择 `aurora-blog` 仓库。
3. 构建配置：
   - Framework preset: **Hexo**
   - Build command: `npm run build`
   - Build output directory: `public`
   - 环境变量：`NODE_VERSION = 20`
4. 部署完成后得到 `https://xxxx.pages.dev`。

### B2. 命令行直接上传（不接 Git）

本机已经装了 `wrangler`：

```bash
wrangler login
wrangler pages project create aurora-blog
wrangler pages deploy public --project-name aurora-blog --branch main
```

> `aurora-blog` 这个项目名如果已被占用，换一个带后缀的名字。
> 直传项目后续更新需要重新执行 `npm run build` + `wrangler pages deploy`，不会自动构建。

国内访问 `*.pages.dev` 可能偏慢，建议作为备用镜像。

---

## 方案 C：最快上线（直接上传，不用 Git）

仓库里已经准备好 `aurora-blog-public.zip`，内容是 `public/` 里的全部文件。

1. 打开 <https://pages.edgeone.ai/> 并登录。
2. 在控制台创建项目，选择 **Upload / Drop（直接上传）** 方式（如果当前账号界面提供该入口）。
3. 上传 `aurora-blog-public.zip`，或直接拖入 `public/` 文件夹。
4. 部署完成后拿到免费域名。

以后每次更新：

```bash
npm run build
```

然后重新压缩 `public/` 并上传。

---

## 上线后检查清单

- [ ] 首页、文章页、关于页、归档页能正常打开
- [ ] 手机 4G/5G 访问正常，没有横向滚动
- [ ] 深色模式切换正常
- [ ] 搜索能返回结果
- [ ] `/404.html` 能显示自定义 404
- [ ] `/atom.xml`、`/sitemap.xml`、`/robots.txt` 可访问
- [ ] `_config.yml` 的 `url` 已改成真实域名
- [ ] 分享卡片（OG image）显示正常；当前封面是 SVG，建议换成 PNG
- [ ] 评论、统计等后续功能按需接入

## 常见问题

**构建失败：`hexo: not found`**
把构建命令改成 `npm run build`，不要直接写 `hexo generate`。

**构建失败：Node 版本过低**
在平台环境变量里设置 `NODE_VERSION=20`。

**页面样式没更新**
平台/浏览器缓存，强制刷新；或给 CSS 链接加版本号。

**域名打不开**
检查 DNS 是否生效；国内节点需要备案；HTTPS 证书是否签发完成。

**GitHub 推送慢**
可以先用方案 C 直接上传，之后再补 Git 自动部署。

## 安全提醒

- 不要把 GitHub Token、Cloudflare API Token、腾讯云密钥写进仓库。
- 打赏二维码、邮箱、社交链接目前是占位内容，上线前替换。
- 公开站点请遵守内容与版权相关规定。
