# Computer — website

Aero-styled site for the **Computer** Discord bot. It is a plain, static site —
no build step, no framework, no dependencies — published with GitHub Pages.

This is a normal scrolling website wearing the Windows&nbsp;Aero visual
language: translucent "glass" panels, soft blue gradients, glossy highlights
and gentle shadows. It is deliberately **not** a mock desktop — there is no
taskbar, no Start menu and no draggable windows. Just a sticky glass header,
a content column, a sticky on-page list and a footer.

**Live:** https://notmicrosoft2000-cmd.github.io/computer/

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — welcome, two feature cards, command preview, setup guide, sample status, changelog. |
| `space-mafia.html` | The Space Mafia game: simulated lobby console, roles, voting example, house rules. |
| `telephone.html` | The cross-server telephone: simulated switchboard + call log, etiquette, privacy. |
| `commands.html` | Full command reference, filterable, grouped into General / Space Mafia / Cross-server matchmaking / Telephone / Administration / Configuration. |
| `docs.html` | Installation, permissions, self-hosting, troubleshooting and FAQ. |
| `community.html` | Verified project links and contributing notes. |
| `privacy.html` | Privacy policy. |
| `terms.html` | Terms of service. |
| `404.html` | "Page not found" (GitHub Pages custom 404; note the `<base href="/computer/">`). |

## Structure

```
computer-site/
├── index.html, space-mafia.html, telephone.html,
│   commands.html, docs.html, community.html,
│   privacy.html, terms.html, 404.html
├── .nojekyll                 # serve files as-is on GitHub Pages
└── assets/
    ├── css/aero.css          # the whole theme: shell + components
    ├── js/main.js            # vanilla JS for the nav and the demos
    └── img/*.svg             # flat single-colour icons
```

The header, footer and page grid are emitted by a small one-shot generator
(`aero.py`, kept outside the repo) that reads each page's existing content and
re-wraps it. The generated HTML is committed; the site itself has no build
step.

## Run locally

Because the site is static, any web server works:

```sh
cd computer-site
python3 -m http.server 8000
# then open http://localhost:8000/
```

To preview `404.html` with its real base path, serve a directory that contains a
`computer/` folder pointing at this one, then open `/computer/404.html`.

## Ground rules baked into this site

- **Nothing is faked as live.** The status lights and call log are explicitly
  labelled *sample* / *demo*. There is no backend.
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

- All styling lives in `assets/css/aero.css`. Design tokens (colour, glass,
  shadow, radius, font) are CSS custom properties at the top of the file;
  change them there rather than hunting for hex values.
- Page behaviour lives in `assets/js/main.js`; it is defensive, so pages only
  use the parts they include. It drives the mobile nav, the on-page (TOC)
  scroll-spy, the command filter, and the Space Mafia / telephone demos.
- A page with a sticky on-page list uses `.page-grid.has-aside` plus an
  `<aside class="page-aside">`; pages without one just use `.page-grid`.
- When you change the real bot's commands or features, update `commands.html`
  and the relevant feature page to match.
