#!/bin/bash

echo "🚀 Starting Productr Application Setup..."

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB first."
    echo "Visit: https://www.mongodb.com/docs/manual/installation/"
    exit 1
fi

# Start MongoDB (for macOS)
echo "📦 Starting MongoDB..."
brew services start mongodb-community 2>/dev/null || mongod --config /usr/local/etc/mongod.conf --fork 2>/dev/null || echo "MongoDB may already be running or needs manual start"

# Wait for MongoDB to start
sleep 3

# Install backend dependencies
echo "📥 Installing backend dependencies..."
cd server
npm install

# Seed database
echo "🌱 Seeding database with sample data..."
npm run seed

# Go back to root
cd ..

# Install frontend dependencies
echo "📥 Installing frontend dependencies..."
cd client
npm install

cd ..

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd client && npm run dev"
echo ""
echo "🌐 Frontend will be available at: http://localhost:5173"
echo "🔌 Backend will be available at: http://localhost:5000"
echo ""
echo "Test credentials:"
echo "  Email: test@productr.com"
echo "  Phone: 1234567890"
echo "  (OTP will be shown in server console)"
