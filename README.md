# vladtimchenko-website

Personal website and blog. Live at [vladtimchenko.dev](https://vladtimchenko.dev).

The project is intentionally simple: a static-first Nuxt app with a small runtime layer for feeds and metadata, deployed on Cloudflare Pages.

---

## Stack

**Frontend:** Nuxt 3, Vue 3, TypeScript, Tailwind CSS

**Modules:** Nuxt Content (MDX feed), VueUse Motion, @nuxtjs/tailwindcss

**Runtime:** Nitro on Cloudflare Pages.  
Requests to /rss.xml, /sitemap.xml, and /robots.txt are handled by the same application at runtime. There is no separate backend service or database.

**Content:**
- Blog posts: file-based MDX in src/data/feed
- Home page and CV: JSON-based content

---

## Integrations

**GitHub API:**  
Used to fetch stars and repository metadata for the site repository (/api/site-repo) and featured projects (/api/repos). Responses are cached to avoid unnecessary API calls.

**Giscus:**  
Comments on feed posts via GitHub Discussions. Configuration and theme are provided through runtime config. Allowed origins include production and localhost for local development.

**Server routes:**
- /rss.xml - RSS feed
- /sitemap.xml - sitemap
- /robots.txt - robots configuration

All routes are generated dynamically from content and config.

---

## Deploy

**Hosting:** Cloudflare Pages

**CI/CD:** GitHub Actions on push to main.

The workflow:
1. Checks out the repository
2. Runs npm ci
3. Builds the app (npm run build)
4. Deploys the dist output to Cloudflare Pages via Wrangler

Concurrency is enabled to cancel in-progress runs on new pushes.

**Screenshots automation:**  
When src/**, public/**, or relevant config or dependency files change, the workflow:
- runs Playwright
- captures documentation screenshots
- publishes them to the assets branch under screenshots

Images are served directly from the assets branch via raw.githubusercontent.com.

**Secrets and vars:**
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID
- CF_PAGES_PROJECT

Optional:
- SITE_URL (base URL for screenshot capture)
- GITHUB_SITE_REPO
- Giscus-related runtime variables

---

## Showcase

Generated automatically by scripts/documentation/capture-docs.mjs and published to the assets branch.  
Used as a visual showcase of layout, content structure, and integrations.

### About

![About](https://raw.githubusercontent.com/curiousvlxd/vladtimchenko-website/assets/screenshots/1-home-about-section.png)

---

### CV

![CV](https://raw.githubusercontent.com/curiousvlxd/vladtimchenko-website/assets/screenshots/2-home-cv.png)

---

### Experience

![Experience](https://raw.githubusercontent.com/curiousvlxd/vladtimchenko-website/assets/screenshots/3-home-experience-section.png)

---

### Volunteering

![Volunteering](https://raw.githubusercontent.com/curiousvlxd/vladtimchenko-website/assets/screenshots/4-home-volunteering-section.png)

---

### Education

![Education](https://raw.githubusercontent.com/curiousvlxd/vladtimchenko-website/assets/screenshots/5-home-education-section.png)

---

### Projects

![Projects](https://raw.githubusercontent.com/curiousvlxd/vladtimchenko-website/assets/screenshots/6-home-projects-section.png)

---

### Feed

![Feed](https://raw.githubusercontent.com/curiousvlxd/vladtimchenko-website/assets/screenshots/7-feed-list.png)

---

### Article

![Article](https://raw.githubusercontent.com/curiousvlxd/vladtimchenko-website/assets/screenshots/8-feed-first-article.png)
