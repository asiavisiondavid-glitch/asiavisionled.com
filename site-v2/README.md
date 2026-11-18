# Asia Vision Technology Website

Source files for [asiavisionled.com](https://asiavisionled.com), the official website of Shenzhen Asia Vision Technology Co., Ltd.

## Snapshot

- Website release: `V6.516.08.10.26`
- Content: English and Chinese pages, product pages, blog articles, case studies, images, CSS and JavaScript
- Deployment: static site configured for Netlify through `netlify.toml`
- Build step: none; production files are served directly from the repository root

## Main Structure

- `index.html`, `about.html`, `contact.html`, `products-v2.html`: English core pages
- `zh/`: Chinese-language pages
- `products/`, `cases/`, `factory/`, `faq/`: detail pages
- `blog/`: generated article pages and supporting assets
- `css/`, `js/`, `images/`: shared static assets
- `netlify.toml`, `_redirects`, `sitemap.xml`, `robots.txt`: deployment and SEO configuration

## Local Preview

Run a static server from the repository root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Editing Notes for Cloud AI

- Edit the HTML, CSS and JavaScript files directly. Do not introduce a framework or build system unless the task explicitly requires one.
- Preserve canonical URLs, internal links, form endpoints and deployment redirects unless the requested change specifically targets them.
- Keep the English and Chinese versions consistent when changing shared navigation, product information, contact details or company claims.
- Use relative, existing image paths. Optimize replacement images before committing and avoid adding credentials, analytics secrets or `.netlify` state.
- Preview the affected pages locally before committing and report any pages that were not checked.

## Deployment

The repository contains the deployable static files. A connected Netlify project can deploy the repository root without a build command.
