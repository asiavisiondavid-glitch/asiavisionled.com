# Retrofit Batch 01 — Replacement Images for 10 Published Blog Articles

For Grok: use these files to update the 10 published blog articles listed below.
Prepared by Muse, 2026-11-18, approved by David (Asia Vision Technology).

## What is in this folder

- 19 replacement images (10 heroes + 9 inline), each as JPG + WebP with the
  same filename: 38 image files total. All 16:9, never upscaled, watermarked
  `asiavisionled.com` bottom-right. All are real Asia Vision photos — no
  stock, no competitor images, no AI-generated images.
- `image-manifest.csv` — the index for all 19 images: article URL, old image
  path, new filename, role (hero/inline), replacement reason, material source,
  dimensions, JPG/WebP bytes, English alt, English caption, suggested
  insertion position.
- `manifest-<slug>.csv` + `gaps-<slug>.md` — per-article manifest and gaps.
- `缺素材与待确认事项.md` — empty slots and notes (in Chinese).

## The 10 articles

1. led-display-transparent-screen-guide — hero + 1 inline replaced
2. led-display-fine-pitch-buying-guide — hero + 2 inline replaced
3. led-display-anti-dumping-duty-guide — hero replaced, 1 inline deleted
4. led-display-rental-cabinet-selection-guide — hero + 2 inline replaced
5. led-display-outdoor-rental-guide — hero replaced (4 inline kept as-is)
6. led-display-ip-rating-guide-2026 — hero + 1 inline replaced
7. how-to-compare-led-display-manufacturers — hero + 1 inline replaced
8. led-display-conference-room-size-guide — hero + 1 inline replaced
9. led-display-retail-storefront-guide — hero replaced, 1 inline deleted
10. led-display-procurement-guide-2026 — hero + 1 inline replaced

## What to do

1. Copy the 19 images into `blog/images/` (or the location the site build
   uses for blog images).
2. In each of the 10 articles, replace the hero and inline images exactly as
   the manifest says: set the new image, the English alt and the caption, and
   put each inline image at its suggested insertion position.
3. Delete these references outright (do not replace them with anything else):
   - `blog/images/IMG_3124.jpg` in articles 1, 3, 8, 9 (expo booth showing
     Mled / LUXON / LianTronics / Colorlight / Dahua — competitor brands)
   - `blog/images/IMG_3123.jpg` in articles 4, 7, 10 (Colorlight cube screen)
   - `blog/images/fine-pitch-apply.jpg` in article 2 (a NovaStar controller
     photo mislabeled as a COB panel)
   - `blog/images/3840d56c4bcac0b895a903eddc26d4.JPG` in article 6 (a bank
     billboard street photo mislabeled as an IP-rating test)
4. Leave 2 inline slots EMPTY (no image): article 3 and article 9. There is
   no suitable real material for them; do not fill them with unrelated
   images.
5. Do not change article text or URLs. Do not invent specs, parameters or
   customer cases. Alt text must describe what is actually visible in the
   image.

## Boundaries (David's rules)

- Preview-first: prepare the updates and show a preview. **Do NOT deploy or
  publish to the live site without David's explicit confirmation.**
- Do not push or trigger any build/deploy from this folder alone.
- If a replacement does not fit or a manifest entry is unclear, ask David
  instead of guessing.

## Notes

- `transparent-led-cabinet-front-hero` reuses an already-approved file
  (byte-identical to the facade batch delivery); its caption honestly says
  it shows the transparent cabinet front face — the grille comparison
  figures live in the article's comparison table, not in the photo.
- `smt-production-line-shenzhen-factory-hero` is 800x450: the source
  `smt-line.jpg` is actually 800x600 (the proposal said 1400x934). It was
  delivered at native width, never upscaled.
