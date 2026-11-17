# SEO drafts — 4 new English articles (Asia Vision, 2026-11-17)

Local preparation only. Nothing in this directory has been deployed, published, or merged into a preview or production site. Source repos, `/workspace/site-work-white-backup-1109`, `/workspace/preview-stage-1117-asiavision`, and other site trees were read, not written. Backlink work was not resumed.

Author: Danny. Date in the drafts: 2026-11-17 (Asia/Shanghai).

## The four articles

| # | Folder / slug | Title tag | Target keyword | Words (main+FAQ) |
|---|---|---|---|---|
| 1 | `how-to-clean-led-video-wall-cob-smd-guide` | How to Clean an LED Video Wall: COB vs SMD Guide | how to clean LED video wall | 2,100 |
| 2 | `led-video-wall-genlock-frame-sync-guide` | LED Video Wall Genlock and Frame Sync: 2026 Guide | LED video wall genlock | 2,021 |
| 3 | `outdoor-led-display-humidity-condensation-guide` | Outdoor LED Humidity and Condensation: A 2026 Guide | outdoor LED display condensation | 1,955 |
| 4 | `led-video-wall-hdmi-edid-hdcp-guide` | LED Wall Goes Black: HDMI, EDID and HDCP Explained | LED wall HDMI EDID HDCP | 1,970 |

Word count method is documented in `qa-report.md`. Range required: 1,900–2,100 English words.

## How to merge later (only when David / Karina authorise)

- Page: `<slug>/index.html` → site `blog/<slug>.html` (URL `/blog/<slug>`).
- Images: `<slug>/images/*` → `blog/images/` (pages reference `./images/<file>.jpg`; filenames are unique across the four articles). `.webp` copies are spares.
- List cards: `blog-list-snippet.html`.
- PDFs in `pdf/` are review copies only (Chrome headless; nav and WhatsApp control hidden in the print copies).
- Internal links in the HTML point only at slugs that already exist in `/workspace/site-work-white-backup-1109/blog` (560 pages) or at `/products/...` and `/contact`. They do **not** point at these four new slugs or at the unpublished `/workspace/blog-drafts-1113` and `/workspace/seo-new4-1116` batches.

## [TO VERIFY] before publish

1. Cleaning: Asia Vision product pages do not publish a per-model cleaner or chemical list. The article says so and does not invent one. Confirm whether a written care note can be supplied at handover.
2. Cleaning / warranty: the standard three-year warranty is stated. No warranty-void clause for the wrong cloth or chemical is asserted, because none was quoted from a published Asia Vision warranty text.
3. Genlock: NovaStar is the default control system and Colorlight the backup, as confirmed. The article does not list which stocked processor models have a genlock input — that must be confirmed against the exact unit.
4. Humidity: IP65 and −20 °C to +50 °C / 10–95% RH (working) and −40 °C to +70 °C / 10–95% RH (storage) are quoted from the D-PRO, EH-PRO, EF and S Series outdoor specification PDFs named in the article. No damp-heat, condensation or salt-spray test report is claimed. If a bid needs a named test, confirm whether a report exists.
5. HDMI / EDID / HDCP: input lists, EDID behaviour and HDCP support are model-specific. Do not treat the article as a stocked-processor catalogue.
6. External vendor and competitor care/spec pages were read on 2026-11-17; re-check links before publishing.

## Confirmed facts used (not invented)

- Standard warranty: three years.
- NovaStar default, Colorlight backup.
- Eight IC lines and seven SMD lines; COB has no SMT placement step (used only in the cleaning article, with a factory caption that does not present an SMT line as COB production).
- No centre-hung football-stadium screen is claimed.

## Images

All images are cropped/resized/watermarked copies of Asia Vision original factory, product or case-library photographs. No generated charts, posters, stock or competitor images. `images/通用首图2.jpg` and `通用首图3.jpg` were excluded by MD5/SHA-256 and by perceptual hash (distance ≤ 8). See `image-manifest.csv` and `qa-report.md`.
