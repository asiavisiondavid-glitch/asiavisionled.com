# Retrofit Batch 02 — Replacement Images for 10 Published Blog Articles

For Grok: use these files to update the 10 published blog articles listed below.
Prepared by Muse, 2026-11-18, approved by David (Asia Vision Technology).

## What is in this folder

- 20 replacement images (10 heroes + 10 inline), each as JPG + WebP with the
  same filename: 40 image files total. All 16:9, never upscaled, watermarked
  `www.asiavisionled.com` bottom-right (watermark v3: DejaVu Sans Regular,
  no stroke, colour adapts to the background — white / dark grey / black;
  see `缺素材与待确认事项.md` for the per-image colour list). All are real
  Asia Vision photos — no stock, no competitor images, no AI-generated
  images.
- `image-manifest.csv` — the index for all 20 images: article URL, old image
  path, new filename, role (hero/inline), replacement reason, material source,
  dimensions, JPG/WebP bytes, English alt, English caption, suggested
  insertion position.
- `manifest-<slug>.csv` — per-article manifests (10).
- `缺素材与待确认事项.md` — empty slots and notes (in Chinese). 0 empty slots.

## The 10 articles

1. led-casino-gaming-guide — hero + 1 inline replaced (the old hero and the
   old inline were the same file used twice)
2. led-display-hotel-lobby-guide — hero + 1 inline replaced
3. led-display-rental-contract-guide — hero + 1 inline replaced
4. led-display-church-worship-guide — hero + 1 inline replaced
5. led-display-inspection-before-shipping — hero + 1 inline replaced
6. led-display-production-audit-guide — hero + 1 inline replaced
7. led-display-brightness-uniformity-guide — hero + 1 inline replaced
8. led-display-retail-window-screen-buying-guide — hero + 1 inline replaced
9. led-display-wholesale-china-manufacturer — hero + 1 inline replaced
10. led-display-high-refresh-buying-guide — hero + 1 inline replaced

## What to do

1. Copy the 20 images into `blog/images/` (or the location the site build
   uses for blog images).
2. In each of the 10 articles, replace the hero and inline images exactly as
   the manifest says: set the new image, the English alt and the caption, and
   put each inline image at its suggested insertion position.
3. Delete these references outright (do not replace them with anything else):
   - `blog/images/IMG_3123.jpg` in articles 3, 5, 6, 9 (hero), 10
     (Colorlight cube screen)
   - `blog/images/IMG_3124.jpg` in articles 7, 8 (competitor expo booth)
   - `blog/images/IMG_3122.jpg` in article 5, hero — the photo itself is a
     Colorlight X100 Pro hardware rack, not a factory inspection (new S-level
     finding; it was not in the inventory's competitor list)
   - `images/italy-led-rental-market-A.webp` in article 1, hero AND inline
     (the same warehouse/forklift photo used twice, unrelated to casinos)
   - `blog/images/IMG_2488.JPG` in article 3, hero (rehearsal room)
   - `blog/images/IMG_2487.JPG` in article 6, hero (rehearsal room)
   - `blog/images/IMG_2524.JPG` in article 7, hero (coral demo screen)
   - `blog/images/IMG_2516.JPG` in article 8, hero (street-market screen)
   - `blog/images/IMG_2517.JPG` in article 10, hero (star-trail demo screen)
   - `blog/images/IMG_2498.JPG` in article 2, hero (sports screen)
   - `blog/images/IMG_2489.JPG` in article 4, hero (rehearsal room)
   - `blog/images/IMG_3132.jpg` in article 2, inline (corridor light wall)
   - `blog/images/IMG_3130.jpg` in article 4, inline (office LED wall)
   - `blog/images/IMG_3483.jpg` in article 9, inline (Russian airport
     departure board, not a verified Asia Vision installation)
4. Leave 0 slots EMPTY. Every slot in this batch has a replacement image.
5. Do not change article text or URLs. Do not invent specs, parameters or
   customer cases. Alt text must describe what is actually visible in the
   image. Captions honestly state what each photo shows — none of the new
   photos is claimed to be a casino, church or hotel-lobby scene.

## Boundaries (David's rules)

- Preview-first: prepare the updates and show a preview. **Do NOT deploy or
  publish to the live site without David's explicit confirmation.**
- Do not push or trigger any build/deploy from this folder alone.
- If a replacement does not fit or a manifest entry is unclear, ask David
  instead of guessing.

## Notes

- `indoor-led-screen-city-landscape-hero` (article 1) is 1120x630, not the
  1360x765 in the proposal: the blue no-signal screen in the source starts
  at about x=1250, so a 1360-wide crop would have kept a blue edge. It was
  cropped to 1120x630 instead; the city-skyline screen is fully kept.
- `transparent-cabinet-front-angled-green-floor-hero` (article 8) is
  492,324 bytes as JPG, above the 350 KB hero suggestion (not a hard cap).
- 5 files were re-derived from the clean original sources with the v3
  watermark (same crops as before), not copied from older watermarked
  files: the Adidas retail photo, `smt-line`, `flight-case-packing`,
  `cob-assembly`, and the pitch-comparison grid. The Adidas file is
  byte-identical to batch 01's new version; the other four differ from
  batch 01 only in the watermark (dark-text alpha 170 here vs 255 in
  batch 01; `smt-line` is dark grey here, white in batch 01 — see
  `缺素材与待确认事项.md`).
- `indoor-outdoor-pitch-comparison-grid-p1-25-p3` (article 7): the watermark
  sits on the dark P3 pixel face (anchor x=1100) so it does not cover the
  "户外P3" label (same exception as the Gemini Batch 02 delivery). Its
  caption notes the labels in the graphic are in Chinese.
