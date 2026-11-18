#!/usr/bin/env python3
"""Check site-v2 publish inventory without publishing.

Eligible English articles are blog HTML files whose clean URL is not 301'd
elsewhere, whose canonical is https://asiavisionled.com/blog/<slug>, and
which are not noindex. Legacy HTML that only exists to satisfy an older URL
stays on disk and stays out of the blog list, sitemap, and search index.

Run from anywhere:
    python3 handoff/verify-publish-inventory.py
Exit 0 when the publish tree matches this inventory. Writes
handoff/publish-inventory-report.json next to this script.
"""

from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
from html import unescape
from pathlib import Path

ORIGIN = "https://asiavisionled.com"
REPO = Path(__file__).resolve().parents[1]
SITE = REPO / "site-v2"
DRAFTS = REPO / "handoff" / "drafts-20261118"
REPORT = Path(__file__).resolve().parent / "publish-inventory-report.json"


def parse_redirects(text: str):
    rules = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        line = re.split(r"\s+#", line, maxsplit=1)[0].strip()
        parts = line.split()
        if len(parts) < 3:
            continue
        rules.append((parts[0], parts[1], parts[2]))
    return rules


def first_match(rules, path: str):
    for src, dst, code in rules:
        if src == path:
            return dst, code, "exact"
        if "*" in src:
            regex = "^" + re.escape(src).replace(r"\*", "([^/]+)") + "$"
            match = re.match(regex, path)
            if match:
                return dst.replace(":splat", match.group(1)), code, "splat"
    return None


def clean_target(dst: str) -> str:
    return dst.split("#", 1)[0].rstrip("/")


def article_records():
    rules = parse_redirects((SITE / "_redirects").read_text(encoding="utf-8"))
    rows = []
    for path in sorted((SITE / "blog").glob("*.html")):
        if path.name == "index.html":
            continue
        slug = path.stem
        html = path.read_text(encoding="utf-8", errors="ignore")
        canonical = None
        can = re.search(
            r"rel=[\"']canonical[\"'][^>]*href=[\"']([^\"']+)", html, re.I
        ) or re.search(
            r"href=[\"']([^\"']+)[\"'][^>]*rel=[\"']canonical[\"']", html, re.I
        )
        if can:
            canonical = can.group(1)
        robots = re.search(
            r"name=[\"']robots[\"'][^>]*content=[\"']([^\"']+)", html, re.I
        )
        title = re.search(r"<title>(.*?)</title>", html, re.I | re.S)
        desc = re.search(
            r"name=[\"']description[\"'][^>]*content=[\"']([^\"']*)", html, re.I
        )
        date = re.search(r'datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"', html)
        if not date:
            date = re.search(r"<span>(\d{4}-\d{2}-\d{2})</span>", html)
        route = f"/blog/{slug}"
        redir = first_match(rules, route)
        redirected = False
        redir_to = None
        if redir:
            dst, _code, kind = redir
            redir_to = dst
            if kind != "splat" and clean_target(dst) not in {route, route + "/"}:
                redirected = True
        expected = f"{ORIGIN}{route}"
        canonical_ok = bool(canonical) and canonical.split("#", 1)[0].rstrip("/") == expected
        noindex = bool(robots and "noindex" in robots.group(1).lower())
        reason = []
        if redirected:
            reason.append(f"301 {redir_to}")
        if noindex:
            reason.append(f"noindex {robots.group(1)}")
        if not canonical_ok:
            reason.append(f"canonical {canonical or 'missing'}")
        rows.append(
            {
                "slug": slug,
                "route": route,
                "url": expected,
                "eligible": not reason,
                "reason": reason,
                "title": unescape(re.sub("<[^>]+>", "", title.group(1))).strip()
                if title
                else "",
                "description": unescape(desc.group(1)) if desc else "",
                "date": date.group(1) if date else "",
            }
        )
    return rows


def blog_card_routes(html: str):
    routes = []
    for href in re.findall(
        r'<a href="([^"]+)" class="card ui-card ui-card--article"', html
    ):
        if href.startswith("http"):
            path = href.replace(ORIGIN, "", 1)
        elif href.startswith("/"):
            path = href
        else:
            path = "/blog/" + href
        routes.append(path.split("#", 1)[0].rstrip("/"))
    return routes


def itemlist_routes(html: str):
    match = re.search(
        r'<script type="application/ld\+json">(\{"@context":"https://schema.org","@type":"ItemList".*?)</script>',
        html,
    )
    if not match:
        return None, []
    data = json.loads(match.group(1))
    routes = []
    for item in data.get("itemListElement", []):
        url = item["item"]["url"]
        routes.append(url.replace(ORIGIN, "", 1).split("#", 1)[0].rstrip("/"))
    return data, routes


def draft_slugs():
    slugs = []
    if not DRAFTS.exists():
        return slugs
    for path in DRAFTS.rglob("*.html"):
        if path.name == "blog-list-snippet.html":
            continue
        slug = path.parent.name if path.name == "index.html" else path.stem
        slugs.append(slug)
    return sorted(set(slugs))


def main() -> int:
    errors = []
    notes = []
    rows = article_records()
    eligible = [row for row in rows if row["eligible"]]
    excluded = [row for row in rows if not row["eligible"]]
    eligible_routes = {row["route"] for row in eligible}

    headers_path = SITE / "_headers"
    headers_text = headers_path.read_text(encoding="utf-8") if headers_path.exists() else ""
    toml_text = (SITE / "netlify.toml").read_text(encoding="utf-8")
    if re.search(r"x-robots-tag\s*:\s*noindex", headers_text, re.I):
        errors.append("site-v2/_headers still sets a blanket X-Robots-Tag noindex")
    if re.search(r"noindex", toml_text, re.I):
        errors.append("site-v2/netlify.toml contains noindex")
    for header in (
        'X-Frame-Options = "DENY"',
        'X-Content-Type-Options = "nosniff"',
        'Referrer-Policy = "strict-origin-when-cross-origin"',
    ):
        if header not in toml_text:
            errors.append(f"netlify.toml missing security header {header}")

    search_html = (SITE / "search.html").read_text(encoding="utf-8")
    if 'name="robots" content="noindex,follow"' not in search_html:
        errors.append("search.html lost page-level noindex,follow")

    robots = (SITE / "robots.txt").read_text(encoding="utf-8")
    if "Sitemap: https://asiavisionled.com/sitemap.xml" not in robots:
        errors.append("robots.txt sitemap is not the production host")
    if re.search(r"(?m)^Disallow:\s*/\s*$", robots):
        errors.append("robots.txt disallows the whole site")

    blog_html = (SITE / "blog" / "index.html").read_text(encoding="utf-8")
    cards = blog_card_routes(blog_html)
    item_data, item_routes = itemlist_routes(blog_html)
    if item_data is None:
        errors.append("blog index ItemList JSON-LD missing")
        item_data = {}
    if len(cards) != len(set(cards)):
        errors.append("blog listing has duplicate cards")
    if set(cards) != eligible_routes:
        errors.append(
            f"blog cards {len(set(cards))} != eligible {len(eligible_routes)}; "
            f"missing {sorted(eligible_routes - set(cards))[:8]}; "
            f"extra {sorted(set(cards) - eligible_routes)[:8]}"
        )
    if set(item_routes) != eligible_routes:
        errors.append("blog ItemList URLs do not match eligible articles")
    if item_data.get("numberOfItems") != len(eligible):
        errors.append(
            f"ItemList numberOfItems {item_data.get('numberOfItems')} != {len(eligible)}"
        )
    if f"{len(eligible)} Articles" not in blog_html:
        errors.append("visible article count label does not match eligible inventory")

    sitemap_text = (SITE / "sitemap.xml").read_text(encoding="utf-8")
    try:
        root = ET.fromstring(sitemap_text)
    except ET.ParseError as exc:
        errors.append(f"sitemap XML invalid: {exc}")
        root = None
    locs = []
    if root is not None:
        for loc in root.iter():
            if loc.tag.endswith("loc") and loc.text:
                locs.append(loc.text.strip())
    if len(locs) != len(set(locs)):
        errors.append("sitemap has duplicate loc values")
    sm_routes = {
        loc.replace(ORIGIN, "", 1).split("#", 1)[0].rstrip("/")
        for loc in locs
        if "/blog/" in loc and not loc.rstrip("/").endswith("/blog")
    }
    if sm_routes != eligible_routes:
        errors.append(
            f"sitemap blog routes {len(sm_routes)} != eligible {len(eligible_routes)}; "
            f"missing {sorted(eligible_routes - sm_routes)}; "
            f"extra {sorted(sm_routes - eligible_routes)}"
        )
    if any("pages.dev" in loc or "netlify.app" in loc for loc in locs):
        errors.append("sitemap contains a preview host")
    if any(not loc.startswith(ORIGIN) for loc in locs):
        errors.append("sitemap contains a non-production loc")

    try:
        search = json.loads((SITE / "search-index.json").read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        errors.append(f"search-index.json invalid: {exc}")
        search = []
    blog_search = [item["u"].split("#", 1)[0].rstrip("/") for item in search if str(item.get("u", "")).startswith("/blog/")]
    if len(blog_search) != len(set(blog_search)):
        errors.append("search index has duplicate blog URLs")
    if set(blog_search) != eligible_routes:
        errors.append(
            f"search blog routes {len(set(blog_search))} != eligible {len(eligible_routes)}; "
            f"missing {sorted(eligible_routes - set(blog_search))[:12]}; "
            f"extra {sorted(set(blog_search) - eligible_routes)[:12]}"
        )

    drafts = draft_slugs()
    leaked = sorted(set(drafts) & {route.split("/")[-1] for route in (set(cards) | sm_routes | set(blog_search))})
    if leaked:
        errors.append(f"draft slugs appear in the publish indexes: {leaked}")
    if any((SITE / "draft-candidates").exists() for _ in [0]):
        pass
    if (SITE / "handoff").exists():
        errors.append("handoff directory was copied inside site-v2")

    banned = list(SITE.rglob("通用首图2.jpg")) + list(SITE.rglob("通用首图3.jpg"))
    if banned:
        errors.append(f"banned image files remain in site-v2: {[str(p.relative_to(SITE)) for p in banned]}")
    banned_refs = []
    for path in SITE.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".html", ".css", ".js", ".json", ".xml", ".txt", ".md"}:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if "通用首图2" in text or "通用首图3" in text:
            banned_refs.append(str(path.relative_to(SITE)))
    if banned_refs:
        errors.append(f"banned image referenced: {banned_refs[:12]}")

    report = {
        "html_articles_excluding_index": len(rows),
        "canonical_published_articles": len(eligible),
        "excluded_redirected_or_noncanonical": len(excluded),
        "exclusions": [
            {"slug": row["slug"], "reason": row["reason"]} for row in excluded
        ],
        "blog_cards": len(cards),
        "sitemap_locs": len(locs),
        "sitemap_blog_routes": len(sm_routes),
        "search_entries": len(search),
        "search_blog_routes": len(set(blog_search)),
        "draft_articles_outside_site": len(drafts),
        "headers_file_present": headers_path.exists(),
        "errors": errors,
        "notes": notes,
    }
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(
        f"html={len(rows)} canonical={len(eligible)} excluded={len(excluded)} "
        f"cards={len(cards)} sitemap_blog={len(sm_routes)} search_blog={len(set(blog_search))}"
    )
    if errors:
        print("FAIL")
        for error in errors:
            print(" -", error)
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
