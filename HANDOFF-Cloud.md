# Asia Vision 视觉改版交接给 Cloud

交接方：Karina（原 Danny）→ Cloud  
工作区：`/workspace/asiavision-visual/`  
日期：2026-11-05  
语言：请用简体中文与 David 沟通。

## 硬性约束（必须遵守）

1. **只改草稿**：工作目录是 `/workspace/asiavision-visual/`。**禁止**改 `/workspace/repo-ro`、线上站、GitHub `main`、Netlify Production。
2. **Production 上线**：必须 **David 亲口批准**。Karina / 其他 Agent 转述不算数。
3. **SEO**：不改 URL、title、meta、H1/正文文案、canonical、schema、真实内容的 alt。改完跑 `seo_diff.py`，目标 0 差异。
4. **额度紧张（约 90%+）**：**不要**再生成大截图、长 GIF、全页拼图。必要时只拍局部小图。
5. 网站内容 / SEO / 博客文案归 **SEO Manager**；视觉与动效归本线。

---

## 一、现状：site-v2 里已经改了什么

发布源：`/workspace/asiavision-visual/site-v2/`（静态站）。

| 已完成 | 位置 / 说明 |
|---|---|
| LED 深色像素首屏 | `index.html` + `js/av-led-hero.js` + `css/av-design.css` 末尾；鼠标附近像素发光，手机扫一遍后静止 |
| Logo 缩小 + 顶栏对齐 | Logo 不高于右侧导航字号；桌面 logo 与菜单同一水平线 |
| COB 环形画廊 | `#why` 内 `.cob-reel`：3D coverflow，正面最大，侧面缩小变淡；深色像素舞台底；点击正面打开大图，视频无声播放；`HOVER_PLAY=false` 默认 |
| 卡片光晕悬停 | 全站 `.ui-card`：`js/av-interactions.js`；触屏无悬停效果 |
| 首页数字滚动 + 体育案例横滑 | 首页 stats / marquee |
| 博客阅读体验 | 宽表首列固定、对比度修复、自动目录（531 篇）；阅读时长已按 David 要求删除 |
| SEO | 多轮 `seo-diff-result-*.txt` 均为 0 差异 |

**同步注意**：改 `site-v2/css/av-design.css` 后同步到 `/workspace/asiavision-visual/assets/av-design.css`。

---

## 二、还没做 / 不要当成已上线

| 未完成 | 说明 |
|---|---|
| 演唱会「上行展开」 | **仅样例**，在 `concert-concepts/`，**未并入** `site-v2/index.html`。首页仍是旧的横向 `.why-media` 轮播 |
| 过渡方案效果图 | David 因额度叫停，**不要继续出** |
| 桌面整页截图 | 已叫停；手机整页已有：`mobile-homepage-full.png`（390×约 13270），仅供参考，勿再做全页 |
| 旧 `preview-build/` | 过期的 noindex 预览包，**不要用来部署** |

---

## 三、任务 A：把「上行展开」并进 site-v2 首页

### 参考材料（只读样例）

- 目录：`/workspace/asiavision-visual/concert-concepts/`
- 主样例：`concept-upfold.html` + `upfold.css` + `upfold.js`
- 说明：`proposal.md`
- 演示 GIF（已有，勿重做）：`screenshots/upfold-demo.gif`（约 11.5 秒）
- 设计要点：六张演唱会图 **自下往上展开**（像舞台灯升起）；背景是 **舞台灯光+雾感**，不是平色块；橙色调 + 深色像素感与 COB 栏目统一；名称叫「上行展开」

### 建议步骤

1. 读 `concert-concepts/proposal.md` 与 `concept-upfold.html`，确认动画与资源路径。
2. 在 `site-v2/index.html` 定位旧演唱会块：`#why` 内「Built for AV Integrators & Rental Fleets」旁的 **`.why-media` 横向轮播**（含 6 张缩略图）。
3. 用上行展开 **替换该媒体展示**，保留原有标题、正文、链接、列表文案不动。
4. 把需要的 CSS/JS 并入 `av-design.css` / `av-interactions.js`（或小文件 deferred 引入），资源优先用站点已有演唱会图，避免新增大图。
5. 备份 → 改 → 跑 SEO diff → 只拍 **局部** 手机/桌面截图（额度紧）。
6. `prefers-reduced-motion`：降级为静态展开或简单淡入。

---

## 四、任务 B：部署 site-v2（预览优先，勿直接 Production）

### Netlify / 仓库事实

- 配置文件：`site-v2/netlify.toml`
- `publish = "."`，**无 build 命令**
- CSS/JS/图片压缩均为关闭；保留 Netlify Forms 检测
- GitHub：`https://github.com/asiavisiondavid-glitch/asiavisionled.com`
- 主分支：`main`（当前线上对应 asiavisionled.com）

### 推荐发布路径（按序）

1. **确认发布目录**仅为 `site-v2/` 内容（含 `css/`、`js/`、`images/`、`blog/`、`netlify.toml`、`_redirects` 等）。
2. **不要**打进：`concert-concepts/`、`homepage-concepts/`、`screenshots/`、根目录 md/截图、过期 `preview-build/`。
3. 任选其一做 **预览**（推荐）：
   - Netlify 新建 **Draft / 独立 Preview 站点**，拖入 `site-v2` 文件夹；或
   - 新建分支如 `preview/visual-v2`，推送 site-v2 内容，用 **Deploy Preview**。
4. **禁止**在未获 David 亲口批准前：推 `main`、发 Netlify Production、改线上 DNS。
5. 预览站若需防收录：可临时加 noindex（仅预览站），**生产站不要**留整站 noindex。
6. David 批准 Production 后，再按他的指示合并/发布；发布后抽查首屏、COB、表单、博客目录。

---

## 五、额度与产出纪律

- 配额已很高：少开浏览器全页截图、少做 GIF、少跑 Lighthouse 全家桶。
- 已有手机整页：`/workspace/asiavision-visual/mobile-homepage-full.png`（390 宽 × 约 13270 高）。
- 向 David / Karina 汇报用短中文 + 少量局部图即可。

## 六、关键文件速查

| 路径 | 用途 |
|---|---|
| `site-v2/` | 可部署的改版草稿 |
| `site-v2/css/av-design.css` | 主视觉 CSS（末尾追加各阶段块） |
| `site-v2/js/av-led-hero.js` | 首屏 LED |
| `site-v2/js/av-interactions.js` | 卡片光晕、COB 画廊、数字/跑马灯 |
| `concert-concepts/` | 上行展开样例（待并入） |
| `why-redesign.md` | COB 画廊说明 |
| `seo_diff.py` / `seo-diff-result-*.txt` | SEO 对比 |
| `HANDOFF-Cloud.md` | 本文件 |

有疑问先问 Karina 或 David，不要自行上 Production。
