# Alen Mammen Varghese: engineering notebook website

A personal site of build logs and short blogs. It is plain HTML, CSS and JavaScript, so there is nothing to install.

## What is in this folder

| File or folder | What it is |
| --- | --- |
| `index.html` | All the pages and their text: Home, Projects, Blogs, Contact, and the rubber-tapping write-up |
| `styles.css` | All the styling. The colours and fonts are at the top, in `:root` |
| `app.js` | The small bits of behaviour: page switching, the menu, the picture gallery, the contact box |
| `assets/` | The pictures and the video, one file each |
| `AGENTS.md` | Rules and past decisions for AI helpers (Antigravity reads this on its own) |

## See the site

Double click `index.html`. It opens in your browser. The fonts come from Google Fonts, so you need an internet connection to see them properly.

## Edit it with Antigravity

1. Open Antigravity.
2. Choose **File, then Open Folder**, and pick this `alen-site` folder itself (not a folder above it).
3. Ask the agent for a change in plain words. Good examples:
   - "Add a new project called ... to the Projects page. Use the same card style as the rubber-tapping one."
   - "Change the email address everywhere to ..."
   - "Write my second blog post and add it to the Blogs page."
4. Open `index.html` in your browser and refresh to check the result.

The agent will read `AGENTS.md` first, so it already knows your colours, fonts, writing style, and the things you have already decided against.

## Things you will want to change soon

- **Your email address.** It is still the placeholder `hello@example.com`. Search for it in `index.html` (about three places in links, plus `data-email` in the Contact section).
- **Blogs.** The page is empty on purpose. There is no blog post template yet, so ask the agent to make one.

## Put it online (free options)

Any of these will host a folder like this: Netlify (drag the folder onto their Drop page), Cloudflare Pages, GitHub Pages, or Vercel. Upload the whole folder, with `index.html` at the top level.

## Keep a safety net

Before big changes, copy the folder, or run `git init` and `git commit` inside it, so you can always go back.
