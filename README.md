# arsh0388.github.io

Personal portfolio of Arsh Arora. Plain HTML/CSS/JS with no build step, served by GitHub Pages.

## Deploy (free, about 2 minutes)
1. Create a **public** GitHub repo named exactly `Arsh0388.github.io`.
2. Push this folder to it:
   ```bash
   git init && git add . && git commit -m "Portfolio" && git branch -M main
   git remote add origin https://github.com/Arsh0388/Arsh0388.github.io.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages → Build and deployment**, set **Source: Deploy from a branch**, choose **main / (root)**, then **Save**.
4. After about a minute the site is live at **https://arsh0388.github.io/**.

## Update
Edit `index.html` (content), `styles.css` (look) or `main.js` (interactions), then commit and push. Replace the PDFs in `assets/resume/` when the resumes change.

## Preview locally
`python3 -m http.server 8000`, then open http://localhost:8000
