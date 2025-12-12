const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['Foods', 'Electronics', 'Clothes', 'Beauty Products', 'Others']
  },
  quantityStock: {
    type: Number,
    required: [true, 'Quantity stock is required'],
    min: [0, 'Quantity cannot be negative']
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: [0, 'MRP cannot be negative']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price cannot be negative']
  },
  brandName: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true
  },
  images: [{
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    filename: String,
    contentType: String
  }],
  exchangeEligibility: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
productSchema.index({ createdBy: 1 });
productSchema.index({ isPublished: 1 });
productSchema.index({ productType: 1 });

module.exports = mongoose.model('Product', productSchema);
