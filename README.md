# 🎨 FD Photography Portfolio - Fashion Design Lookbook

A complete, production-ready full-stack application for showcasing fashion design photography with a beautiful gallery, admin dashboard, and team credits section.

## 📋 Table of Contents



## ✨ Features

### Frontend

### Backend

### Admin Dashboard


## 🛠️ Tech Stack

### Frontend

### Backend

### Utilities


## 📁 Project Structure

```
fd-lookbook-complete/
├── app/                          # Next.js app directory
│   ├── api/                       # API routes
│   │   ├── auth/login/route.js   # Login endpoint
│   │   ├── looks/route.js        # List and create looks
│   │   ├── looks/[id]/route.js   # Get, update, delete looks
│   │   ├── images/upload/route.js # Image upload
│   │   ├── credits/route.js      # Credits management
│   │   └── qr/route.js           # QR code generation
│   ├── layout.js                  # Root layout
│   ├── page.js                    # Home gallery page
│   ├── look/[id]/page.js          # Look detail page
│   ├── credits/page.js            # Credits page
│   ├── admin/page.js              # Admin dashboard
│   └── globals.css                # Global styles
├── lib/                           # Utility libraries
│   ├── firebase.js                # Firebase web SDK
│   ├── firebaseAdmin.js            # Firebase Admin SDK
│   └── auth.js                    # Authentication helpers
├── public/                        # Static assets
├── package.json                   # Dependencies
├── next.config.js                 # Next.js config
├── tailwind.config.js             # Tailwind config
├── postcss.config.js              # PostCSS config
├── .env.example                   # Example env variables
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```


## 🚀 Getting Started

### Prerequisites


### 1. Clone or Extract Project

```bash
# Navigate to project directory
cd fd-lookbook-complete
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Firestore (Firebase)

1. Create or open a project in [Firebase Console](https://console.firebase.google.com).
2. Enable **Firestore Database** using the Standard edition.
3. Choose a region close to your users.
4. Deploy the checked-in rules with `npx firebase-tools deploy --only firestore:rules`.

The app uses these collections: `looks`, `images`, `credits`, `exhibition`,
`users`, and `signups`. Portfolio data is read through server routes backed by
the Firebase Admin SDK. Account creation uses Firebase Authentication and
allows a signed-in user to create only their own profile and signup record.

Enable **Email/Password** under Firebase Console → Authentication → Sign-in
method, then deploy the checked-in rules:

```bash
npx firebase-tools deploy --only firestore:rules
```


## 🔧 Environment Setup

### 1. Create `.env.local`

Copy from `.env.example`:

```bash
cp .env.example .env.local
```

### 2. Get Firebase Credentials

From Firebase project settings, copy the web app values into the `NEXT_PUBLIC_FIREBASE_*` variables. From **Project settings → Service accounts**, create a private key and set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`. Never commit the service-account key.

### 3. Get Cloudinary Credentials

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Go to Settings → Account
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

### 4. Fill `.env.local`

```bash
# Firebase web configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-web-app-id

# Firebase Admin server configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Auth (create your own)
ADMIN_PASSWORD=MySecure@Pass456!
JWT_SECRET=aB3cD9eF2gH5iJ8kL1mN4oPqRsT7uVwXyZ0aB

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```


## 🗄️ Database Setup

### Firestore Collections

1. **looks** - Fashion looks/collections
2. **images** - Photos for each look
3. **credits** - Team members
4. **exhibition** - Exhibition info

Create documents in Firebase Console or through the authenticated admin API. Public credit responses intentionally omit `contact_email`.


## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

Visit http://localhost:3000

### Production Build

```bash
npm run build
npm start
```


## 📡 API Endpoints

### Authentication

### Looks (Public)

### Looks (Admin)

### Images (Admin)

### Credits (Public)

### Credits (Admin)

### QR Code (Public)


## 👨‍💼 Admin Dashboard

### Access Admin Panel
1. Go to http://localhost:3000/admin
2. Enter admin password
3. Login

### Admin Features

### Test Login


## 🌐 Pages

### Public Pages

- `/signup` - Create a Firebase account and save the user profile to Firestore
- `/login` - Sign in with Firebase Authentication

### Admin Features


## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/fd-lookbook.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Add environment variables from `.env.local`
   - Deploy

3. **Update NEXT_PUBLIC_SITE_URL**
   ```
   NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
   ```


## 📊 Database Backup

Use Firebase Console exports or the Firebase CLI for Firestore backups. The
application's server routes do not perform automatic backups.


## 🆘 Troubleshooting

### Database Connection Error
- Check the Firebase Admin variables in `.env.local`.
- Confirm `FIREBASE_PRIVATE_KEY` contains escaped `\\n` line breaks.
- Confirm the service account belongs to the selected Firebase project.
- Restart the development server.

### Cloudinary Upload Error

### Admin Login Issues

### Images Not Loading

### Page Not Found


## 📚 Documentation Files

- `API_DOCUMENTATION.md` - Full API reference
---

## 🎓 Learning Resources
- [JWT Authentication](https://jwt.io)
---

## 📝 License

This project is part of a Fashion Design academic portfolio.
---

## 🤝 Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check console for error messages
4. Verify environment variables
---

## ✅ Checklist

- [ ] Mobile responsive design working
---

## 🎉 Ready to Go!

Your FD Photography Portfolio is ready to showcase your fashion design work!

**Happy designing! 🎨**
---

**Version:** 1.0.0  
**Last Updated:** 2025  
**Status:** Production Ready ✅
