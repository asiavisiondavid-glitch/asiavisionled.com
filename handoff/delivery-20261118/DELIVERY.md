# 精简交付说明 — site-v2 增量包（2026-11-18）

只做本地压缩与清单。未改源 HTML，未改 `av-repo` checkout，未做任何 git 写或网络 push。

## 必须先读的映射规则

1. **发布目录是 `repo/site-v2/`，不是仓库根。** 云端已核实线上如此。本增量包内的路径等于 11/17 stage 根路径，解包时必须映射为：
   `archive_path` → `asiavisionled.com/site-v2/<archive_path>`
   例如 `index.html` → `site-v2/index.html`，`images/factory/aging-test-72h.jpg` → `site-v2/images/factory/aging-test-72h.jpg`。
   **不要**解到仓库根，否则会盖错树并可能发错站点。

2. **12 篇已完成草稿不要进 `site-v2/`。** 复用包 `05-draft-candidates-ready.tar.gz`（15.511 MiB，与 `/workspace/deliver-20261118-muse-github/packages/05-draft-candidates-ready.tar.gz` 字节与 sha256 相同）。解到发布目录之外，建议：
   `repo/handoff/drafts-20261118/`
   该包内部前缀是 `draft-candidates/ready/…`。放在 `handoff/` 下可避免 Netlify 自动构建把草稿公开。Turkey/Mexico HOLD 与 11/18 未完成稿 **不要**上传到可发布树，本交付也未包含它们。

3. **依赖基准 commit（必须先核验）：**
   `bc99fd4e5e526cd6b3c388e32145f4569bdf860d`
   本地 `/workspace/av-repo` 已只读确认：HEAD 即该完整提交，当前分支 `handoff/cloud-deploy`，工作区干净，`site-v2/` 相对 HEAD 无差异、无未跟踪文件。云端若发现远端不是此 commit，应停止，不要猜着合。

## 相对 site-v2 的差异摘要

对照树：`/workspace/preview-stage-1117-asiavision`（11/17 干净 stage，对应预览 d614539d）vs `/workspace/av-repo/site-v2`（上述 commit）。

| 类别 | 文件数 | 体积 |
|---|---:|---:|
| stage 总文件（已排除 .wrangler 等） | 3160 | 432.4 MiB |
| 与 site-v2 哈希相同（不打包，只给核验清单） | 732 | 176.8 MiB |
| 新增 | 1943 | 240.1 MiB |
| 内容变更 | 485 | 15.5 MiB |
| 仅在旧 site-v2、不在 stage | 2 | 0.4 MiB |

新增+变更已打成增量包；未变化文件见 `stage-sha256sums.txt` 与 `unchanged-vs-site-v2-sha256sums.txt`，供合入后按路径核验 sha256。整份 stage 清单也在 `stage-full-sha256.csv`（含 added/changed/unchanged 状态）。

首页与工厂实拍：变更后的 `index.html` / `zh/index.html` / `factory/index.html` 在 `01-delta-html-css-js-config-bloghtml.tar.gz`；新增工厂/why-popup/unfold 等图在 `02-delta-images.tar.gz`。

主库 559 篇正文 + `blog/index.html` 已在 stage 中：其中 27 篇 HTML 为相对 site-v2 的新增（含原计划 16 篇），其余多为变更或未变。12 篇未发布草稿不混入该库。

## 建议删除（仅建议，且仅限旧 site-v2 内不在新 stage 的文件）

详见 `deletion-suggestions.csv`。本次只有这 2 个文件，且均为已核验禁图，sha256 与封禁记录一致：

- `site-v2/images/通用首图2.jpg` — sha256 `e1a4f09f9bd026bdda67f649f19031fde2564b3d6469987d9d48058af1ac6d51`
- `site-v2/images/通用首图3.jpg` — sha256 `9587ff2d8080ccd9baafad3226aa27662f3a5bb22ecab92d15ddd0e408d3ab50`

**禁止删除：** 仓库根的 `HANDOFF-Cloud.md`、`handoff/`（含已有 muse 交接文档和新建的 `handoff/drafts-20261118/`）、`.git/`。这些不在 site-v2 内，也不在本删除清单中。11/12 记录的禁图衍生文件名在此版 site-v2 中不存在，故未列入。

RH-PRO：增量 downloads 包含站点现用 `downloads/specs/av-rh-pro-v1.0.pdf`（原样）。用户指定的正确源 `AV-RH-PRO Series Specification V1.0 (24-09-05)_Neutral.pdf` 与它不是同一文件，不要自动替换。M-PRO/EH-PRO 亮度差异不改；COB 一体机 +80 °C 忽略。

## 包位置与体积

全部在 `/workspace/deliver-20261118-site-v2-delta/`。包在 `packages/`。权威校验：根目录 `SHA256SUMS`、`packages.csv`。每包 <24 MiB，按下方轮次每轮 <46 MiB。增量包合计（含复用的草稿包、不含将添加的 00 说明包）约 251 MiB，远小于此前完整 423.84 MiB 交付。
