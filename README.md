# onder balta

Personal portfolio site built as a static front-end project.

The site combines a video-driven ASCII hero, a scroll-revealed gallery, and project overlays for videos, websites, and playable experiments. Media is loaded from external sources such as Cloudinary, and the front end is kept lightweight with plain HTML, CSS, and JavaScript.

## Features

- Live ASCII-rendered hero section based on video frames
- Layered visual treatment with background media and custom typography
- Gallery layout for video, image, website, and game entries
- Overlay-based project view with support for video, image, carousel, and embedded game content
- External links for portfolio items, social profiles, and project destinations

## Project Structure

```text
.
├─ index.html
├─ styles.css
├─ script.js
├─ server.js
└─ assets/
```

## Running Locally

The site should be served through a local server instead of opening `index.html` directly, since some browsers restrict video and canvas behavior over `file://`.

```powershell
cd C:\Users\onder\Documents\GitHub\onderbalta.com
node server.js
```

Then open:

```text
http://localhost:5500
```

## Notes

- This project is front-end only.
- Some media and embedded content depend on third-party hosting.
- Certain game builds may require their own hosting setup instead of direct embedding from itch.io.
