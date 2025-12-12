# Productr - Quick Reference

## 🚀 Quick Start

### Start Application
```bash
# Terminal 1 - Backend
./start-backend.sh

# Terminal 2 - Frontend  
./start-frontend.sh
```

### Access
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001

### Test Login
- **Email**: test@productr.com
- **Phone**: 1234567890
- **OTP**: Check backend console

## 📁 Project Structure
```
Orufy_Tech/
├── client/          # React frontend
├── server/          # Node.js backend
├── README.md        # Full documentation
├── DEPLOYMENT.md    # Deployment guide
└── PROJECT_SUMMARY.md  # This summary
```

## 🔧 Common Commands

### Backend
```bash
cd server
npm install          # Install dependencies
npm start           # Start production server
node server.js      # Start development server
npm run seed        # Seed database
```

### Frontend
```bash
cd client
npm install          # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production
```

### Database
```bash
mongod              # Start MongoDB
mongo               # Open MongoDB shell
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Send OTP
- `POST /api/auth/verify-otp` - Verify & login
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/publish` - Toggle publish

## 🎨 Pages

1. **Login** (`/login`) - Email/Phone authentication
2. **OTP** (`/verify-otp`) - OTP verification
3. **Home** (`/home`) - Published/Unpublished products
4. **Products** (`/products`) - Product management

## 🧩 Components

- `Layout` - Main layout with sidebar
- `Sidebar` - Navigation menu
- `ProductCard` - Product display card
- `AddProductModal` - Create product form
- `EditProductModal` - Update product form
- `PrivateRoute` - Auth protection

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/productr
JWT_SECRET=your_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5001/api
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Or change port in server/.env
PORT=5002
```

### MongoDB Not Running
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Check CLIENT_URL in backend .env
- Verify API_URL in frontend .env
- Restart both servers

## 📦 Features Checklist

- [x] User Authentication (Email/Phone)
- [x] OTP Verification
- [x] Product CRUD Operations
- [x] Image Upload (Multiple)
- [x] Publish/Unpublish Products
- [x] Product Categories
- [x] Stock Management
- [x] Responsive Design
- [x] Form Validation
- [x] Error Handling
- [x] Loading States
- [x] Toast Notifications
- [x] Protected Routes
- [x] JWT Authentication

## 📝 Testing Flow

1. **Login**
   - Enter test@productr.com
   - Check console for OTP
   - Enter OTP
   - Redirects to Home

2. **View Products**
   - See published products
   - Switch to unpublished tab
   - Navigate to Products page

3. **Add Product**
   - Click "Add Products"
   - Fill form
   - Upload images
   - Submit

4. **Edit Product**
   - Click "Edit" on card
   - Modify fields
   - Update images
   - Save

5. **Publish**
   - Click "Publish" button
   - Product moves to Published tab

6. **Delete**
   - Click trash icon
   - Confirm deletion

## 🚀 Deployment

### Quick Deploy
1. Push to GitHub
2. Deploy frontend to Vercel
3. Deploy backend to Render
4. Set up MongoDB Atlas
5. Update environment variables
6. Test production app

See **GITHUB_HOSTING.md** for detailed instructions.

## 📚 Documentation Files

- `README.md` - Complete setup guide
- `DEPLOYMENT.md` - Deployment instructions
- `PROJECT_SUMMARY.md` - Feature summary
- `GITHUB_HOSTING.md` - GitHub & hosting guide
- `QUICK_REFERENCE.md` - This file

## 🆘 Need Help?

1. Check documentation files
2. Review error logs
3. Verify environment variables
4. Test each component separately
5. Check MongoDB connection

## 🎯 Next Steps

1. [ ] Test all features locally
2. [ ] Push code to GitHub
3. [ ] Deploy to production
4. [ ] Add custom domain
5. [ ] Set up monitoring
6. [ ] Add more features

---

**Made with ❤️ for Orufy Tech Assignment**
