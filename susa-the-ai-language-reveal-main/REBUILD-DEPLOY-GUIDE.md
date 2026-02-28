# 🚀 SUSA Website - Rebuild & Deploy Guide

## Quick Start

### Option 1: Automated Build & Preview (Recommended)
```bash
cd susa-the-ai-language-reveal-main
rebuild-and-deploy.bat
```

This will:
1. ✅ Check Node.js installation
2. ✅ Install dependencies
3. ✅ Build for production
4. ✅ Start preview server
5. ✅ Open at http://localhost:4173

### Option 2: Manual Steps
```bash
cd susa-the-ai-language-reveal-main

# Install dependencies
npm install

# Build for production
npm run build

# Preview the build
npm run preview
```

---

## 📋 Pre-Build Checklist

Before building, verify:
- ✅ All module documentation corrections applied
- ✅ `src/data/modulesDocs.ts` uses correct `ADD` syntax
- ✅ No `IMPORT "module"` syntax in examples
- ✅ All trailing quotes removed
- ✅ Node.js installed (v18 or higher recommended)

---

## 🔨 Build Process

### Step 1: Install Dependencies
```bash
npm install
```

**What it does:**
- Installs all required packages
- Sets up development environment
- Prepares build tools

**Expected output:**
```
added 1234 packages in 30s
```

### Step 2: Build for Production
```bash
npm run build
```

**What it does:**
- Compiles TypeScript to JavaScript
- Bundles all components
- Minifies code
- Optimizes assets
- Creates `dist/` folder

**Expected output:**
```
vite v5.4.19 building for production...
✓ 1234 modules transformed.
dist/index.html                   1.23 kB
dist/assets/index-abc123.js     234.56 kB
✓ built in 12.34s
```

### Step 3: Preview Build
```bash
npm run preview
```

**What it does:**
- Starts local server
- Serves production build
- Available at http://localhost:4173

**Test checklist:**
- [ ] Homepage loads
- [ ] Navigate to /modules
- [ ] All 9 modules display
- [ ] Click a module (e.g., Math Utils)
- [ ] Documentation shows correct `ADD` syntax
- [ ] Copy button works
- [ ] Search works
- [ ] Category filters work
- [ ] Related modules navigation works
- [ ] Mobile responsive (test in DevTools)

---

## 🌐 Deployment Options

### Option A: Firebase Hosting (Current Setup)

#### Quick Deploy
```bash
one-click-deploy.bat
```

#### Manual Deploy
```bash
# Login to Firebase
firebase login

# Deploy
firebase deploy
```

**Your site will be live at:**
- Firebase URL: `https://your-project.web.app`
- Custom domain: `https://susastudio.com` (if configured)

---

### Option B: Netlify

#### Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### Via Netlify Dashboard
1. Go to https://app.netlify.com
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `dist/` folder
4. Your site is live!

**Configuration:**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

---

### Option C: Vercel

#### Via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Via Vercel Dashboard
1. Go to https://vercel.com
2. Import your Git repository
3. Configure:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy!

---

### Option D: GitHub Pages

#### Setup
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

**Your site will be at:**
`https://yourusername.github.io/repository-name`

---

### Option E: Custom Server (VPS/Dedicated)

#### Upload Files
```bash
# Build locally
npm run build

# Upload dist/ folder to server
scp -r dist/* user@yourserver.com:/var/www/html/
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache Configuration (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🔍 Post-Deployment Verification

### Automated Checks
Visit your deployed site and test:

#### Homepage
- [ ] Loads without errors
- [ ] Navigation works
- [ ] Links work

#### Modules Page (/modules)
- [ ] All 9 modules display
- [ ] Module cards show correct info
- [ ] Search functionality works
- [ ] Category filters work

#### Module Documentation
- [ ] Click "Math Utils"
- [ ] Documentation displays
- [ ] Examples use `ADD math_utils` (not IMPORT)
- [ ] No trailing quotes in code
- [ ] Copy buttons work
- [ ] Related modules links work
- [ ] Back button works

#### Mobile Testing
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPad (768px)
- [ ] Test on Desktop (1920px)

#### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 📊 Build Output Analysis

### Expected File Sizes
```
dist/
├── index.html              ~2 KB
├── assets/
│   ├── index-[hash].js     ~250 KB (minified)
│   ├── index-[hash].css    ~50 KB (minified)
│   └── [images]            varies
└── [other files]
```

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: < 500 KB
- **Lighthouse Score**: > 90

### Check Bundle Size
```bash
npm run build

# Output will show:
# dist/assets/index-abc123.js  234.56 kB │ gzip: 78.90 kB
```

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Cannot find module"**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error: "TypeScript errors"**
```bash
# Solution: Check for syntax errors
npm run build 2>&1 | more
# Fix errors in reported files
```

**Error: "Out of memory"**
```bash
# Solution: Increase Node memory
set NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

### Preview Issues

**Error: "Port 4173 already in use"**
```bash
# Solution: Kill the process or use different port
npx kill-port 4173
# Or
npm run preview -- --port 5173
```

**Error: "Cannot GET /modules"**
- This is normal in preview
- The route will work after deployment
- Or configure vite.config.ts for SPA routing

### Deployment Issues

**Error: "404 on refresh"**
- Configure your hosting for SPA routing
- See hosting-specific configuration above

**Error: "Assets not loading"**
- Check base URL in vite.config.ts
- Verify asset paths are relative

**Error: "Modules page blank"**
- Check browser console for errors
- Verify modulesDocs.ts is included in build
- Check network tab for failed requests

---

## 🔄 Update Workflow

### When You Make Changes

1. **Edit Files**
   ```bash
   # Edit src/data/modulesDocs.ts or other files
   ```

2. **Test Locally**
   ```bash
   npm run dev
   # Visit http://localhost:5173
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Preview**
   ```bash
   npm run preview
   # Test at http://localhost:4173
   ```

5. **Deploy**
   ```bash
   # Use your chosen deployment method
   firebase deploy
   # or
   netlify deploy --prod
   # or
   vercel --prod
   ```

---

## 📝 Deployment Checklist

### Before Deployment
- [ ] All corrections applied
- [ ] Local testing complete
- [ ] Build successful
- [ ] Preview tested
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All links work

### During Deployment
- [ ] Build command runs
- [ ] No errors in logs
- [ ] Files uploaded
- [ ] DNS configured (if needed)
- [ ] SSL certificate active

### After Deployment
- [ ] Site loads
- [ ] All pages work
- [ ] Modules display correctly
- [ ] Examples show correct syntax
- [ ] Mobile works
- [ ] All browsers work

---

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)

# Building
npm run build            # Production build
npm run build:dev        # Development build

# Preview
npm run preview          # Preview production build

# Deployment
firebase deploy          # Deploy to Firebase
netlify deploy --prod    # Deploy to Netlify
vercel --prod           # Deploy to Vercel

# Utilities
npm install             # Install dependencies
npm run lint            # Check code quality
```

---

## 📞 Support

### If You Need Help

1. **Check Console**: Open browser DevTools (F12) and check Console tab
2. **Check Network**: Look for failed requests in Network tab
3. **Check Build Logs**: Review terminal output for errors
4. **Test Locally**: Always test with `npm run preview` before deploying

### Common Solutions

**Site not updating?**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check if deployment completed

**Modules not showing?**
- Verify `modulesDocs.ts` is correct
- Check browser console for errors
- Verify build included all files

**Syntax still wrong?**
- Rebuild: `npm run build`
- Clear cache and redeploy
- Verify source files were updated

---

## ✅ Success Criteria

Your deployment is successful when:

✅ Website loads at your domain  
✅ /modules page displays all 9 modules  
✅ Clicking a module shows documentation  
✅ All examples use `ADD module_name` syntax  
✅ No `IMPORT "module"` syntax anywhere  
✅ Copy buttons work  
✅ Search and filters work  
✅ Mobile responsive  
✅ No console errors  
✅ All browsers work  

---

## 🚀 Ready to Deploy!

Run this command to start:

```bash
cd susa-the-ai-language-reveal-main
rebuild-and-deploy.bat
```

Then choose your hosting platform and deploy!

---

*Last Updated: February 2026*  
*SUSA Version: 1.0.0*  
*Documentation: Complete ✅*
