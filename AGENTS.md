# Alen's engineering notebook: rules for AI helpers

A personal website of build logs and short blogs for Alen Mammen Varghese, a mechanical engineer (robotics, CAD, simulation). It is NOT a portfolio and NOT a freelance site. Client work lives on gimli.works.

## Files
- `index.html`: every page, switched by the URL hash: `#/`, `#/projects`, `#/blogs`, `#/contact`, `#/project/<slug>`. The hero drawing on the home page is an inline SVG. Keep it inline so it can use the CSS variables.
- `styles.css`: all styling. Variables are at the top in `:root`.
- `app.js`: routing (`route()` and its `known` list), the menu and its previews, galleries, the contact box, and the `REL` list of releases.
- `assets/`: pictures (WebP) and the video (MP4).

## Design
Dark, minimal, Swiss. Colours (use the variables, never new hex values): `--bg #101211` Carbon Powder, `--ink #E7D4BB` Almond Light, `--ink-2 #9A8C74`, `--ink-3 #5F5649`, `--rule-2 #3B3A30`, `--red #857861` Golden Sandlewood (accent), `--rouge #48252F` Plum Wine, `--plate #E7D4BB`.
Fonts: Nanum Myeongjo for titles and big words, Lato for body text, Arapey italic for intro lines, Geist Mono for dates and tiny labels.
Pictures sit on almond "plates". Charts and figures must be recoloured into the palette. Never put a bright white picture on the dark page.
Keep it quiet: no extra decoration, no new divider lines, motion must respect `prefers-reduced-motion`.

## Writing rules (very important)
- Write so a kid could follow: what it is, why, how it works, how it was tested by simulation, what the tests showed, how that changed the design, and what is still unknown.
- Few numbers and no jargon. Short sentences. First person, warm, human. It must not sound like AI.
- No em dashes, no en dashes, no hyphens or underscores in the prose (hyphens in names such as "rubber-tapping" are fine), and no arrows in sentences.
- Stay honest: the rubber-tapping machine is designed and tested on a computer only. Keep the plain note that AI tools helped.

## Decisions already made (do not redo)
- No portrait or photo of Alen in the hero. The hero is a line drawing of a workbench with a workstation PC, two monitors, a laptop and a 3D printer, and the heading "Hey! I'm Alen".
- Header: his name plus a round toggle that opens a translucent full-screen menu with page previews. Home has no preview.
- No margin or divider lines in the header or hero. The footer is minimal: one line of text, four icons, copyright, Back to top. An illustrated footer was rejected.
- Project cards show only the picture, the published date and the title.
- The home page lists Projects and Blogs, each with its latest two entries from `REL`, and stays blank if there are none. There is no Contact row.
- The Spider-Man scroll easter egg was removed. Do not bring it back.

## How to add things
- New project: copy the card in `#projects .pgrid` (picture, `<time>`, title, `data-tags="eng"` or `"prod"`), copy the structure of `<article data-slug="rubber-tapping-machine">`, add a `{k,d,t,kind:'Log',h:'#/project/<slug>'}` entry to `REL` in `app.js`. The home rows and menu preview update by themselves.
- New blog post: add a `kind:'Blog'` entry to `REL`. There is no blog template yet, so create one that matches the project page style.
- Email address: `data-email` on `.ct-in` in the Contact section, and the `mailto:` links in the footer (`varghesemalen@gmail.com`).
- New page: add `<main class="page" data-page="name">`, add the name to the `known` list in `route()`, and add a link in the menu `nav`.

## Before you say you are done
Open each page at 360, 390, 820 and 1286 px wide. Check there is no sideways scrolling, the menu opens and closes, the gallery and video work, and the dark theme is still consistent.
