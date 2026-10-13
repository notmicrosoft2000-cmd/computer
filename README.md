# Computer — website

Windows&nbsp;7 desktop-style site for the **Computer** Discord bot, built on the
real [7.css](https://khang-nd.github.io/7.css/) library. It is a plain, static
site — no build step, no framework — published with GitHub Pages.

Every page is an application window on a shared desktop: the same wallpaper,
desktop shortcuts, taskbar, Start menu and window frame surround each page's
content.

**Live:** https://notmicrosoft2000-cmd.github.io/computer/

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — welcome, two feature windows, command preview, setup guide, sample status, changelog. |
| `space-mafia.html` | The Space Mafia game: simulated lobby console, roles, voting example, house rules. |
| `telephone.html` | The cross-server telephone: simulated switchboard + call log, etiquette, privacy. |
| `commands.html` | Full command reference, filterable, grouped into General / Space Mafia / Telephone / Administration / Configuration. |
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
    ├── vendor/7.css          # the 7.css library (vendored, self-contained)
    ├── vendor/7.css.LICENSE  # its MIT licence
    ├── css/win7.css          # desktop shell + content styling on top of 7.css
    ├── js/main.js            # vanilla JS for the shell and the demos
    └── img/*.svg             # pixel-art icons (crispEdges, no gradients)
```

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

- Visual language comes from 7.css. Add desktop shell and content styling in
  `assets/css/win7.css` rather than overriding the Aero window frames, buttons
  and fields.
- Page behaviour lives in `assets/js/main.js`; it is defensive, so pages only
  use the parts they include. The shell (Start menu, clock, window controls)
  and the Space Mafia / telephone demos are all self-contained.
- When you change the real bot's commands or features, update `commands.html`
  and the relevant feature page to match.
