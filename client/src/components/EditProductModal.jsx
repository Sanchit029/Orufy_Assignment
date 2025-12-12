import { useState } from 'react';
import './ProductModal.css';

const EditProductModal = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: product.name || '',
    productType: product.productType || '',
    quantityStock: product.quantityStock || '',
    mrp: product.mrp || '',
    sellingPrice: product.sellingPrice || '',
    brandName: product.brandName || '',
    exchangeEligibility: product.exchangeEligibility || 'No'
  });
  const [existingImages, setExistingImages] = useState(product.images || []);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const productTypes = ['Foods', 'Electronics', 'Clothes', 'Beauty Products', 'Others'];
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const getImageUrl = (image) => {
    if (!image) return null;
    // If image is a string (old format), use it directly
    if (typeof image === 'string') {
      return image.startsWith('http') ? image : `${API_URL.replace('/api', '')}${image}`;
    }
    // If image is an object with fileId (new GridFS format)
    if (image.fileId) {
      return `${API_URL}/products/image/${image.fileId}`;
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.productType) newErrors.productType = 'Product type is required';
    if (!formData.quantityStock || formData.quantityStock < 0) 
      newErrors.quantityStock = 'Valid quantity is required';
    if (!formData.mrp || formData.mrp < 0) 
      newErrors.mrp = 'Valid MRP is required';
    if (!formData.sellingPrice || formData.sellingPrice < 0) 
      newErrors.sellingPrice = 'Valid selling price is required';
    if (!formData.brandName.trim()) newErrors.brandName = 'Brand name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    // Add existing images as JSON string
    submitData.append('existingImages', JSON.stringify(existingImages));
    
    // Add new images
    newImages.forEach(image => {
      submitData.append('images', image);
    });
    
    try {
      await onSubmit(product._id, submitData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="CakeZone Walnut Brownie"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label>Product Type</label>
              <select
                name="productType"
                className="form-control"
                value={formData.productType}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Select product type</option>
                {productTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.productType && <div className="error-text">{errors.productType}</div>}
            </div>

            <div className="form-group">
              <label>Quantity Stock</label>
              <input
                type="number"
                name="quantityStock"
                className="form-control"
                placeholder="Total numbers of Stock available"
                value={formData.quantityStock}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.quantityStock && <div className="error-text">{errors.quantityStock}</div>}
            </div>

            <div className="form-group">
              <label>MRP</label>
              <input
                type="number"
                name="mrp"
                className="form-control"
                value={formData.mrp}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.mrp && <div className="error-text">{errors.mrp}</div>}
            </div>

            <div className="form-group">
              <label>Selling Price</label>
              <input
                type="number"
                name="sellingPrice"
                className="form-control"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.sellingPrice && <div className="error-text">{errors.sellingPrice}</div>}
            </div>

            <div className="form-group">
              <label>Brand Name</label>
              <input
                type="text"
                name="brandName"
                className="form-control"
                value={formData.brandName}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.brandName && <div className="error-text">{errors.brandName}</div>}
            </div>

            <div className="form-group">
              <label>Upload Product Images</label>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="file-preview-container">
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="file-preview">
                      <img src={getImageUrl(image)} alt={`Existing ${index + 1}`} />
                      <button
                        type="button"
                        className="file-remove"
                        onClick={() => removeExistingImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* New Images Preview */}
              {newPreviews.length > 0 && (
                <div className="file-preview-container" style={{ marginTop: '12px' }}>
                  {newPreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="file-preview">
                      <img src={preview} alt={`New ${index + 1}`} />
                      <button
                        type="button"
                        className="file-remove"
                        onClick={() => removeNewImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="file-upload-area" onClick={() => document.getElementById('edit-file-input').click()} style={{ marginTop: '12px' }}>
                <input
                  id="edit-file-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <div className="upload-icon">📁</div>
                <div className="upload-text">
                  Add More Photos<br />
                  <span className="upload-browse">Browse</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Exchange or return eligibility</label>
              <select
                name="exchangeEligibility"
                className="form-control"
                value={formData.exchangeEligibility}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
