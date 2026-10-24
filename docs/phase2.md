# Phase 2 配置指南

Phase 2 的代码已经写好。评论、浏览器后台、访问统计这三项需要你自己的账号或仓库才能真正生效，按下面的步骤填配置即可。

---

## 1. 评论

当前支持 **Giscus**（推荐，零后端）和 **Twikoo**（适合国内读者，需要自建后端）两种，在 `themes/aurora/_config.yml` 里切换。

### 方案 A：Giscus（推荐）

Giscus 把评论存在 GitHub Discussions 里，不需要服务器。

1. 把博客推到一个 **公开的 GitHub 仓库**。
2. 打开仓库的 **Settings → General → Features**，勾选 **Discussions**。
3. 安装 giscus App：<https://github.com/apps/giscus>，授权这个仓库。
4. 打开 <https://giscus.app/zh-CN>：
   - 仓库填 `你的用户名/仓库名`
   - 页面 ↔ Discussions 映射选 **pathname**
   - Discussion 分类选 **Announcements**（或自己新建一个）
   - 主题选 **preferred_color_scheme**
5. 页面会生成一段配置，复制其中的 `data-repo-id` 和 `data-category-id`。
6. 修改 `themes/aurora/_config.yml`：

```yaml
comments:
  enable: true
  provider: giscus
  giscus:
    repo: "你的用户名/仓库名"
    repo_id: "R_xxxxxxxx"
    category: "Announcements"
    category_id: "DIC_xxxxxxxx"
```

7. 重新构建：

```bash
npm run build
```

注意：Giscus 需要访客登录 GitHub 才能评论。如果你的读者大多没有 GitHub，建议用 Twikoo。

### 方案 B：Twikoo（国内读者友好）

Twikoo 支持匿名昵称和邮箱，不需要访客有 GitHub 账号，但要先部署一个后端。

1. 按官方文档部署 Twikoo 后端：<https://twikoo.js.org/>
   - 可部署到 Vercel、Zeabur、腾讯云等
   - 部署完成后会得到一个 `envId`
2. 修改配置：

```yaml
comments:
  enable: true
  provider: twikoo
  twikoo:
    env_id: "你的 envId"
    cdn: "https://unpkg.com/twikoo@2/dist/twikoo.min.js"
```

3. 重新构建。

如果 unpkg 在你所在地区不稳定，可以把 `twikoo.min.js` 下载到 `source/js/`，把 `cdn` 改成 `/js/twikoo.min.js`；也可以换成 jsDelivr：`https://cdn.jsdelivr.net/npm/twikoo@2/dist/twikoo.min.js`。

### 评论管理

- Giscus：直接在 GitHub Discussions 里回复、隐藏或删除。
- Twikoo：登录 Twikoo 管理面板审核。

---

## 2. 浏览器编辑（Pages CMS）

仓库里已经放好 `.pages.yml`。推送到 GitHub 后：

1. 打开 <https://pagescms.org/>，用 GitHub 登录。
2. 安装 Pages CMS 的 GitHub App，选择你的博客仓库。
3. 左侧会出现：
   - **文章**：新建、编辑、删除 `source/_posts/*.md`
   - **关于页**：编辑 `source/about/index.md`
4. 编辑完保存，Pages CMS 会直接提交到仓库；部署平台会自动重新构建。

字段说明：

| 字段 | 对应 Hexo front-matter |
| --- | --- |
| 标题 | `title` |
| 发布日期 | `date` |
| 分类 | `categories` |
| 标签 | `tags` |
| 封面图 | `cover` |
| 摘要 | `description` |
| 置顶 | `top` |
| 正文 | Markdown 正文 |

上传的图片会存到 `source/images/`，正文里写入 `/images/文件名`。

> 如果你不想用 Pages CMS，也可以直接在 GitHub 网页上编辑 Markdown，效果一样。

---

## 3. 访问统计

在 `themes/aurora/_config.yml` 里配置，默认关闭。

### Cloudflare Web Analytics（推荐）

1. 登录 Cloudflare Dashboard。
2. 进入 **Analytics & Logs → Web Analytics**。
3. 添加你的站点，复制 **JavaScript 令牌**。
4. 配置：

```yaml
analytics:
  enable: true
  provider: cloudflare
  cloudflare_token: "你的令牌"
```

Cloudflare Web Analytics 免费、不采集个人数据，适合个人博客。

### Umami

如果你已经部署了 Umami：

```yaml
analytics:
  enable: true
  provider: umami
  umami_script: "https://你的-umami/script.js"
  umami_website_id: "你的 website id"
```

### 自定义代码

```yaml
analytics:
  enable: true
  provider: custom
  custom_head: |
    <script>/* 你的统计代码 */</script>
```

> 统计脚本会出现在每个页面的 `<head>` 里。不要把私密令牌写进前端代码；站点 ID / 前端令牌本来就是公开的。

---

## 4. 本次新增的体验功能

- **移动端文章目录**：文章页封面下方会出现可折叠的「文章目录」，点击跳转。
- **代码块复制按钮**：鼠标移到代码块上（手机端常驻）会出现「复制」。
- **相关推荐**：优先同分类，其次同标签，再按时间补足 3 篇。
- **robots.txt**：构建时根据 `_config.yml` 的 `url` 自动生成，包含 sitemap 地址。

---

## 5. 构建与检查

```bash
npx hexo clean
npm run build
npx hexo server
```

检查清单：

- 文章页底部出现「评论」区域，未配置时显示配置提示。
- 填写评论参数并把 `enable` 改为 `true` 后，评论区能正常加载。
- 移动端文章页能看到「文章目录」。
- 代码块右上角能复制。
- `public/robots.txt` 里的 `Sitemap` 是正确域名。
- 统计脚本只在 `enable: true` 时出现。

---

## 6. 上线前还要改的

- `_config.yml` 的 `url`：改成真实域名，例如 `https://blog.example.com`。
- 打赏二维码：`source/images/donate-alipay.svg`、`donate-wechat.svg`。
- 关于页的邮箱、GitHub、微博。
- 社交分享图：目前封面是 SVG，建议上线前导出 PNG。

下一步就是 Phase 3：GitHub 仓库 + EdgeOne Pages / Cloudflare Pages 自动部署。
