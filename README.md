# Merve Devrim — Portfolio

Personal portfolio website, published with GitHub Pages:

- English: **https://mervedevrim.github.io**
- Turkish: **https://mervedevrim.github.io/tr/**

Plain HTML, CSS and a small JavaScript file. No build step, no framework.

## Files

| File | What it is |
| --- | --- |
| `index.html` | English page (opens at the main address) |
| `tr/index.html` | Turkish page (opens at `/tr/`) |
| `assets/css/style.css` | Design: colors, fonts, layout. Colors are at the top, in `:root` |
| `assets/js/site.js` | Visual/Code switch, layers panel, measurements, copy button |
| `assets/fonts/` | Geist and Geist Mono (self-hosted, SIL Open Font License) |
| `assets/cv/Merve-Devrim-CV.pdf` | English CV ("Download CV" buttons) |
| `assets/cv/Merve-Devrim-Ozgecmis.pdf` | Turkish CV ("CV İndir" buttons) |
| `assets/img/og-image.png`, `og-image-tr.png` | Preview images shown when the link is shared |
| `favicon.svg` | Browser tab icon |

## Common updates

- **Change text:** edit `index.html` (English) and `tr/index.html` (Turkish). Each section starts with a comment such as `<!-- EXPERIENCE -->`. The Code view updates itself, because it is read from the page.
- **Replace a CV:** upload the new PDF to `assets/cv/` with the same file name.
- **Add a section:** copy one `<section class="frame">…</section>` block, give it a new `id`, and add a matching link in the layers list (`<nav class="layer-list">`).
- **Custom domain (later):** Settings → Pages → Custom domain.

Changes go live about a minute after they are committed.
