# Instructions for AI assistants

## Project
Beginner project. Read SPEC.md for what to build. Never edit SPEC.md.

## Technology
- Frontend: plain HTML, CSS and JavaScript in `public/`.
- Backend: Node.js and Express in `server/server.js`.
- JSON data: `data/User/` and `data/Studies/`.
- Keep npm dependencies and scripts in the project-root package files.
- The frontend uses Bootstrap from a CDN and has no separate build step.
- Ask before creating new application files.

## Code style
- Write code a first-semester student can read: simple loops,
  descriptive variable names, small functions (max ~20 lines).
- Use const/let, never var. Use addEventListener, not onclick attributes.
- Add a short comment above each function explaining what it does.
- No clever one-liners, no advanced patterns (classes, modules,
  async chains) unless I explicitly ask.

## How to work
- Only implement what the current prompt asks for. Do not add
  extra features, even if they seem useful. Suggest them instead.
- Only change the files and functions needed for this step.
- Main frontend files: `public/index.html`, `public/css/style.css`,
  and `public/js/script.js`.
- If something is unclear, ask a question before writing code.
- After making changes, explain briefly what you changed and why,
  and tell me how to test it in the browser.
- At the end of each step, propose an update to PROGRESS.md.