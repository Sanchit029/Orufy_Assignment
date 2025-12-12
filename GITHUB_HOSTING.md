# GitHub Setup & Hosting Guide

## 📦 Push to GitHub

### 1. Initialize Git Repository (if not already done)

```bash
cd /Users/sanchitbishnoi/Desktop/Assigments/Orufy_Tech

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete Productr application with React frontend and Node.js backend"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "+" in top right → "New repository"
3. Name: `productr-app` (or your preferred name)
4. Description: "Full-stack product management application with React, Node.js, Express, and MongoDB"
5. Keep it Public or Private
6. DO NOT initialize with README (we already have one)
7. Click "Create repository"

### 3. Push to GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/productr-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Deploy Application

Follow these steps to deploy your application online.

### Option A: Quick Deploy (Free)

#### Frontend: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   (You'll update this after deploying backend)
7. Click "Deploy"
8. Save your URL: `https://productr-app.vercel.app`

#### Backend: Render

1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: `productr-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_super_secret_key_production
   NODE_ENV=production
   CLIENT_URL=https://productr-app.vercel.app
   ```
7. Click "Create Web Service"
8. Save your URL: `https://productr-backend.onrender.com`

#### Database: MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (M0 Free tier)
4. Database Access → Add user → Save credentials
5. Network Access → Add IP: `0.0.0.0/0` (Allow from anywhere)
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/productr?retryWrites=true&w=majority
   ```
7. Update `MONGODB_URI` in Render

#### Update Frontend with Backend URL

1. Go back to Vercel
2. Project Settings → Environment Variables
3. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://productr-backend.onrender.com/api
   ```
4. Redeploy from Deployments tab

### Option B: Railway (Alternative)

#### Deploy Backend on Railway

1. Go to [railway.app](https://railway.app)
2. Login with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (same as Render)
6. Railway auto-detects Node.js
7. Set start command: `cd server && npm start`
8. Deploy

### Option C: Netlify (Alternative for Frontend)

1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import an existing project"
3. Connect GitHub
4. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
6. Deploy

## 🔄 Continuous Deployment

After initial setup, updates are automatic:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

Both Vercel and Render will automatically:
- Detect the push
- Build your application
- Deploy the new version

## 📝 Seed Production Database

After deploying, seed your production database:

```bash
# Update server/utils/seed.js temporarily with production MongoDB URI
# Or use this script:

# Create temp seed file
cd server
node -e "
const mongoose = require('mongoose');
const User = require('./models/User.model');
const Product = require('./models/Product.model');

const PROD_URI = 'your_production_mongodb_uri_here';

mongoose.connect(PROD_URI).then(async () => {
  console.log('Connected to production DB');
  
  await User.deleteMany({});
  await Product.deleteMany({});
  
  const user = await User.create({
    email: 'test@productr.com',
    phone: '1234567890',
    isVerified: true
  });
  
  const products = await Product.insertMany([
    {
      name: 'CakeZone Walnut Brownie',
      productType: 'Foods',
      quantityStock: 200,
      mrp: 2000,
      sellingPrice: 2000,
      brandName: 'CakeZone',
      exchangeEligibility: 'Yes',
      isPublished: false,
      images: [],
      createdBy: user._id
    }
  ]);
  
  console.log('Seeded production DB');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
"
```

## ✅ Deployment Checklist

### Before Deploying
- [ ] Test application locally
- [ ] All features working
- [ ] Environment variables documented
- [ ] .gitignore includes .env files
- [ ] README.md is up to date
- [ ] Code is committed to GitHub

### MongoDB Atlas
- [ ] Cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string obtained

### Backend Deployment
- [ ] Service created on Render/Railway
- [ ] Environment variables set
- [ ] Build successful
- [ ] Health check endpoint responding
- [ ] /api/health returns OK

### Frontend Deployment
- [ ] Project created on Vercel/Netlify
- [ ] Environment variables set
- [ ] Build successful
- [ ] Can access login page
- [ ] API connection working

### Final Testing
- [ ] Login works
- [ ] OTP verification works
- [ ] Products page loads
- [ ] Can create product
- [ ] Can edit product
- [ ] Can delete product
- [ ] Can publish/unpublish
- [ ] Images upload correctly
- [ ] Navigation works
- [ ] Logout works

## 🎯 Your Deployed URLs

After deployment, update these in your documentation:

```
Frontend URL: https://productr-app.vercel.app
Backend URL: https://productr-backend.onrender.com
API URL: https://productr-backend.onrender.com/api
MongoDB: mongodb+srv://...
```

## 📊 Monitoring

### Check Deployment Status

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Deployment logs available
- Automatic HTTPS
- Instant rollback available

**Render:**
- Dashboard: https://dashboard.render.com
- Live logs streaming
- Free tier sleeps after 15 min inactivity
- Takes ~30s to wake up

**MongoDB Atlas:**
- Dashboard: https://cloud.mongodb.com
- Monitor database usage
- Set up alerts
- View connection metrics

## 🚨 Troubleshooting

### Frontend can't reach backend
- Check CORS settings in backend
- Verify `CLIENT_URL` in backend env
- Check `VITE_API_URL` in frontend env
- Test API endpoint directly

### Backend won't start
- Check MongoDB connection string
- Verify all env variables set
- Check Render logs
- Ensure no syntax errors

### Database connection fails
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check database user permissions
- Ensure network access configured

### Images not uploading
- Check multer configuration
- Verify upload folder exists
- Check file size limits
- Review error logs

## 💰 Cost Breakdown

### Free Tier (Current Setup)
- **MongoDB Atlas**: $0 (512MB storage)
- **Render**: $0 (with sleep after inactivity)
- **Vercel**: $0 (100GB bandwidth/month)
- **Total**: $0/month

### Upgraded (For Production)
- **MongoDB Atlas**: $0-9/month (shared cluster)
- **Render**: $7/month (always on)
- **Vercel**: $20/month (Pro features)
- **Total**: ~$27-36/month

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Railway Documentation](https://docs.railway.app/)

## 🎉 You're Live!

After completing these steps, your application will be live and accessible worldwide!

Share your URLs:
- GitHub Repo: `https://github.com/YOUR_USERNAME/productr-app`
- Live App: `https://productr-app.vercel.app`

## 🔐 Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Use strong JWT secrets** - Change from default
3. **Enable CORS only for your domain** - Update in production
4. **Keep dependencies updated** - Run `npm audit`
5. **Use environment-specific configs** - Different for dev/prod
6. **Enable MongoDB encryption** - In Atlas settings
7. **Set up monitoring** - Use Render/Vercel dashboards
8. **Regular backups** - MongoDB Atlas automatic backups

---

**Need Help?**
- Check deployment logs first
- Review environment variables
- Test locally before deploying
- Contact hosting support if needed

Good luck with your deployment! 🚀
