import { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onTogglePublish, onDelete, onEdit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const getImageUrl = (image) => {
    if (!image) return null;
    // If image is a string (old format), use it directly
    if (typeof image === 'string') {
      const url = image.startsWith('http') ? image : `${API_URL.replace('/api', '')}${image}`;
      return url;
    }
    // If image is an object with fileId (new GridFS format)
    if (image.fileId) {
      return `${API_URL}/products/image/${image.fileId}`;
    }
    return null;
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', product.images[currentImageIndex]);
    console.error('Attempted URL:', e.target.src);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(product);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {product.images && product.images.length > 0 ? (
          <>
            <img
              src={getImageUrl(product.images[currentImageIndex])}
              alt={product.name}
              className="product-image"
              onError={handleImageError}
            />
            {product.images.length > 1 && (
              <>
                <button className="image-nav-btn prev-btn" onClick={handlePrevImage}>
                  ‹
                </button>
                <button className="image-nav-btn next-btn" onClick={handleNextImage}>
                  ›
                </button>
                <div className="product-indicator">
                  {product.images.map((_, index) => (
                    <div
                      key={index}
                      className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="product-image-placeholder">📦</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-details">
          <div className="product-detail-row">
            <span className="product-detail-label">Product type -</span>
            <span className="product-detail-value">{product.productType}</span>
          </div>
          <div className="product-detail-row">
            <span className="product-detail-label">Quantity Stock -</span>
            <span className="product-detail-value">{product.quantityStock}</span>
          </div>
          <div className="product-detail-row">
            <span className="product-detail-label">MRP -</span>
            <span className="product-detail-value">₹ {product.mrp}</span>
          </div>
          <div className="product-detail-row">
            <span className="product-detail-label">Selling Price -</span>
            <span className="product-detail-value">₹ {product.sellingPrice}</span>
          </div>
          <div className="product-detail-row">
            <span className="product-detail-label">Brand Name -</span>
            <span className="product-detail-value">{product.brandName}</span>
          </div>
          <div className="product-detail-row">
            <span className="product-detail-label">Total Number of images -</span>
            <span className="product-detail-value">{product.images?.length || 0}</span>
          </div>
          <div className="product-detail-row">
            <span className="product-detail-label">Exchange Eligibility -</span>
            <span className="product-detail-value">{product.exchangeEligibility}</span>
          </div>
        </div>
      </div>

      <div className="product-actions">
        <button
          className={`action-btn ${product.isPublished ? 'btn-unpublish' : 'btn-publish'}`}
          onClick={() => onTogglePublish(product._id)}
        >
          {product.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        
        <button className="action-btn btn-edit" onClick={handleEdit}>
          Edit 📋
        </button>
        
        <button className="btn-delete" onClick={() => onDelete(product._id)}>
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
