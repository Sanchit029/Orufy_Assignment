import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import './Home.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('published');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const isPublished = activeTab === 'published';
      const response = await productService.getAllProducts(isPublished);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (productId) => {
    try {
      await productService.togglePublish(productId);
      fetchProducts();
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        fetchProducts();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  return (
    <Layout>
      <div className="home-page">
        <div className="home-tabs">
          <div
            className={`tab ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published
          </div>
          <div
            className={`tab ${activeTab === 'unpublished' ? 'active' : ''}`}
            onClick={() => setActiveTab('unpublished')}
          >
            Unpublished
          </div>
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
            <h3>No {activeTab === 'published' ? 'Published' : 'Unpublished'} Products</h3>
            <p>
              {activeTab === 'published'
                ? 'Your Published Products will appear here. Create your first product to publish'
                : 'Your Unpublished Products will appear here'}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Go to Products
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
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
