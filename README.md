# Amusa Abisola Bukola - Student Portfolio

A responsive portfolio and academic management website for COS 106 (Introduction to Web Technologies, MIVA Open University). It uses plain HTML, CSS and JavaScript only. No installs needed.

## Folder structure

```
portfolio-site/
  index.html      Home page (name, photo, welcome message, biography)
  about.html      About me (education, career aspirations, skills table, hobbies, audio)
  projects.html   Three simulated sample projects
  planner.html    Academic Planner (add / complete / edit / delete tasks)
  contact.html    Contact form with validation
  css/style.css   All styles
  js/main.js      Mobile menu button
  js/planner.js   Academic Planner logic
  js/contact.js   Form validation
  images/         Student photo and project pictures
  media/          Audio file (welcome-tone.wav)
```

## How to open it

Double-click `index.html`. It opens in your browser. Use the menu to visit the other pages.

## Where to edit things

- Text: open any `.html` file in an editor and change the words between the tags.
- Photo: replace `images/student-picture.png`.
- Projects: edit `projects.html` (images are `project1.svg`, `project2.svg`, `project3.svg`).
- Colours: change the values at the top of `css/style.css` (the `:root` section).

## Put it on GitHub and host with GitHub Pages

1. Create a free account at github.com.
2. Click "New repository", name it (for example `portfolio-site`), keep it Public, and create it.
3. Click "uploading an existing file", drag in everything inside the `portfolio-site` folder (keep the folders), and click "Commit changes". Make sure `index.html` is at the top level of the repository.
4. Go to Settings > Pages.
5. Under "Build and deployment", choose "Deploy from a branch", pick the `main` branch and the `/ (root)` folder, then Save.
6. Wait a minute or two. Your site will be at `https://your-username.github.io/portfolio-site/`.
