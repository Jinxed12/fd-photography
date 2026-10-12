# ⚡ Quick Start Setup Guide

Get your FD Photography Portfolio running in 15 minutes!

## 🎯 What You'll Need

- Node.js 16+ installed
- Neon PostgreSQL account (free: https://neon.tech)
- Cloudinary account (free: https://cloudinary.com)
- 15 minutes of your time

---

## 📋 Step-by-Step Setup

### STEP 1: Prepare Project (2 minutes)

```bash
# Navigate to project
cd fd-lookbook-complete

# Install dependencies
npm install
```

Wait for installation to complete (~2 minutes).

### STEP 2: Create Neon Database (3 minutes)

**Visit:** https://console.neon.tech

1. Create new project named `fd-lookbook`
2. Copy connection string (looks like: `postgres://...`)
3. Go to SQL Editor
4. Copy-paste all SQL from [DATABASE.sql](./DATABASE.sql)
5. Click Run/Execute
6. ✅ Database created with sample data!

### STEP 3: Get Cloudinary Credentials (2 minutes)

**Visit:** https://cloudinary.com/console

1. Go to Settings → Account
2. Copy these 3 values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### STEP 4: Create `.env.local` (3 minutes)

Create file in project root:

```bash
# Copy template first
cp .env.example .env.local

# Then edit .env.local with your values:
```

```
NEON_DATABASE_URL=postgres://user:pass@host/fd_portfolio
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PASSWORD=your-strong-password-123!
JWT_SECRET=aB3cD9eF2gH5iJ8kL1mN4oPqRsT7uVwXyZ0aB
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### STEP 5: Start Development Server (2 minutes)

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.3s
- Local: http://localhost:3000
```

### STEP 6: Test Everything (3 minutes)

Open browser → http://localhost:3000

**You should see:**
- ✅ Home page with 3 sample looks
- ✅ Gallery grid with images
- ✅ Click on looks to see details
- ✅ Credits page with team members
- ✅ Admin link in navigation

---

## 🔐 Admin Access

**URL:** http://localhost:3000/admin

**Password:** The value you set in `ADMIN_PASSWORD`

**Admin Features:**
- Create new looks
- Upload images
- Manage team credits

---

## 🧪 Test API Endpoints

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-admin-password"}'
```

Response will include JWT token.

### Get All Looks
```bash
curl http://localhost:3000/api/looks
```

### Get Credits
```bash
curl http://localhost:3000/api/credits
```

---

## ✅ Verification Checklist

Run through these to verify everything works:

- [ ] `npm install` completed without errors
- [ ] Neon database created with tables
- [ ] `.env.local` file created with all values
- [ ] Development server starts with `npm run dev`
- [ ] Home page loads at http://localhost:3000
- [ ] Gallery shows 3 sample looks
- [ ] Can click on looks to view details
- [ ] Credits page displays 3 team members
- [ ] Admin login works with your password
- [ ] Admin dashboard loads successfully

---

## 📞 Common Issues & Fixes

### Issue: "Cannot find module 'pg'"
```bash
# Fix: Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: "Connection refused" error
```
Fix: Check NEON_DATABASE_URL in .env.local
- Must include full connection string
- No extra spaces
- Must start with postgres://
```

### Issue: Admin login not working
```
Fix: Check ADMIN_PASSWORD
- Must match exactly what's in .env.local
- Case-sensitive
- No extra spaces before/after
```

### Issue: "Cannot upload images"
```
Fix: Check Cloudinary credentials
- Cloud Name: Must be exact
- API Key: Must be complete
- API Secret: Must be complete
- Restart server after updating
```

### Issue: Images not displaying
```
Fix: Check Cloudinary API keys
- Verify credentials are correct
- Check Cloudinary storage has space
- Try uploading small image first
```

---

## 🚀 Next Steps

### 1. Customize
- Update looks with your own data
- Upload fashion photography
- Add team member credits
- Customize theme colors

### 2. Add Your Content
- Create new looks in admin
- Upload high-quality images
- Add detailed descriptions
- Include team members

### 3. Deploy
- Push to GitHub
- Deploy to Vercel
- Share URL with others
- Use QR codes at exhibition

---

## 📚 Documentation

- **README.md** - Full project documentation
- **API_DOCS.md** - API endpoint reference
- **DATABASE.sql** - Database schema SQL

---

## 🎓 Quick Reference

| Action | Command |
|--------|---------|
| Install | `npm install` |
| Develop | `npm run dev` |
| Build | `npm run build` |
| Production | `npm start` |
| Stop | `Ctrl + C` |

---

## 🌐 URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Look Details | http://localhost:3000/look/[id] |
| Credits | http://localhost:3000/credits |
| Admin | http://localhost:3000/admin |

---

## ✨ You're All Set!

Your FD Photography Portfolio is now running locally!

**Next:** Add your own looks and images from the admin dashboard.

---

**Time to setup:** ~15 minutes  
**Complexity:** Easy  
**Result:** Full-stack portfolio! 🎉

Enjoy! 🎨
