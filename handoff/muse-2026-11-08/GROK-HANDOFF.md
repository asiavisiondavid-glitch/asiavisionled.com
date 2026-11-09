# 网站改版交接 — 给 Grok（David 转交）

**日期：** 2026-11-09
**网站：** asiavisionled.com（Asia Vision Technology 官网，静态 HTML/CSS/JS，Netlify 托管）
**来源：** Muse 2026-11-08 本地改版工作副本；本包只含「改动部分」，仓库原版仍是 2026-11-05 版。
**目标：** Grok 接手继续改进网站（视觉、交互、SEO 内容），所有上线改动须经 David 确认。

---

## 1. 现状总览（先读这节，别直接动手）

| 项目 | 状态 |
|---|---|
| 线上正式站 | site-v2，2026-11-05 11:07 上线；GitHub 仓库 `asiavisiondavid-glitch/asiavisionled.com`，分支 `handoff/cloud-deploy`（@3f3f34a），base 目录 `site-v2`，无构建、publish 目录 `.` |
| GitHub 仓库 | **仍是 2026-11-05 版，三板块改版不在仓库里**。Grok 无法从仓库拿到新版，须先把本包的改动文件推入仓库（见第 5 节 token 阻塞）。 |
| 本地改版工作副本 | `workspace/asiavision-visual/site-v2-redesign/`（本次改版的完整工作副本）。本包 `changed-files/` 只含改动过的文件，按仓库相对路径摆放，可直接覆盖进仓库对应位置。 |
| 临时预览站 | https://sprightly-genie-6f0e40.netlify.app/（首页、工厂页、联系页）；线上最新预览为 `?v=649`（2026-11-08 08:17）。`?v=650` / `?v=651` 因 Netlify 额度耗尽被跳过、从未上线。 |
| 部署规则（David 定） | **预览先行，生产站自动发布已锁定。** 流程：推预览 → David 确认预览 → 再上正式站。任何部署（预览或生产）动手前必须先报成本、等 David 点头。不要擅自部署。 |
| Netlify 额度 | 11 月用量 **315/300 已用完**；19 次预览部署烧了 285 点（每次约 15 点）。**重置日 11 月 30 日**（不是 12 月 1 日）。Netlify 补的 30 点运营额度只能保已发布站点在线，**不能用来部署**。在重置前不要再推预览（除非 David 明确说“试”一次）。 |
| 中文站 | **未同步**。三板块改版只改了英文站，`zh/` 未动。 |
| SEO / 标题正文 | 三板块改版**未动** URL、Title、Meta、H1、正文文案、canonical、schema、图片 alt。只改视觉呈现与交互。 |

---

## 2. 本次改动清单（2026-11-08，Muse 执行，David 已确认方案与终态）

### 改动的文件（共 2 个 HTML + 9 张新图）

| 文件 | 变化 |
|---|---|
| `index.html` | 141,213 → 151,661 字节（+10,448）。首页三板块重做：产品卡 → 演唱会 → COB 制造 → 球场屏。详见第 3 节。完整 diff 见 `diffs/index.html.diff`。 |
| `factory/index.html` | 59,052 → 59,616 字节（+564）。工厂页 5 个环节改成带步骤号的卡片（Step 1–5 徽章）、卡片样式（圆角、边框、阴影）、CTA 区强化（浅橙底、加大按钮+阴影）；图片 `aging-test.jpg` → `aging-test-72h.jpg`。完整 diff 见 `diffs/factory-index.html.diff`。 |
| `images/why-asia-vision.jpg` | **新**。演唱会板块开头用的 WHY 图（photo-23，已修正 7 的版本）。 |
| `images/scenes/concert-cob-zh-stage.jpg` | **新**。演唱会板块 COB ZH 海报全宽图。 |
| `images/scenes/event-infocomm-beijing.jpg` | **新**。演唱会「室内发布会」筛选新增第 3 张卡（InfoComm China 北京现场）。 |
| `images/factory/aging-test-72h.jpg` | **新**。COB 第 4 步「72 小时老化测试」+ 工厂页老化测试卡片。 |
| `images/factory/dispatch-flight-cases.jpg` | **新**。COB 第 5 步「出货 Dispatch」（航空箱打包）。 |
| `images/scenes/sports-perimeter-wide-1-v2.jpg` | **新**。球场屏第一张宽屏围栏图 v2（替换旧版）。 |
| `images/scenes/sports-perimeter-wide-1.jpg` | **新**。球场屏图。 |
| `images/scenes/sports-perimeter-wide-2.jpg` | **新**。球场屏图。 |
| `images/scenes/sports-poster-2-v2.jpg` | **新**。球场屏海报 v2，**替换**旧 `images/scenes/sports-poster-2.jpg`（旧图已从改版中移除，勿再引用）。 |

> 注意：`css/`、`js/` **未动**（仍为 2026-11-05 版）。三板块的交互只用了现有 JS（灯箱用独立 `boxCurrent`，计数 n / 6）。

### 视觉参考
- `asiavision-首页-效果预览-2026-11-08.pdf`（16 页桌面版首页效果，本地静态渲染、非部署）：以此为准看最终效果。
- `website-sections-redesign-proposal.md`：改版前的原始方案（2026-11-08），含 A/B 路选择与实施顺序，供对照方案与终态的出入。

---

## 3. 三板块终态（以 David 的逐条纠正为准）

页面顺序：**产品卡（EH-PRO、ZH、E-PRO、Z）→ 演唱会 → COB 制造 → 球场屏**。

### 演唱会板块（静态画廊，3D 环形已撤）
- WHY 图（`images/why-asia-vision.jpg`）作板块开头；原英文标题/副文案可见部分全撤（留 `sr-only` 标题供 SEO）。
- Concert display 3 已删，余 **6 张 2×3 缩略图**，点图直接开灯箱（独立 `boxCurrent`，计数 n / 6）。
- 其下为 COB ZH 海报全宽 + **六张参数卡 3 列** + CTA，**无黑色舞台底**。
- David 纠正：3D 环形画廊看着眼睛累，已撤掉改回静态画廊；不要再加回 3D 效果。

### COB 制造板块（静态四列卡片）
- 两张大图一行横排；四步（封装 → 校准 → 老化测试 → 出货）为**静态四列卡片**（不是轮播、不是步骤条动画）。
- 仍缺：COB 封装特写、演唱会真实项目数据与搭建实拍图——图到再换，不要用 AI 图凑数。

### 球场屏板块（纯图片）
- 三图同宽 1080、同比例 **16/10**（复核约 1.56–1.62；之前 3:1 为误测，不要再改比例）。
- 第一张宽屏围栏图已换 v2（`sports-perimeter-wide-1-v2.jpg`）。
- 「Arena & centre-hung」一句暂留，待 David 定，不要擅自删改。

### David 亲定的事实口径（Grok 写文案与质检必须遵守）
- 产线数字：**8 条 IC + 7 条 SMD**（不是 6 条；photo-22 原图写 6 是错的，已修正）。
- COB **没有贴片这道工序**（固晶焊线后直接封胶）。不要在文案里写 COB 贴片。
- 足球赛场**不设中央吊屏**。不要写足球场中央吊屏。
- 质保统一 **3 年**（个别订单例外以 David 当时口径为准）。
- WhatsApp：**+86 172 7666 5558**；邮箱 **info@asiavisionled.com**。
- 公司法定名：英文 Shenzhen Asia Vision Technology Co., Ltd.，中文深圳市亚洲视觉科技有限公司。

---

## 4. Cloudflare 预览账户登记（David 2026-11-09 要求纳入本包）

> **状态先说清楚：注册启动过、但未完成，没有可用的 Cloudflare 预览站。** 以下为实录，Grok 接手前须先与 David 确认是要补完它、还是只作备查。

| 项目 | 内容 |
|---|---|
| 账户邮箱 | **asiavision.david@gmail.com**（经 Google 登录注册 Cloudflare 免费账号，无需信用卡） |
| 项目名 | `asiavision-preview`（Cloudflare Pages 项目） |
| 预期地址 | `https://asiavision-preview.pages.dev`（未验证上线） |
| 上传内容 | `preview-bundle.zip`（59 个文件，`index.html` 在根目录，含 `factory/index.html`、`contact.html`；已核对 WHY 大图与球场屏 v2 图入包、Concert display 3 不入包、旧 `sports-poster-2.jpg` 不入包） |
| 费用 | $0（免费档；每月 500 次构建，直传文件不占构建数） |
| 时间线 | 2026-11-08 09:05 David 要求赔钱（Netlify 额度烧完），补救定为免费迁 Cloudflare；09:06 David 说「我要部署」，授权当次 Cloudflare 部署，浏览器任务开始注册并上传；**09:07–09:11 David 否决**，明确部署首选是 Netlify（原话大意：首选在 Netlify，不要让他去注册 Cloudflare），注册任务已停掉（浏览器窗口关闭），**未完成注册／部署，09:06 的授权就此作废**。 |
| 现状 | **无已验证的 Cloudflare 预览站。** 注册是否在账号侧实际建成了项目、zip 是否传完，均未回传、未验证——不要默认它已可用。 |
| David 的偏好 | 部署首选 **Netlify**，反对为预览注册其他平台；拒绝花钱升级（Personal $9/月、Pro $20/月，均未升级、未付款）。 |
| 待 David 定 | 2026-11-09 David 要求把 Cloudflare 账户登记纳入本次 Grok 交接。**Grok 接手时请先与 David 确认一句话**：是要补完 Cloudflare 注册并改用它做预览（Netlify 额度 11 月 30 日才重置），还是只把登记信息留作备查、预览仍走 Netlify。**在他明确点头前，不要擅自注册、部署或改 DNS。** |

---

## 5. 阻塞项（Grok 接手前须知道）

1. **GitHub token 未接通，推不进仓库。** 细粒度 token（muse-pages，90 天、至 2027-02-06、Contents 读写）已建好，但值仍在浏览器标签页、未存入连接器；token #2 值已丢失；安全提交页被组织政策拦截；David 说手动复制提交「我做不到」，已停。**在 token 接通前，Grok 无法从仓库拿到三板块新版，也推不进改动。** 如 David 重新授权提交流程，提交后须再验 API 通过才算完成。
2. **Netlify 额度已满（315/300），重置 11 月 30 日。** 在此之前不要推预览（每次约 15 点）。如 David 说“试”一次，只推临时预览站、不碰正式站。
3. **生产站自动发布已锁定。** 不要改部署设置；正式站更新须 David 亲口批准（预览确认即批准）。
4. **中文站未同步、演唱会真实数据与 COB 封装特写仍缺**（见第 3 节）。

---

## 6. Grok 接手后建议的顺序

1. 先确认第 4 节 Cloudflare 的去留（补完注册改走 Cloudflare 预览，还是只作备查）。
2. 确认第 5 节 token 与 Netlify 额度的处理（等 11 月 30 日重置，还是先走 Cloudflare 预览）。
3. 把本包 `changed-files/` 的内容推入仓库对应位置（`index.html`、`factory/index.html`、9 张新图；并删除旧 `images/scenes/sports-poster-2.jpg` 的引用，确认无其他页面引用它）。
4. 按 David 的后续反馈继续改进三板块（中文站同步、缺失素材补齐、询盘 CTA 打磨）。
5. SEO 另行：P0 Title/Meta 重写清单见本包 `seo-p0-title-meta-rewrite-brief-2026-11-04.md` 与 `seo-task-checklist-for-grok-2026-11-05.md`（Grok 原有任务，David 已转交）；改动后请用 Search Console 请求重新索引。

---

## 7. 本包文件清单

```
grok-handoff-2026-11-09/
├── GROK-HANDOFF.md                  # 本文件（交接说明）
├── changed-files/                   # 改动文件，按仓库相对路径摆放
│   ├── index.html                   # 首页（三板块重做）
│   ├── factory/index.html           # 工厂页（步骤卡片 + CTA + 换图）
│   ├── images/factory/aging-test-72h.jpg
│   ├── images/factory/dispatch-flight-cases.jpg
│   ├── images/scenes/concert-cob-zh-stage.jpg
│   ├── images/scenes/event-infocomm-beijing.jpg
│   ├── images/scenes/sports-perimeter-wide-1-v2.jpg
│   ├── images/scenes/sports-perimeter-wide-1.jpg
│   ├── images/scenes/sports-perimeter-wide-2.jpg
│   ├── images/scenes/sports-poster-2-v2.jpg
│   └── images/why-asia-vision.jpg
├── diffs/
│   ├── index.html.diff              # 首页 diff（原版 → 改版）
│   └── factory-index.html.diff      # 工厂页 diff
├── website-sections-redesign-proposal.md   # 改版原始方案（对照用）
├── seo-p0-title-meta-rewrite-brief-2026-11-04.md
├── seo-task-checklist-for-grok-2026-11-05.md
└── asiavision-首页-效果预览-2026-11-08.pdf  # 16 页桌面版首页效果（视觉参考）
```

> 完整工作副本（含全站其他文件）另见 `workspace/asiavision-visual/site-v2-redesign/`；部署包 `workspace/asiavision-visual/preview-bundle.zip`（9.6MB，59 文件，2026-11-08 08:44 打包）。如需全站文件，优先用工作副本，不要用已停的 `repo/` 目录（其文件多为删除状态）。
