# Productr - Deployment & Submission Guide

## 📦 Project Overview

**Productr** is a full-stack product management platform built with:
- **Frontend**: React.js + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT with OTP verification

---

## 🚀 How to Run the Application

### Prerequisites
- Node.js (v16+)
- MongoDB (running on localhost:27017 or MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file** with the following variables:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/productr
   JWT_SECRET=your_jwt_secret_key_change_in_production
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **(Optional) Seed database with sample data**:
   ```bash
   npm run seed
   ```

5. **Start the backend server**:
   ```bash
   npm run dev
   ```
   
   Server runs on: `http://localhost:5001`

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file** with:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

4. **Start the frontend server**:
   ```bash
   npm run dev
   ```
   
   Frontend runs on: `http://localhost:5173`

### Quick Start Scripts

Use the provided shell scripts to start both servers easily:

```bash
# Terminal 1: Start backend
./start-backend.sh

# Terminal 2: Start frontend
./start-frontend.sh
```

---

## 🔐 Required Environment Variables

### Server Environment Variables (server/.env)

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `PORT` | Backend server port | `5001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/productr` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secure_secret_key` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Client Environment Variables (client/.env)

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5001/api` |

---

## 📁 Folder Structure

```
Orufy_Tech/
├── client/                    # Frontend React application
│   ├── public/
│   │   └── images/           # Logo and icon assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components (Login, Home, Products)
│   │   ├── services/         # API service layer
│   │   ├── context/          # React Context (Auth)
│   │   └── App.jsx           # Main app component
│   ├── .env                  # Frontend environment variables
│   └── package.json
│
├── server/                   # Backend Node.js application
│   ├── models/              # MongoDB schemas (User, Product)
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth, upload, error handling
│   ├── uploads/             # Uploaded product images
│   ├── utils/               # Utilities and seed script
│   ├── .env                 # Backend environment variables
│   ├── server.js            # Server entry point
│   └── package.json
│
├── README.md                # Main documentation
├── .gitignore              # Git ignore rules
└── start-*.sh              # Startup scripts
```

---

## 🧪 Testing the Application

### Test Credentials

Use any email or phone number for login. The system will:
1. Generate a 6-digit OTP (displayed in server console)
2. Auto-create user account if doesn't exist
3. Log you in after OTP verification

**Example**:
- Email: `test@productr.com`
- Phone: `1234567890`

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Send OTP to email/phone
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products (optional: `?published=true`)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (requires auth + images)
- `PUT /api/products/:id` - Update product (requires auth)
- `DELETE /api/products/:id` - Delete product (requires auth)
- `PATCH /api/products/:id/publish` - Toggle publish status (requires auth)

---

## 🎨 Features Implemented

✅ User authentication with OTP
✅ Auto signup on first login
✅ Product CRUD operations
✅ Multiple image upload per product
✅ Image carousel with navigation arrows
✅ Publish/Unpublish products
✅ Product filtering (Published/Unpublished)
✅ Responsive design matching Figma
✅ Custom logo and icons
✅ Protected routes
✅ JWT token management
✅ File upload with Multer
✅ MongoDB integration
✅ Error handling
✅ Loading states
✅ Toast notifications

---

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)

**Frontend (Vercel)**:
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `client`
4. Add environment variable: `VITE_API_URL=<your-backend-url>/api`
5. Deploy

**Backend (Render)**:
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set root directory to `server`
4. Add all environment variables
5. Deploy

### Option 2: Heroku (Both)

Deploy both frontend and backend as separate Heroku apps with appropriate build packs.

### Option 3: DigitalOcean App Platform

Deploy as a monorepo with both client and server components.

---

## 📋 Submission Checklist

✅ Clear folder structure (`client/` and `server/`)
✅ README.md with setup instructions
✅ Environment variables documented
✅ `.gitignore` configured
✅ Code committed to GitHub
✅ Application tested locally
✅ All features working
✅ No sensitive data in repository

---

## 🔗 GitHub Repository

**Repository**: https://github.com/Sanchit029/chatbot-ai-assessment

### How to Push to GitHub

```bash
# If not already initialized
git init
git branch -m main

# Add all files
git add .

# Commit
git commit -m "Initial commit: Complete Productr application"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/your-username/your-repo.git

# Push to GitHub
git push -u origin main
```

---

## 📞 Support

For any issues or questions:
- Check the README.md for detailed documentation
- Review the API endpoints in the code
- Check MongoDB connection and environment variables
- Ensure both servers are running on correct ports

---

## 📝 Notes

- The application uses port **5001** for backend (not 5000 due to macOS Airplay)
- MongoDB must be running before starting the backend
- Frontend auto-reloads on code changes
- Backend uses nodemon for auto-restart in development
- Images are stored in `server/uploads/` directory
- JWT tokens are stored in localStorage
- OTP expires after 10 minutes

---

**Built with ❤️ for Orufy Technologies Pvt. Ltd.**
