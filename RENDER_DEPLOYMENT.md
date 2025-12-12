# Render Deployment Configuration

## Environment Variables for Render

When deploying the backend to Render, set these environment variables in the Render dashboard:

### Required Variables:

```
PORT=5001
```

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/productr?retryWrites=true&w=majority
```
👉 Get this from MongoDB Atlas: https://cloud.mongodb.com

```
JWT_SECRET=<generate-a-secure-random-string>
```
👉 Generate using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

```
NODE_ENV=production
```

```
CLIENT_URL=https://<your-vercel-app>.vercel.app
```
👉 Update this after deploying frontend to Vercel
👉 For multiple origins (optional), use comma-separated values: `https://app.vercel.app,https://custom-domain.com`

## Deployment Steps:

1. **Create MongoDB Atlas Database**
   - Go to https://cloud.mongodb.com
   - Create a free cluster
   - Create a database user
   - Whitelist all IP addresses (0.0.0.0/0) for Render
   - Copy the connection string

2. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

3. **Deploy on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: productr-backend (or your choice)
     - **Environment**: Node
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && node server.js`
     - **Plan**: Free
   
4. **Add Environment Variables**
   - In Render dashboard, go to "Environment"
   - Add all the required variables listed above

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your Render URL (e.g., https://productr-backend.onrender.com)

## Important Notes:

- Free tier apps on Render spin down after inactivity (may take 30-60 seconds to wake up)
- Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Update CLIENT_URL after deploying frontend to Vercel
- The backend URL will be: `https://your-app-name.onrender.com`

## Troubleshooting:

If deployment fails, check:
- Build logs in Render dashboard
- MongoDB connection string is correct
- All environment variables are set
- Start command points to correct directory
