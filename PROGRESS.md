# Progress

## Done

- Added and finalized the `SPEC.md` for the Clinical Study Finder.
- Captured categories, study fields, recruiting status, details behavior and visual direction.
- Defined acceptance criteria and explicitly listed out-of-scope features.
- Created the page structure in `index.html`.
- Added CED, Liver and Esophagus category controls.
- Added a selected state for the active category.
- Created a small sample dataset with two studies per category.
- Implemented category filtering so the matching studies appear after selection.
- Added a check mark for recruiting and a cross for not recruiting studies.
- Added study titles, categories and short descriptions to each result.
- Added expandable study details with a `Details` button.
- Added a `Back to list` action to close the details.
- Styled the interface in `style.css` as a clean, medical-professional layout.
- Added responsive behavior for desktop and mobile screens.
- Verified that `script.js` has valid JavaScript syntax.
- Implemented the navigation from category selection to study list and details.
- Added a `Back to categories` action for returning to category selection.
- Added a login modal with username and password fields.
- Added `users.json` for login credentials without a database.
- Implemented SHA-256 password hashing in the browser.
- Added login success, invalid-login feedback and logout behavior.
- Added a study administration area for logged-in users.
- Added a form for creating and editing studies.
- Added study fields for title, category, overview, recruitment status and details.
- Saved study changes in browser local storage.
- Added a JSON download action for saving the current study data.
- Added an Express server in `server.js`.
- Added `package.json` with the start script and Express dependency.
- Added API endpoints for login, study loading, study creation and study editing.
- Connected the browser login and study form to the Express API.
- Split persisted data into separate directories:
  - User JSON files under `User/*.json`.
  - Study JSON files under `Studies/*.json`.
- Updated login and study API handling to read and write the split JSON directories.
- Made server-side JSON writes atomic by writing to a temporary file before replacing the target file.
- Updated study renames to save the new file before removing the old one.

## Next

- Verify desktop and mobile behavior for the new Bootstrap-based layout in the browser.
- Test the complete category -> list -> details flow in the browser.
- Replace sample study content with final study data when available.

## Decisions & notes

- Product name: Clinical Study Finder.
- Target users: principal investigators, sub-investigators and physicians.
- Supported categories for the first version: CED, Liver and Esophagus.
- Recruiting status should be clearly represented with a check mark or cross.
- Study details should open from each study row and allow return to the list.
- The implementation uses plain HTML, CSS and JavaScript.
- No Bootstrap integration was present in the inspected files.
- The category, study-list and details styling follows the existing light, professional visual design.

## Known problems

- No final sample study content or recruitment-status data is specified in the source brief.
- The new Bootstrap-based look & feel has not yet been verified in a browser (desktop and mobile).