# 🚀 Deployment Guide

Deploy your FD Photography Portfolio to Vercel in 10 minutes!

---

## 📋 Prerequisites

Before deploying, make sure you have:

- ✅ GitHub account
- ✅ Vercel account (free at vercel.com)
- ✅ All environment variables ready
- ✅ Project tested locally

---

## 🚀 Step-by-Step Deployment

### STEP 1: Initialize Git Repository

```bash
cd fd-lookbook-complete

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: FD Photography Portfolio"

# Create main branch
git branch -M main
```

### STEP 2: Push to GitHub

**Option A: Create new repository on GitHub**

1. Go to https://github.com/new
2. Repository name: `fd-lookbook-portfolio`
3. Description: "Fashion Design Photography Portfolio"
4. Make it PUBLIC (easier for Vercel)
5. Click "Create repository"

**Option B: Use command line**

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/fd-lookbook-portfolio.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### STEP 3: Deploy to Vercel

**Method 1: Via Vercel Dashboard (Easiest)**

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Paste your GitHub repo URL
5. Click "Import"

**Method 2: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### STEP 4: Configure Environment Variables

On Vercel dashboard:

1. Go to your project settings
2. Click "Environment Variables"
3. Add each variable from `.env.local`:

```
NEON_DATABASE_URL = postgres://...
CLOUDINARY_CLOUD_NAME = your_name
CLOUDINARY_API_KEY = your_key
CLOUDINARY_API_SECRET = your_secret
ADMIN_PASSWORD = your_password
JWT_SECRET = your_secret
NEXT_PUBLIC_SITE_URL = your_vercel_url.vercel.app
```

⚠️ **Important:** The `NEXT_PUBLIC_SITE_URL` should be your Vercel URL, not localhost!

### STEP 5: Update NEXT_PUBLIC_SITE_URL

After deployment, update this environment variable:

1. Get your Vercel deployment URL (e.g., `https://fd-lookbook-portal.vercel.app`)
2. Go to Vercel project settings → Environment Variables
3. Update `NEXT_PUBLIC_SITE_URL` with your deployment URL
4. Redeploy

### STEP 6: Verify Deployment

1. Visit your Vercel URL
2. Check homepage loads with looks
3. Click on a look to view details
4. Visit `/credits` page
5. Try admin login at `/admin`
6. Test image upload in admin

---

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Project pushed to GitHub
- [ ] Vercel project created
- [ ] All environment variables added to Vercel
- [ ] Build completed without errors
- [ ] Homepage displays gallery
- [ ] Looks detail pages work
- [ ] Credits page displays
- [ ] Admin login works
- [ ] Images upload successfully
- [ ] QR codes generate

---

## 🔗 Update Links After Deployment

After getting your Vercel URL:

### 1. Update README.md
```markdown
- Original: http://localhost:3000
- New: https://your-domain.vercel.app
```

### 2. Update NEXT_PUBLIC_SITE_URL
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 3. Push Changes
```bash
git add .
git commit -m "Update deployment URL"
git push
```

---

## 🎯 Custom Domain (Optional)

To use your own domain:

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel project settings → Domains
3. Add your domain
4. Update DNS records according to Vercel instructions
5. Wait 24-48 hours for DNS propagation

---

## 📊 Monitor Deployment

### View Logs

1. Go to Vercel project
2. Click "Deployments" tab
3. Click latest deployment
4. Click "Logs" to see build output

### Common Build Errors

| Error | Solution |
|-------|----------|
| **Module not found** | Run `npm install` locally, commit again |
| **Environment undefined** | Check env vars in Vercel dashboard |
| **Database connection error** | Verify `NEON_DATABASE_URL` is correct |
| **Cloudinary auth failed** | Check API key and secret are exactly right |

---

## 🔒 Security Checklist

Before going live:

- [ ] No sensitive data in code
- [ ] Environment variables only in Vercel
- [ ] Repository is private (if needed)
- [ ] `.env.local` is in `.gitignore`
- [ ] Secrets not logged to console
- [ ] HTTPS enabled (automatic on Vercel)

---

## 📈 Performance Tips

### Image Optimization

1. Use WebP format when possible
2. Compress images before uploading
3. Use Cloudinary's optimization

### Database Performance

1. Neon auto-pauses after 1 week
2. To keep active, use dashboard at least once/week
3. Monitor connection count

### Caching

Next.js automatically caches:
- Static pages
- API responses
- Images

---

## 🆘 Troubleshooting

### Deployment Failed

1. Check build logs
2. Verify all environment variables
3. Test locally with `npm run build`
4. Fix errors, push to GitHub
5. Vercel will auto-redeploy

### 404 Errors

1. Check URL is correct
2. Verify pages exist in `/app` directory
3. Check routes in `next.config.js`

### Database Connection Issues

1. Verify `NEON_DATABASE_URL` in Vercel
2. Check Neon database is active
3. Test connection locally first
4. Restart Vercel deployment

### Image Upload Not Working

1. Verify Cloudinary credentials
2. Check API secret is correct (not key)
3. Test locally first
4. Check Cloudinary storage quota

---

## 🔄 CI/CD Pipeline

Vercel automatically:

1. **Detects** changes pushed to GitHub
2. **Builds** your application
3. **Tests** the build
4. **Deploys** if successful
5. **Notifies** you of status

### Manual Redeploy

If you need to redeploy:

1. Go to Vercel project
2. Click "Deployments"
3. Find deployment you want
4. Click "..." → "Redeploy"

---

## 📱 Mobile Testing

After deployment:

1. Visit your Vercel URL on mobile
2. Test gallery view
3. Test look details
4. Test admin on mobile
5. Test image upload on mobile

---

## 📊 Analytics

Vercel provides free analytics:

1. Go to project → Analytics
2. View page views
3. Check performance metrics
4. Monitor build times

---

## 🎉 You're Live!

Your FD Photography Portfolio is now live on the internet!

**Share your URL:**
- With friends and family
- On social media
- At exhibitions
- In portfolios

---

## 📝 Next Steps

### 1. Add Your Content
- Upload fashion photos
- Create looks
- Add team members

### 2. Customize
- Change colors
- Update descriptions
- Add your branding

### 3. Promote
- Share on Instagram
- Use QR codes
- Send to fashion schools
- Add to LinkedIn

### 4. Monitor
- Check analytics
- Monitor performance
- Update content regularly

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- GitHub: https://github.com
- Neon Dashboard: https://console.neon.tech
- Cloudinary Console: https://cloudinary.com/console

---

## 💡 Pro Tips

1. **Automatic deployments** - Vercel redeploys on every GitHub push
2. **Preview URLs** - Each PR gets a preview URL
3. **Rollback** - Easily revert to previous deployment
4. **Monitoring** - Vercel tracks uptime and performance
5. **Free HTTPS** - Automatic SSL certificates

---

## ❓ FAQ

**Q: Will my site be slow?**
A: No! Vercel is optimized for performance.

**Q: Do I need to pay?**
A: No! Vercel free tier is perfect for this project.

**Q: Can I use my domain?**
A: Yes! Add it in Vercel project settings.

**Q: How do I update content?**
A: Use the admin dashboard at `/admin`

**Q: Can I change the design?**
A: Yes! Modify Tailwind CSS classes in components.

---

## 📞 Support

If you encounter issues:

1. Check Vercel build logs
2. Review this deployment guide
3. Check Neon database status
4. Verify Cloudinary credentials
5. Test locally first

---

**Deployment Guide Complete!** ✅

Your FD Photography Portfolio is ready for the world! 🌍

---

**Time to deploy:** ~10 minutes  
**Difficulty:** Easy  
**Cost:** Free! 🎉
