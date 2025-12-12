const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User.model');
const Product = require('../models/Product.model');

dotenv.config();

// Sample products data based on Figma designs
const sampleProducts = [
  {
    name: 'CakeZone Walnut Brownie',
    productType: 'Foods',
    quantityStock: 200,
    mrp: 2000,
    sellingPrice: 2000,
    brandName: 'CakeZone',
    exchangeEligibility: 'Yes',
    isPublished: false,
    images: []
  },
  {
    name: 'CakeZone Choco Fudge Brownie',
    productType: 'Foods',
    quantityStock: 200,
    mrp: 23,
    sellingPrice: 80,
    brandName: 'CakeZone',
    exchangeEligibility: 'Yes',
    isPublished: true,
    images: []
  },
  {
    name: 'Theobroma Christmas Cake',
    productType: 'Foods',
    quantityStock: 200,
    mrp: 23,
    sellingPrice: 80,
    brandName: 'CakeZone',
    exchangeEligibility: 'Yes',
    isPublished: false,
    images: []
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create a test user
    const user = await User.create({
      email: 'test@productr.com',
      phone: '1234567890',
      isVerified: true
    });

    console.log('👤 Created test user:', user.email);

    // Create products
    const products = await Product.insertMany(
      sampleProducts.map(product => ({
        ...product,
        createdBy: user._id
      }))
    );

    console.log(`📦 Created ${products.length} sample products`);
    
    console.log('\n✨ Seed data inserted successfully!\n');
    console.log('Test user credentials:');
    console.log('Email: test@productr.com');
    console.log('Phone: 1234567890');
    console.log('\nUse these credentials to login. OTP will be displayed in server console.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
