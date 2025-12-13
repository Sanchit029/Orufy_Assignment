const Product = require('../models/Product.model');
const { uploadToGridFS, deleteFromGridFS } = require('../config/gridfs.config');
const mongoose = require('mongoose');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getAllProducts = async (req, res, next) => {
  try {
    const { published } = req.query;
    
    let filter = { createdBy: req.user._id };
    
    if (published !== undefined) {
      filter.isPublished = published === 'true';
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'email phone')
      .lean(); // Convert to plain JS objects to avoid BSON issues

    // Sanitize products to ensure proper serialization
    const sanitizedProducts = products.map(product => ({
      ...product,
      images: product.images.map(img => {
        // Handle both old string format and new GridFS format
        if (typeof img === 'string') {
          return { fileId: null, filename: img, contentType: 'image/jpeg' };
        }
        return {
          fileId: img.fileId ? img.fileId.toString() : null,
          filename: img.filename,
          contentType: img.contentType
        };
      })
    }));

    res.status(200).json({
      success: true,
      count: sanitizedProducts.length,
      data: sanitizedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'email phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this product'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res, next) => {
  try {
    const { name, productType, quantityStock, mrp, sellingPrice, brandName, exchangeEligibility } = req.body;

    // Handle image uploads to GridFS
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToGridFS(file));
      const uploadResults = await Promise.all(uploadPromises);
      images = uploadResults.map(result => ({
        fileId: new mongoose.Types.ObjectId(result.id),
        filename: result.filename,
        contentType: result.contentType
      }));
    }

    const product = await Product.create({
      name,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      images,
      exchangeEligibility,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    const { name, productType, quantityStock, mrp, sellingPrice, brandName, exchangeEligibility, existingImages } = req.body;

    // Handle existing images
    let images = [];
    if (existingImages) {
      try {
        images = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        images = Array.isArray(images) ? images : [images];
      } catch (e) {
        images = [];
      }
    }
    
    // Handle new image uploads to GridFS
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToGridFS(file));
      const uploadResults = await Promise.all(uploadPromises);
      const newImages = uploadResults.map(result => ({
        fileId: new mongoose.Types.ObjectId(result.id),
        filename: result.filename,
        contentType: result.contentType
      }));
      images = [...images, ...newImages];
    }

    // Delete old images from GridFS that are no longer used
    const existingFileIds = images.map(img => img.fileId?.toString());
    const oldImages = product.images.filter(img => !existingFileIds.includes(img.fileId?.toString()));
    
    for (const img of oldImages) {
      try {
        await deleteFromGridFS(img.fileId);
      } catch (err) {
        console.error('Error deleting old image from GridFS:', err);
      }
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        productType,
        quantityStock,
        mrp,
        sellingPrice,
        brandName,
        images,
        exchangeEligibility
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    // Delete associated images from GridFS
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        try {
          await deleteFromGridFS(img.fileId);
        } catch (err) {
          console.error('Error deleting image from GridFS:', err);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle publish status
// @route   PATCH /api/products/:id/publish
// @access  Private
exports.togglePublish = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this product'
      });
    }

    product.isPublished = !product.isPublished;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isPublished ? 'published' : 'unpublished'} successfully`,
      data: product
    });
  } catch (error) {
    next(error);
  }
};
