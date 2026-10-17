# Srushthi M S: Portfolio Site


AWS DEPLOYMENT LINK:https://staging.d89sdl6xozhjq.amplifyapp.com/


A fast, static portfolio. No build step, no dependencies, no server. It is plain HTML, CSS and JavaScript, so it deploys to almost any host in a few minutes.

## What is in the box

| File | Purpose |
| --- | --- |
| `index.html` | The page: all the text and sections |
| `style.css` | All the styling, colors, fonts and background effects |
| `script.js` | The behavior: theme toggle, Query Lab, animations |
| `404.html` | Custom "page not found" page |
| `favicon.svg` | Browser tab icon |
| `og-image.png` | Preview card shown when the link is shared (if present) |
| `robots.txt`, `sitemap.xml` | Search engine basics |
| `_headers` | Security and cache headers (Netlify and Cloudflare Pages) |
| `netlify.toml`, `vercel.json` | Host settings for Netlify and Vercel |
| `.github/workflows/deploy.yml` | Automatic deploy to GitHub Pages |
| `set-domain.py` | Swaps the `YOUR-DOMAIN` placeholder for your real address |

## 1. Preview locally

```bash
cd portfolio-site
python3 -m http.server 8000
```

Open http://localhost:8000.

## 2. Set your domain (do this before going live)

The canonical link, social tags, sitemap and robots file contain the placeholder `https://YOUR-DOMAIN`. Replace it with the real address you will use:

```bash
python3 set-domain.py https://yourname.com
```

Use the exact address people will visit, for example `https://yourname.github.io/portfolio` on GitHub Pages project sites (see the note in option A).

## 3. Pick a host

All four options below have a free tier suitable for a portfolio.

### A. GitHub Pages (simplest if your code lives on GitHub)

1. Create a repository and push the contents of this folder to the `main` branch.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push any change. The included workflow publishes the site, and the address appears in the Actions run.

Note: a repository named `<username>.github.io` is served at the root. Any other repository name is served under `/<repo-name>/`. This site uses root-relative links such as `/favicon.svg`, so for a project site either use a custom domain or change those links to relative ones (`favicon.svg`).

GitHub Pages ignores `_headers`, so the security headers below will not apply there. That is fine for a portfolio. If you want them, use B, C or D.

### B. Netlify

1. Sign in at netlify.com, choose **Add new site → Import an existing project**, and pick your repository.
2. Leave the build command empty and set the publish directory to `.`.
3. Deploy. `netlify.toml` and `_headers` are picked up automatically.

You can also drag this folder onto the Netlify dashboard for a one-off deploy.

### C. Vercel

1. Sign in at vercel.com, choose **Add New → Project**, and import your repository.
2. Framework preset: **Other**. Leave build settings empty.
3. Deploy. `vercel.json` adds the security headers.

### D. Cloudflare Pages

1. In the Cloudflare dashboard open **Workers & Pages → Create → Pages** and connect your repository.
2. Leave the build command empty and set the output directory to `/` (the repository root).
3. Deploy. `_headers` is honored automatically.

### E. AWS (S3 and CloudFront)

Use this if you specifically want to show AWS on your resume.

1. Create a private S3 bucket and upload the files.
2. Create a CloudFront distribution with the bucket as origin and **Origin access control** enabled. Set the default root object to `index.html` and add a custom error response for 403 and 404 that serves `/404.html` with status 404.
3. Attach a response headers policy that mirrors `_headers`.
4. For HTTPS on your own domain, request a certificate in AWS Certificate Manager (region `us-east-1`) and attach it to the distribution.

## 4. Custom domain

Buy a domain from any registrar, then add it in your host's dashboard (**Domains** on Netlify and Vercel, **Custom domains** on Cloudflare Pages, **Settings → Pages** on GitHub). The host shows the DNS records to create. HTTPS certificates are issued automatically. After it works, run `set-domain.py` again if you used a temporary address earlier, and redeploy.

## 5. After going live

- Share the link in a chat app or on LinkedIn to check the preview card.
- Submit `https://yourdomain/sitemap.xml` in Google Search Console.
- Run the page through PageSpeed Insights and the browser's Lighthouse tab.

## Editing the content

- Text and sections are in `index.html`.
- Colors and fonts are variables at the top of `style.css`.
- The Query Lab examples live in the `queries` list in `script.js`. The table names and rows are illustrative, so replace them with real CINSIC names if you like.

When you deploy, upload `index.html`, `style.css` and `script.js` together, plus `404.html`, `favicon.svg`, `og-image.png`, `robots.txt` and `sitemap.xml`.
- Add your LinkedIn and GitHub links in the Contact section once you have the URLs.

## Notes

- The page loads two font families from Google Fonts. The Content Security Policy in `_headers` and `vercel.json` already allows that. If you change fonts or add scripts from other sites, update the policy.
- Your email address is visible in the page source. That is normal for portfolios, but expect some spam.
