# Project Structure

## Current status

The project has been reorganized. This document describes the current
directories and file paths.

## Current project inventory

```text
Agent_use_template_flashcards/
|-- data/
|   |-- Studies/
|   |   |-- ced-01.json
|   |   |-- ced-02.json
|   |   |-- esophagus-01.json
|   |   |-- esophagus-02.json
|   |   |-- liver-01.json
|   |   `-- liver-02.json
|   `-- User/
|       `-- gastroadmin.json
|-- docs/
|   |-- Insights.md
|   `-- PROGRESS.md
|-- node_modules/                 Generated npm dependencies
|-- public/
|   |-- css/
|   |   `-- style.css
|   |-- js/
|   |   `-- script.js
|   `-- index.html
|-- server/
|   `-- server.js
|-- .gitattributes
|-- .gitignore
|-- AGENTS.md
|-- package-lock.json
|-- package.json
|-- PROJECT_STRUCTURE.md
|-- README.md
`-- SPEC.md
```

## Responsibilities and paths

- `package.json` and `package-lock.json` are in the project root. Run the
  application from the root with `npm start`, which executes
  `node server/server.js`.
- `server/server.js` hosts the Express API. It resolves the project root from
  its own directory, serves static files only from `public/`, and reads or
  writes JSON files under `data/`.
- `public/index.html` is the frontend entry point. It loads
  `public/css/style.css` and `public/js/script.js` using paths relative to
  `public/`. The frontend calls the API on the same origin using `/api/...`.
- `data/User/*.json` stores user names, password hashes, and roles. These files
  are outside the static directory.
- `data/Studies/*.json` stores one study per file, including its title,
  category, overview, recruiting status, and details.
- `docs/Insights.md` and `docs/PROGRESS.md` contain project notes and progress
  history. `SPEC.md`, `AGENTS.md`, and this document remain in the project
  root.
- `node_modules/` is generated from the package files and should not be moved
  manually.

The server blocks direct requests to `/User` and `/data`; user and study data
are accessed through the API rather than served as static files.
