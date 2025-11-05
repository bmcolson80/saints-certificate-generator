# Deployment Guide - SAINTS Certificate Generator

This guide explains how to deploy the SAINTS Certificate Generator to Vercel.

## Prerequisites

- Node.js (v14 or higher)
- Vercel account (free tier is sufficient)
- Vercel CLI installed (already set up in this project)

## Automatic Deployment (Recommended)

### Option 1: Deploy via Vercel CLI

1. **Login to Vercel:**
   ```bash
   vercel login
   ```
   This will open your browser to authenticate.

2. **Deploy to production:**
   ```bash
   vercel --prod
   ```

3. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (first time) or **Y** (if already exists)
   - What's your project's name? `saints-certificate-generator` (or your preferred name)
   - In which directory is your code located? `./` (press Enter)
   - Want to override settings? **N**

4. **Your site will be live!**
   The CLI will provide you with:
   - Preview URL: `https://saints-certificate-generator-xxx.vercel.app`
   - Production URL: `https://saints-certificate-generator.vercel.app`

### Option 2: Deploy via Vercel Dashboard

1. **Go to:** https://vercel.com/new

2. **Import Git Repository:**
   - Connect your GitHub account
   - Import `bmcolson80/saints-certificate-generator`

3. **Configure Project:**
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `.` (root)
   - Install Command: `npm install`

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (~30-60 seconds)

## Configuration Files

The following files have been configured for Vercel deployment:

### `vercel.json`
- Configures build command
- Sets up proper headers for service worker
- Optimizes caching for static assets
- Adds security headers

### `.vercelignore`
- Excludes test files and development artifacts
- Reduces deployment size

## Environment Variables

No environment variables are required for this static application.

## Post-Deployment

After deployment, your application will be available at:
- **Production:** `https://[your-project-name].vercel.app`
- **Custom Domain:** Can be configured in Vercel dashboard

### Service Worker

The service worker will register automatically and enable:
- Offline functionality
- PWA installation
- Asset caching

### Custom Domain (Optional)

To add a custom domain:

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Testing the Deployment

1. Visit your deployed URL
2. Test all functionality:
   - Form input
   - Certificate generation
   - PDF download
   - Print functionality
   - Logo selection
3. Test offline mode (after first visit)
4. Install as PWA (on mobile devices)

## Troubleshooting

### Build Fails

If the build fails, check:
- All dependencies in `package.json` are correct
- `npm run build` works locally
- Node.js version compatibility

### Service Worker Not Working

- Ensure you're using HTTPS (Vercel provides this automatically)
- Clear browser cache and hard reload
- Check browser console for service worker errors

### Assets Not Loading

- Verify all image files are committed to git
- Check file paths are correct (case-sensitive)
- Ensure `.vercelignore` doesn't exclude necessary files

## Redeployment

To redeploy after making changes:

```bash
git add .
git commit -m "Your changes"
git push

# Then deploy
vercel --prod
```

Or if using Git integration, simply push to your main branch and Vercel will auto-deploy.

## Performance

Expected performance metrics:
- First Contentful Paint: < 1.5s
- Lighthouse Score: 95+
- Time to Interactive: < 2s

## Support

For issues with:
- **Application:** Check GitHub Issues
- **Vercel Deployment:** https://vercel.com/docs
- **Vercel CLI:** Run `vercel help`

---

**Ready to deploy?** Run `vercel --prod` to get started! 🚀
