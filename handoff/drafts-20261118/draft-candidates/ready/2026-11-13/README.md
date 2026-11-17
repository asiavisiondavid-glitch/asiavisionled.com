# Blog drafts 2026-11-13 (author Danny; drafts only, not published)

| # | Slug | Title tag | Target keyword | Words (body+FAQ) |
|---|---|---|---|---|
| 1 | novastar-vs-colorlight-led-control-system | NovaStar vs Colorlight LED Control System: 2026 Guide | novastar vs colorlight led control system | 2,022 |
| 2 | led-display-cat6-vs-fiber-signal-transmission-guide | LED Display Cat6 vs Fiber: Distance and Backup Guide | led display fiber optic transmission / cat6 led display distance | 2,111 |
| 3 | led-display-conflict-minerals-supply-chain-guide | LED Display Conflict Minerals: CMRT and Declarations | led display conflict minerals declaration | 2,113 |
| 4 | led-display-ik-rating-impact-resistance-guide | IK Rating for LED Displays: IK08 vs IK10 Explained | ik rating led display | 2,100 |

Word count = the number printed by `_src/build.py` (body + FAQ). Title tags are 50–53 characters; meta descriptions 136–142.

## Topic selection (honest note)
- GSC has no direct queries for any of these four topics. The choice rests on (a) a content-gap check against the 534 local posts (live = preview) and the sitemap, and (b) web search demand and what competitors/standards bodies publish. No GSC evidence is claimed.
- Overlap check: none of the four has a live post on the same angle. Related posts are linked as complements (e.g. `led-control-system-guide`, `led-cable-wiring-guide`, `led-display-reach-compliance-guide`, `led-display-ip-rating-guide-2026`). No existing post mentions IK / IEC 62262 at all.
- Optional extension for David: forced-labour import rules (e.g. UFLPA) were deliberately left out of article 3 (sensitive; separate regime). Article 3 says so in one line.

## Merging into site-v2 (preview)
- Page: `<slug>/index.html` → `site-v2/blog/<slug>.html` (URL /blog/<slug>).
- Images: `<slug>/images/*` → `site-v2/blog/images/` (pages reference `./images/<file>`; filenames are unique across the 4 articles). .png/.jpg are referenced; .webp and .svg are spares.
- List cards: `blog-list-snippet.html`.
- **Publish articles 1 and 2 together**: each links to the other (`/blog/novastar-vs-colorlight-led-control-system` ↔ `/blog/led-display-cat6-vs-fiber-signal-transmission-guide`). Otherwise remove those two links.
- All other internal links were checked against `site-v2/sitemap.xml`. Every external link has `rel="nofollow noopener noreferrer"`; only asiavisionled.com and wa.me links are followed.

## Images
- Each article: 1 featured image (composite of Asia Vision's own photos, labelled) + 3 code-drawn charts (scripts `_src/images_N.py`). No third-party images; original photos only, never mixed with posters.
- Featured: 1 = burn-in test wall + X Series rear; 2 = rigged wall rear + COB EH-PRO rear; 3 = SMT line + production hall; 4 = COB Z front + flight-case packing.
- Every image has the bottom-right semi-transparent "asiavisionled.com" watermark.
- No AI image prompt: no AI image would be clearly better, so none is requested.
- Observation (not part of this batch): the 1109 front-vs-rear featured image has clipped text ("works from").

## PDFs
`pdf/<slug>.pdf` (Chrome headless, with images). Print CSS was injected into a temporary copy only (hides nav and WhatsApp button, shows the full featured image); the drafts are unchanged.

## [TO VERIFY] (also HTML comments in the pages)
1. Article 1: model/series lists come from novastar.tech and en.colorlightinside.com (2026-11-13); re-check before publishing.
2. Article 1: confirm both NovaStar and Colorlight card options are stocked and configured for each series, and whether Colorlight changes price or lead time.
3. Article 2: the "dedicated path / check before plugging into a shared network" advice is cautionary engineering advice, not vendor-quoted.
4. Article 2: CVT310 / CVT10 Pro distances come from a reseller listing and Mirun (an LED vendor); confirm against the NovaStar datasheet. Colorlight fibre distances are not stated.
5. Article 2: whether a wiring drawing is supplied with every project, and which cables/converters/spare cords ship as standard (the text says a drawing is supplied; remove if not standard).
6. Article 3: does Asia Vision hold a responsible-minerals policy, a company CMRT or sub-supplier smelter data? The text promises only a review of what can be documented.
7. Article 4: does Asia Vision hold any IEC 62262 IK report (model, lab, edition, class)? What is the test basis of the "3.5×" (COB Z) and "4.5×" (COB EH-PRO) claims? The article states them only as product-page claims relative to SMD and quotes no IK class.
8. Cross-checks before publish: vendor figures (NovaStar, Colorlight, RMI, SEC, EC) were read on 2026-11-13; legal wording in article 3 is general information, not legal advice.
