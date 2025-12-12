# Productr - Product Management Platform

A full-stack product management application built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Login with email/phone and OTP verification
- **Product Management**: Complete CRUD operations for products
- **Product Categories**: Foods, Electronics, Clothes, Beauty Products, Others
- **Publish/Unpublish**: Control product visibility
- **Image Upload**: Multiple product images support
- **Responsive Design**: Mobile-first approach matching Figma designs

## 📋 Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Axios
- CSS3 (Custom styling matching Figma)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (for file uploads)
- bcrypt (password hashing)

## 📁 Project Structure

```
Orufy_Tech/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── uploads/          # Uploaded files
│   ├── server.js         # Entry point
│   └── package.json
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in server directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/productr
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. (Optional) Seed the database with sample data:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in client directory:
```env
VITE_API_URL=http://localhost:5001/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### Quick Start (Both Frontend & Backend)

You can use the provided shell scripts to start both servers:

```bash
# Start backend
./start-backend.sh

# Start frontend (in a new terminal)
./start-frontend.sh
```

## 🔑 Environment Variables

### Server (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5001 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/productr |
| JWT_SECRET | Secret key for JWT | your_secret_key |
| NODE_ENV | Environment mode | development |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

### Client (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5001/api |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/phone
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/publish` - Toggle publish status

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String,
  phone: String,
  otp: String,
  otpExpiry: Date,
  isVerified: Boolean,
  createdAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  productType: String (Foods/Electronics/Clothes/Beauty Products/Others),
  quantityStock: Number,
  mrp: Number,
  sellingPrice: Number,
  brandName: String,
  images: [String],
  exchangeEligibility: String (Yes/No),
  isPublished: Boolean,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Test User Credentials
For development, you can use any email/phone. OTP will be logged in the server console.

### Sample Products
The application includes seed data with sample products (CakeZone Walnut Brownie, CakeZone Choco Fudge Brownie, Theobroma Christmas Cake).

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend:
```bash
cd client
npm run build
```

2. Deploy the `dist/` folder to Vercel or Netlify

3. Set environment variable:
   - `VITE_API_URL`: Your backend API URL

### Backend Deployment (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### MongoDB Atlas
1. Create a cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in environment variables

## 📝 Usage

1. **Login**: Enter email or phone number on the login page
2. **Verify OTP**: Enter the 6-digit OTP (check server console in dev mode)
3. **View Products**: See all products on the home page (Published tab)
4. **Add Product**: Click "Add Products" button and fill in the form
5. **Edit Product**: Click "Edit" button on any product card
6. **Publish/Unpublish**: Toggle product visibility with Publish/Unpublish button
7. **Delete Product**: Click delete icon to remove product

## 🎨 Design

The UI is built to exactly match the Figma design specifications with:
- Custom color scheme (navy blue primary, gradient backgrounds)
- Product cards with image, details, and action buttons
- Modal forms for add/edit operations
- Responsive sidebar navigation
- Loading states and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License

## 👤 Author

Sanchit Bishnoi

## 🔗 Links

- GitHub Repository: [Add your repo link]
- Live Demo: [Add your deployment link]

---

For any issues or questions, please open an issue on GitHub.
