# Vercel Deployment Configuration

## Environment Variables for Vercel

When deploying the frontend to Vercel, set this environment variable:

### Required Variable:

```
VITE_API_URL=https://<your-render-backend>.onrender.com/api
```
👉 Replace `<your-render-backend>` with your actual Render app name

Example: `VITE_API_URL=https://productr-backend.onrender.com/api`

## Deployment Steps:

1. **Deploy Backend First**
   - Complete the Render deployment (see RENDER_DEPLOYMENT.md)
   - Copy your Render backend URL

2. **Update Environment Variable**
   - Create `.env.production` in client folder (optional)
   - Or set directly in Vercel dashboard

3. **Deploy on Vercel**

   ### Option A: Using Vercel CLI (Recommended)
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Navigate to client folder
   cd client

   # Deploy
   vercel

   # Follow prompts:
   # - Link to existing project or create new
   # - Set root directory to current folder
   # - Build command: npm run build
   # - Output directory: dist
   ```

   ### Option B: Using Vercel Dashboard
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: client
     - **Build Command**: `npm run build`
     - **Output Directory**: dist
     - **Install Command**: `npm install`

4. **Add Environment Variable**
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - Apply to: Production, Preview, and Development

5. **Update Backend CORS**
   - After deployment, copy your Vercel URL
   - Update `CLIENT_URL` in Render environment variables
   - Example: `CLIENT_URL=https://productr.vercel.app`
   - Redeploy backend on Render

6. **Redeploy Frontend** (if needed)
   - Vercel will auto-deploy on git push
   - Or manually trigger deployment in Vercel dashboard

## Configuration Files:

Your `client/` folder should have:

```
client/
├── .env                    # Local development (not committed)
├── .env.example           # Template file (committed)
├── package.json
├── vite.config.js
└── ...
```

## Vercel Configuration (Optional):

Create `vercel.json` in client folder for advanced settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Important Notes:

- Vercel automatically detects Vite projects
- Environment variables starting with `VITE_` are exposed to the browser
- Never commit `.env` files with production secrets
- Vercel provides automatic HTTPS
- Frontend URL will be: `https://your-project.vercel.app`

## After Deployment:

1. **Test the Application**
   - Visit your Vercel URL
   - Try logging in (test@productr.com / 1234567890)
   - Upload a product with images
   - Verify images load from MongoDB GridFS

2. **Update Backend CORS**
   - Make sure Render backend allows your Vercel domain
   - Check `CLIENT_URL` environment variable in Render

3. **Monitor Logs**
   - Check Vercel deployment logs
   - Check Render backend logs
   - Verify API calls are successful

## Troubleshooting:

- **404 on routes**: Add rewrite rules in vercel.json
- **API calls failing**: Check VITE_API_URL is correct
- **CORS errors**: Verify CLIENT_URL in Render backend
- **Images not loading**: Check GridFS endpoint is public (no auth)
