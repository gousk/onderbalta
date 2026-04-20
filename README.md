# onder balta

This is the current front-end for my personal site.

It is a static site built with plain HTML, CSS, and JavaScript. The main page uses a video-driven ASCII hero, followed by a gallery of posts. Each post opens in an overlay and can show different types of content depending on the item: video, image, carousel, website preview, or embedded game build.

## What is in the project

- `index.html`
  Main page structure, overlay markup, hidden source video, and social links.

- `styles.css`
  All visual styling, layout, gallery grid, overlay styles, and responsive behavior.

- `script.js`
  ASCII rendering logic, gallery rendering, post data, overlay behavior, carousel handling, and media/game embedding.

- `server.js`
  Small local server for running the site without `file://` issues.

- `assets/`
  Local assets such as fonts and icon files.

## Media

Most project media is loaded from external URLs, mainly Cloudinary. Some items also use external platforms such as itch.io or separately hosted WebGL builds.

## Running locally

Serve the project locally instead of opening `index.html` directly.

```powershell
cd C:\Users\onder\Documents\GitHub\onderbalta.com
node server.js
```

Then open:

```text
http://localhost:5500
```

## Notes

- This is not a framework-based app.
- A large part of the site content is driven directly from the post data inside `script.js`.
- Some embedded game content depends on third-party hosting behavior, so not every external build can be embedded reliably without hosting it separately.
