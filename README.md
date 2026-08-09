# onder balta

The current front end for my personal portfolio.

It is a static site built with HTML, CSS, JavaScript, and Three.js. The main
page presents a responsive CRT television wall inside a 3D concrete room. Its
project screens open focused views with supporting information, media, and
external links.

## Project structure

- `index.html` contains the page structure and interface markup.
- `styles.css` contains the desktop and mobile layouts.
- `script.js` contains the Three.js scene, CRT shaders, interactions, project
  data, and language switching.
- `server.js` provides the local development server.
- `assets/` contains the production fonts, images, videos, textures, and 3D
  model used by the site.

## Run locally

```bash
node server.js
```

Then open `http://localhost:5500`.

Use `http://localhost:5500/?mobile=1` to force the mobile layout on desktop.
