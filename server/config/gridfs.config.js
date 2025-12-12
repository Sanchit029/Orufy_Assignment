const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

let gfs, gridfsBucket;

// Initialize GridFS bucket after MongoDB connection
const initGridFS = () => {
  const db = mongoose.connection.db;
  gridfsBucket = new GridFSBucket(db, {
    bucketName: 'uploads'
  });
  
  // Legacy GridFS stream (for compatibility)
  gfs = gridfsBucket;
  
  console.log('✅ GridFS initialized');
  return gridfsBucket;
};

// Multer storage engine for GridFS
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Upload file to GridFS
const uploadToGridFS = async (file) => {
  return new Promise((resolve, reject) => {
    if (!gridfsBucket) {
      return reject(new Error('GridFS not initialized'));
    }

    const filename = `${crypto.randomBytes(16).toString('hex')}${path.extname(file.originalname)}`;
    
    const uploadStream = gridfsBucket.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: {
        originalName: file.originalname,
        uploadDate: new Date()
      }
    });

    uploadStream.on('error', reject);
    uploadStream.on('finish', () => {
      resolve({
        id: uploadStream.id,
        filename: filename,
        contentType: file.mimetype
      });
    });

    uploadStream.end(file.buffer);
  });
};

// Delete file from GridFS
const deleteFromGridFS = async (fileId) => {
  if (!gridfsBucket) {
    throw new Error('GridFS not initialized');
  }

  try {
    await gridfsBucket.delete(new mongoose.Types.ObjectId(fileId));
    return true;
  } catch (error) {
    console.error('Error deleting file from GridFS:', error);
    throw error;
  }
};

// Get file stream from GridFS
const getFileStream = (fileId) => {
  if (!gridfsBucket) {
    throw new Error('GridFS not initialized');
  }

  return gridfsBucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
};

// Get file info from GridFS
const getFileInfo = async (fileId) => {
  if (!gridfsBucket) {
    throw new Error('GridFS not initialized');
  }

  const files = await gridfsBucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
  return files.length > 0 ? files[0] : null;
};

module.exports = {
  initGridFS,
  upload,
  uploadToGridFS,
  deleteFromGridFS,
  getFileStream,
  getFileInfo,
  getGridFSBucket: () => gridfsBucket
};
