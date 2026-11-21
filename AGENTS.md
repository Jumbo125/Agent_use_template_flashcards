# Instructions for AI assistants

## Project
Beginner project. Read SPEC.md for what to build. Never edit SPEC.md.

## Technology
- Backend: Node.js with Express.js (REST API). Use npm for dependencies;
  keep dependencies minimal (express, and only what's clearly needed,
  e.g. a QR code or upload library).
- Frontend: HTML, CSS via Bootstrap, vanilla JavaScript + Bootstrap JS,
  Bootstrap Icons. QR codes via QRCode.js.
- Files: server.js (Express app and routes), public/ (index.html,
  style.css, script.js, images), data/ (JSON files for users and
  entries), uploads/ (videos and attachments). Ask before creating new
  files or folders beyond this structure.

## Code style
- Write code a first-semester student can read: simple loops,
  descriptive variable names, small functions (max ~20 lines).
- Use const/let, never var. Use addEventListener, not onclick attributes.
- Add a short comment above each function explaining what it does.
- Express routes may use async/await where needed for file I/O; keep
  everything else free of clever one-liners or advanced patterns
  (classes, modules) unless I explicitly ask.

## How to work
- Only implement what the current prompt asks for. Do not add
  extra features, even if they seem useful. Suggest them instead.
- Only change the files and functions needed for this step.
- If something is unclear, ask a question before writing code.
- After making changes, explain briefly what you changed and why,
  and tell me how to test it in the browser.
- At the end of each step, propose an update to PROGRESS.md.