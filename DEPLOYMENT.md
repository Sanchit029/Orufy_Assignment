# Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- GitHub account
- Vercel/Netlify account (for frontend)
- Render/Railway account (for backend)
- MongoDB Atlas account (for database)

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for development
5. Get your connection string (should look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/productr?retryWrites=true&w=majority
   ```

## Step 2: Deploy Backend (Render/Railway)

### Using Render:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: productr-backend
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=production
   CLIENT_URL=your_frontend_url
   ```

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy your backend URL (e.g., `https://productr-backend.onrender.com`)

### Using Railway:

1. Go to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as above)
5. Set root directory to `server`
6. Deploy

## Step 3: Deploy Frontend (Vercel/Netlify)

### Using Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

6. Click "Deploy"
7. Wait for deployment to complete
8. Copy your frontend URL

### Using Netlify:

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select your repository
4. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

6. Click "Deploy site"

## Step 4: Update Backend with Frontend URL

1. Go back to your backend deployment (Render/Railway)
2. Update the `CLIENT_URL` environment variable with your frontend URL:
   ```
   CLIENT_URL=https://your-frontend.vercel.app
   ```
3. Redeploy the backend

## Step 5: Seed Database (Optional)

To add sample data to your production database:

1. Update `server/utils/seed.js` with your production MongoDB URI
2. Run locally:
   ```bash
   cd server
   node utils/seed.js
   ```

Or connect to your backend and run the seed script remotely.

## Step 6: Test Your Deployment

1. Visit your frontend URL
2. Try logging in with test credentials
3. Create, edit, and delete products
4. Test publish/unpublish functionality

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/productr
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## Troubleshooting

### CORS Errors
- Ensure `CLIENT_URL` in backend matches your frontend URL exactly
- Check that CORS is properly configured in `server.js`

### Connection Errors
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check that connection string is correct
- Ensure database user has proper permissions

### Build Errors
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Review build logs for specific errors

### API Errors
- Check environment variables are set correctly
- Verify API URL in frontend matches backend URL
- Check network tab in browser dev tools

## Continuous Deployment

Both Vercel and Render/Railway support automatic deployments:
- Push to your GitHub repository
- Services will automatically build and deploy
- Monitor deployment logs for any issues

## Monitoring

- **Backend Logs**: Check Render/Railway dashboard
- **Frontend Logs**: Check Vercel/Netlify dashboard
- **Database**: Monitor MongoDB Atlas dashboard

## Cost

- **MongoDB Atlas**: Free tier (512MB storage)
- **Render**: Free tier (will spin down after inactivity)
- **Vercel/Netlify**: Free tier (sufficient for personal projects)
- **Railway**: $5/month after free trial

## Support

For issues:
1. Check deployment logs
2. Verify environment variables
3. Test locally first
4. Check GitHub repository issues

---

Your application is now live! 🎉

Frontend: https://your-app.vercel.app
Backend: https://your-api.onrender.com
