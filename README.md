# MarioDex 3D

A 3D character encyclopedia for the Super Mario universe, built with React, TypeScript and Three.js. Browse the characters as cards, then open any of them to explore a 3D model.

Live: https://fchapoulliep.github.io/mariodex3d/

## Features

- 154 characters and outfits in a horizontal card carousel, with navigation arrows and keyboard control
- Search by name, case and accent insensitive
- Filter by kingdom (15 kingdoms, such as Mushroom Kingdom, Metro Kingdom and Bowser's Kingdom)
- Tilt cards with a glare effect, styled after the character's kingdom, with kingdom badges
- A page per character with its name, description, badges and a background matching its kingdom
- Interactive 3D viewer: drag to orbit, scroll to zoom, auto-rotation, camera fitted to the model, idle animation played when the model has one
- Previous and next arrows to step through the characters
- Star loading animation and a navigation bar with a live clock on the character page

## Tech Stack

- React 18
- TypeScript 5.6
- Vite 6
- Three.js 0.171
- React Three Fiber 8 and Drei 9
- Swiper 11
- React Router 7 (`HashRouter`)
- react-parallax-tilt
- ESLint 9
- gh-pages

## Getting Started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local URL. The app is served under the `/mariodex3d/` base path, set in `vite.config.ts`.

Other scripts:

```bash
npm run build     # type-check with tsc, then build to dist/
npm run preview   # serve the production build locally
npm run lint      # run ESLint
```

### Deploy to GitHub Pages

```bash
npm run build
npm run deploy
```

`deploy` publishes the existing `dist/` folder to the `gh-pages` branch. It does not build first, so run `build` before it.

## Project Structure

```
public/
  models/<Name>/<Name>.glb     3D models, one folder per character
  sprites/<Name>.webp          card images
  type_icons/                  kingdom badge icons
  backgrounds/                 character page backgrounds, one per kingdom
src/
  components/                  dex page, cards, character page and 3D viewer
  css/                         stylesheets
  data/mariocharacters.json    character list (id, name, kingdoms, description)
  assets/                      logo, font, card art, arrows
```

## Notes

- A character's `name` in `src/data/mariocharacters.json` is also the file name of its model and sprite. Adding a character means adding the JSON entry, `public/models/<Name>/<Name>.glb` and `public/sprites/<Name>.webp`.
- The models are glTF binary files exported from Blender, loaded with Drei's `useGLTF`. They ship with the repository (about 225 MB), so the first clone takes a while.
- Routing uses a hash router, so character links look like `#/12` and work on GitHub Pages static hosting.
- Fan project, not affiliated with or endorsed by Nintendo. Characters and related assets belong to their respective owners.
