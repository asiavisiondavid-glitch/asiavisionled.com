# QA report — seo-new4-1117 (2026-11-17)

## Word count method

English words in **main content including FAQ**, defined as:

- Include: the `<h1>`, the article body from the byline (`By Danny`) through the end of the FAQ block, including headings, paragraphs, lists, tables and visible figcaptions.
- Exclude: site nav, both tables of contents, `<title>` / meta / Open Graph / JSON-LD, `alt` attributes, Sources and Further Reading, Related Articles, author bio, inquiry CTA, scripts, and the floating WhatsApp control.
- Tokeniser: `re.findall(r"[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*", text)` after tags are stripped and HTML entities decoded.
- Script: `/workspace/seo-new4-1117/_src/build.py` function `count_main`.

Required range: 1,900–2,100. Result:

| Slug | Words | FAQs | Title chars | Meta chars |
|---|---:|---:|---:|---:|
| how-to-clean-led-video-wall-cob-smd-guide | 2100 | 5 | 48 | 142 |
| led-video-wall-genlock-frame-sync-guide | 2021 | 5 | 49 | 148 |
| led-video-wall-hdmi-edid-hdcp-guide | 1970 | 5 | 50 | 138 |
| outdoor-led-display-humidity-condensation-guide | 1955 | 5 | 51 | 146 |

## Internal links

Every `/blog/<slug>` target was checked against the 560-file inventory. Every `/products/<slug>` target was checked against `site-work-white-backup-1109/products`. `/contact`, `/`, `/products-v2`, `/cases/` and `/blog/` are existing site entry points. **No links point at the new 11/17 slugs or at the unpublished 11/13 and 11/16 draft slugs.**

## External `rel`

All `https://` links that are not `asiavisionled.com` or `wa.me` carry `rel="nofollow noopener noreferrer"` and `target="_blank"`. Company site links and WhatsApp (`wa.me/8617276665558`) are followed. `mailto:info@asiavisionled.com` is the address already used in earlier drafts.

## Images and banned-photo exclusion

Twenty output images (five per article: 1 featured + 4 inline). Each has a `.jpg` used in the HTML and a `.webp` spare. Every output has a bottom-right semi-transparent `asiavisionled.com` watermark (same helper geometry as the 11/13 drafts).

Banned references used for exclusion (hash only, never reused as artwork):

- `通用首图2.jpg` backup `/workspace/seo-baseline/optimizations/backup/remove-tongyong2-20261112/images/通用首图2.jpg` — md5 `3a376b027d2f0337e3068864bab56882`, sha256 `e1a4f09f9bd026bdda67f649f19031fde2564b3d6469987d9d48058af1ac6d51`, phash `cd02324f3331cff1`, dhash `6bf1f0f2706022b2`, 1252×704.
- `通用首图3.jpg` backup `/workspace/seo-baseline/optimizations/backup/remove-booth-photo-20261112/images/通用首图3.jpg` — md5 `6b11135797879226cf2a9048049a5711`, sha256 `9587ff2d8080ccd9baafad3226aa27662f3a5bb22ecab92d15ddd0e408d3ab50`, phash `de06313bcd456d38`, dhash `abede4e234383a92`, 1252×704.

A candidate was rejected if MD5 or SHA-256 matched, or if perceptual hash Hamming distance was ≤ 8 (phash or dhash). All 20 accepted sources have minimum phash distance **26–34** against both banned stills. Full table: `image-manifest.csv`.

Also rejected on provenance or format, without being hashed as banned: ISO-badge graphic, typography overlays, marketing-text factory posters, an outdoor architectural render, a weak-provenance night graphic, and the red trade-show booth frames (avoided as heroes). No generated charts.

All `./images/*.jpg` referenced in the four `index.html` files exist on disk.

## PDFs

- `/workspace/seo-new4-1117/pdf/how-to-clean-led-video-wall-cob-smd-guide.pdf` — 694 KB, rendered with Chrome headless from a temporary copy (print CSS hides site nav and the WhatsApp control; site CSS copied for layout). Draft HTML is unchanged.
- `/workspace/seo-new4-1117/pdf/led-video-wall-genlock-frame-sync-guide.pdf` — 898 KB, rendered with Chrome headless from a temporary copy (print CSS hides site nav and the WhatsApp control; site CSS copied for layout). Draft HTML is unchanged.
- `/workspace/seo-new4-1117/pdf/led-video-wall-hdmi-edid-hdcp-guide.pdf` — 765 KB, rendered with Chrome headless from a temporary copy (print CSS hides site nav and the WhatsApp control; site CSS copied for layout). Draft HTML is unchanged.
- `/workspace/seo-new4-1117/pdf/outdoor-led-display-humidity-condensation-guide.pdf` — 974 KB, rendered with Chrome headless from a temporary copy (print CSS hides site nav and the WhatsApp control; site CSS copied for layout). Draft HTML is unchanged.

## Issue list

No broken assets, no unverified internal blog or product links, no missing FAQ, no word-count misses, no `nofollow` on own properties, no missing `nofollow` on external http(s) links, no banned-filename references.
