import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import { productService } from '../services/productService';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      showToast('Failed to fetch products', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddProduct = async (formData) => {
    try {
      await productService.createProduct(formData);
      showToast('Product added successfully!', 'success');
      setShowAddModal(false);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add product', 'error');
      throw err;
    }
  };

  const handleEditProduct = async (productId, formData) => {
    try {
      await productService.updateProduct(productId, formData);
      showToast('Product updated successfully!', 'success');
      setShowEditModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update product', 'error');
      throw err;
    }
  };

  const handleTogglePublish = async (productId) => {
    try {
      await productService.togglePublish(productId);
      showToast('Product status updated!', 'success');
      fetchProducts();
    } catch (err) {
      showToast('Failed to update product status', 'error');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        showToast('Product deleted successfully!', 'success');
        fetchProducts();
      } catch (err) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  return (
    <Layout>
      <div className="products-page">
        <div className="products-header">
          <h1>Products</h1>
          {products.length > 0 && (
            <button
              className="add-product-btn"
              onClick={() => setShowAddModal(true)}
            >
              ➕ Add Products
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <img src="/images/products-icon-blue.svg" alt="No products" style={{ width: '80px', height: '80px' }} />
            </div>
            <h3>Feels a little empty over here...</h3>
            <p>
              You can create products without connecting store<br />
              you can add products to store anytime
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              Add your Products
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onTogglePublish={handleTogglePublish}
                onDelete={handleDelete}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        )}

        {showAddModal && (
          <AddProductModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddProduct}
          />
        )}

        {showEditModal && selectedProduct && (
          <EditProductModal
            product={selectedProduct}
            onClose={() => {
              setShowEditModal(false);
              setSelectedProduct(null);
            }}
            onSubmit={handleEditProduct}
          />
        )}

        {toast && (
          <div className={`toast ${toast.type}`}>
            <span className="toast-message">
              {toast.type === 'success' ? '✅' : '❌'} {toast.message}
            </span>
            <button className="toast-close" onClick={() => setToast(null)}>
              ×
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
