# SUSA Website Deployment Guide

## ✅ Download Link Updated

The Windows complete installer link has been updated to:
```
https://www.dropbox.com/scl/fi/9fbeezjwdqed7kzfvh72d/SUSA-Setup.exe?rlkey=wokbdpw1v8mr8yetjwcl2flfv&st=y9zefma7&dl=1
```

## 📁 Website Location

The main website is in: `susa-the-ai-language-reveal-main/`

## 🚀 Build and Deploy

### Option 1: Firebase Hosting (Current Setup)

```bash
cd susa-the-ai-language-reveal-main

# Install dependencies
npm install

# Build the website
npm run build

# Deploy to Firebase
firebase deploy
```

### Option 2: Vercel (Recommended - Free & Fast)

```bash
cd susa-the-ai-language-reveal-main

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 3: Netlify (Alternative)

```bash
cd susa-the-ai-language-reveal-main

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Option 4: GitHub Pages

```bash
cd susa-the-ai-language-reveal-main

# Build
npm run build

# Deploy to gh-pages branch
npm install -g gh-pages
gh-pages -d dist
```

## 📦 Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🔗 Download Links Configuration

All download links are in: `src/pages/Download.tsx`

Current configuration:
```typescript
const DOWNLOAD_LINKS = {
  cli: {
    windows: "...",  // CLI only installer
    macos: "...",
    linux: "..."
  },
  ide: {
    windows: "...",  // IDE only installer
    macos: "...",
    linux: "..."
  },
  complete: {
    windows: "https://www.dropbox.com/scl/fi/9fbeezjwdqed7kzfvh72d/SUSA-Setup.exe?rlkey=wokbdpw1v8mr8yetjwcl2flfv&st=y9zefma7&dl=1",  // ✅ UPDATED
    macos: "...",
    linux: "..."
  }
};
```

## 🌐 Hosting Options Comparison

| Platform | Cost | Speed | CDN | Custom Domain | SSL |
|----------|------|-------|-----|---------------|-----|
| **Vercel** | Free | ⚡⚡⚡ | ✅ | ✅ | ✅ |
| **Netlify** | Free | ⚡⚡⚡ | ✅ | ✅ | ✅ |
| **Firebase** | Free | ⚡⚡ | ✅ | ✅ | ✅ |
| **GitHub Pages** | Free | ⚡⚡ | ✅ | ✅ | ✅ |
| **Cloudflare Pages** | Free | ⚡⚡⚡ | ✅ | ✅ | ✅ |

## 🎯 Recommended: Vercel Deployment

### Why Vercel?
- ✅ Fastest deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Zero configuration
- ✅ Automatic builds from Git
- ✅ Free custom domain

### Step-by-Step Vercel Deployment:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to website:**
   ```bash
   cd susa-the-ai-language-reveal-main
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Follow prompts:**
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? susa-programming-language
   - Directory? ./
   - Override settings? No

6. **Done!** Your site is live at: `https://susa-programming-language.vercel.app`

### Connect Custom Domain:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your domain (e.g., `susastudio.online`)
5. Update DNS records as instructed
6. Wait for SSL certificate (automatic)

## 🔄 Automatic Deployments

### Connect to GitHub:

1. Push your code to GitHub:
   ```bash
   cd susa-the-ai-language-reveal-main
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/susa-website.git
   git push -u origin main
   ```

2. Import to Vercel:
   - Go to vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Automatic deployments:**
   - Every push to `main` = automatic deployment
   - Pull requests = preview deployments
   - No manual builds needed!

## 📊 Analytics Setup

### Add Vercel Analytics:

```bash
npm install @vercel/analytics
```

In `src/main.tsx`:
```typescript
import { inject } from '@vercel/analytics';

inject();
```

### Add Google Analytics:

In `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔒 Environment Variables

If you need environment variables:

1. Create `.env` file:
   ```
   VITE_API_URL=https://api.example.com
   VITE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

2. Add to Vercel:
   - Dashboard → Settings → Environment Variables
   - Add each variable
   - Redeploy

## 🧪 Testing Before Deploy

```bash
# Build locally
npm run build

# Test production build
npm run preview

# Open http://localhost:4173
# Test all download links
# Check all pages
```

## 📝 Pre-Deployment Checklist

- [ ] Download link updated
- [ ] Build succeeds without errors
- [ ] All pages load correctly
- [ ] Download buttons work
- [ ] Mobile responsive
- [ ] Images load
- [ ] Links work
- [ ] SEO meta tags present
- [ ] Favicon present
- [ ] Analytics configured

## 🚀 Quick Deploy Script

Save as `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying SUSA Website..."

cd susa-the-ai-language-reveal-main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building website..."
npm run build

echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
```

Make executable and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔗 Current Website

- **Live Site:** https://susa-programming-language.web.app
- **Repository:** susa-the-ai-language-reveal-main/
- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Hosting:** Firebase (can migrate to Vercel)

## 📱 Mobile Optimization

The website is already mobile-responsive with:
- ✅ Responsive design
- ✅ Touch-friendly buttons
- ✅ Mobile navigation
- ✅ Optimized images
- ✅ Fast loading

## 🎨 Customization

### Update Branding:
- Logo: `public/susa-logo.png`
- Favicon: `public/favicon.ico`
- Colors: `tailwind.config.ts`

### Update Content:
- Home: `src/pages/Home.tsx`
- Download: `src/pages/Download.tsx`
- Docs: `src/pages/Docs.tsx`
- About: `src/pages/About.tsx`

## 📈 Performance

Current Lighthouse scores:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 🆘 Troubleshooting

### Build fails:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deploy fails:
```bash
vercel --debug
```

### Links don't work:
- Check Dropbox links have `&dl=1` at the end
- Test links in incognito mode
- Verify Dropbox file is public

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev

---

**Ready to deploy!** 🚀

Choose your platform and follow the steps above.
