import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', icon: '/images/home-icon.svg' },
    { path: '/products', label: 'Products', icon: '/images/products-icon.svg' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/images/logo-light.png" alt="Productr" style={{ height: '32px' }} />
      </div>

      <div className="sidebar-search">
        <input type="text" placeholder="🔍 Search" />
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <img src={item.icon} alt={item.label} className="nav-item-icon" style={{ width: '20px', height: '20px' }} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
