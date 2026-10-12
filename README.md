# Computer — website

Retro late-1990s website for the **Computer** Discord bot, built on the real
[98.css](https://jdan.github.io/98.css/) library. It is a plain, static site —
no build step, no framework — published with GitHub Pages.

**Live:** https://notmicrosoft2000-cmd.github.io/computer/

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — welcome panel, two feature windows, command preview, setup guide, sample status, changelog. |
| `space-mafia.html` | The Space Mafia game: simulated lobby console, roles, voting example, house rules. |
| `telephone.html` | The cross-server telephone: simulated switchboard + call log, etiquette, privacy. |
| `commands.html` | Full command reference, filterable, grouped into General / Space Mafia / Telephone / Administration / Configuration. |
| `docs.html` | Installation, permissions, self-hosting, troubleshooting and FAQ. |
| `community.html` | Verified project links and contributing notes. |
| `404.html` | Retro "page not found" page. |

## Structure

```
computer-site/
├── index.html, space-mafia.html, telephone.html,
│   commands.html, docs.html, community.html, 404.html
├── .nojekyll                 # serve files as-is on GitHub Pages
└── assets/
    ├── vendor/98.css         # the 98.css library (vendored, unpinned from CDN)
    ├── vendor/ms_sans_*.woff2# the fonts 98.css references
    ├── css/retro.css         # layout, typography and retro-web decoration
    ├── js/main.js            # vanilla JS for the demos and interactions
    └── img/*.svg             # pixel-art icons (crispEdges, no gradients)
```

## Run locally

Because the site is static, any web server works:

```sh
cd computer-site
python3 -m http.server 8000
# then open http://localhost:8000/
```

(Opening the `.html` files directly from disk also works, except that the
vendored font and CSS load more reliably over HTTP.)

## Ground rules baked into this site

- **Nothing is faked as live.** The status lights, visitor counter and call log
  are explicitly labelled *sample* / *demo*. There is no backend.
- **Every demo is simulated.** The lobby console and telephone run entirely in
  the browser; they never contact Discord or the bot.
- **Commands are real.** The reference is taken from the bot's own
  documentation. It is not invented, and it carries a note that behaviour can
  change between versions.
- **Only verified links.** The Community page links only to projects that
  exist. The bot's source repository is private, so no public source link is
  shown.
- **No secrets.** There are no tokens, keys or private data anywhere in the
  front-end.

## Editing

- Visual language comes from 98.css. Add layout in `assets/css/retro.css` rather
  than overriding the core bevels.
- Page behaviour lives in `assets/js/main.js`; it is defensive, so pages only
  use the parts they include.
- When you change the real bot's commands or features, update `commands.html`
  and the relevant feature page to match.
