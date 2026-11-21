# Spec: Clinical Study Finder

## Goal (one or two sentences)

Build a simple website for principal investigators, sub-investigators and physicians to quickly find clinical studies in gastroenterology. Users browse studies by category and open a study for more details.

## Users

- Principal investigators
- Sub-investigators
- Physicians

## Features (numbered, so prompts can refer to them)

1. **Category selection**
   - Show category buttons for CED, Liver and Esophagus.
   - Selecting a category filters the study list to studies in that category.
   - The selected category is visually indicated.
   - after clicking the category , you get the list of the studies

2. **Study list**
   - Display a short list of matching studies.
   - Each study entry shows at least:
     - Title
     - Category
     - Short description, for example the investigational product (IP)
     - Recruiting status

3. **Recruiting status**
   - Show a clear recruiting indicator:
     - Recruiting: check mark
     - Not recruiting: cross

4. **Study details**
   - Clicking a study opens or expands a details view.
   - The details view shows more information about the selected study.
   - The user can return to the study list.

5. **Navigation flow**
   - Find a category, browse matching studies, then open study details.

   6. **Login credentials**
   - without DB 
   - save insert data in JSON
   - Password as SHA256
   
   7. **Formular zum eingeben der Studien und zum bearbeiten**
   - nur für eingeloggte User 
   - speichere in ein JSON Data 

   8. **Server mittels Node.js + Express**
   

## Acceptance criteria (how I know a feature works)

1. The page presents the title "Clinical Study Finder".
2. The introductory text identifies the target users and gastroenterology use case.
3. CED, Liver and Esophagus are visible as category options.
4. Clicking CED, Liver or Esophagus updates the list to matching studies only.
5. Every study row contains a title, category, IP medication, short overview and recruiting status.
6. Recruiting and not recruiting studies use distinct check and cross indicators.
7. Clicking a study opens a details view containing additional study information.
8. The details view can be closed or navigated back to the list.
9. The experience follows the flow: find category -> browse studies -> open details.
10. The layout remains readable and usable on desktop and mobile screens.

## Out of scope (do NOT build)

- User authentication or accounts
- Creating, editing or deleting studies
- Backend persistence or database integration
- External clinical-trial API integration
- Advanced search, filtering or sorting
- Registration or submission workflows

## Look & feel

- Clean, medical-professional and easy to scan.
- Prominent page title: "Clinical Study Finder".
- Three category cards or buttons: CED, Liver and Esophagus.
- The category area matches the simple sketch: CED green, Liver blue and Esophagus red.
- Study entries appear as compact rows with title, short overview and a "Details" action.
- Recruiting status is easy to recognize using a check mark or cross.
- Use restrained spacing, clear typography and a neutral/light background.
- use bootsstrap.css, js, icons
