# Repository Instructions

This repository contains the production static website for asiavisionled.com.

- Treat the repository root as the deployable site root.
- Keep changes scoped to the requested pages and shared assets.
- Preserve canonical URLs, redirects, Netlify Forms behavior, analytics configuration and existing file paths unless the task explicitly changes them.
- Maintain matching English and Chinese content where the same business information appears in both languages.
- Use `python3 -m http.server 8080` to preview locally.
- Do not add build tooling, credentials, `.netlify` state or unrelated production backups.
- Before finishing a change, inspect the diff and verify the affected HTML for broken asset paths and malformed markup.
